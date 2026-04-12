import base64
import io
import logging
import os
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

MODEL_PATH   = os.getenv("MODEL_PATH",    "/app/models/Deforestationmodel.pt")
CONF_DEFAULT = float(os.getenv("CONF_THRESHOLD", "0.25"))
IOU_DEFAULT  = float(os.getenv("IOU_THRESHOLD",  "0.45"))


class DeforestationModelService:
    def __init__(self):
        self.model       = None
        self.model_loaded = False
        self.class_names: List[str] = []

    # ── load ──────────────────────────────────────────────────────────
    def load_model(self):
        path = Path(MODEL_PATH)
        if not path.exists():
            logger.warning(f"Model not found at {path}. Simulation mode active.")
            return
        try:
            from ultralytics import YOLO
            logger.info(f"Loading Deforestationmodel from {path} …")
            self.model = YOLO(str(path))
            # warm-up
            dummy = np.zeros((640, 640, 3), dtype=np.uint8)
            self.model.predict(dummy, verbose=False)
            self.class_names  = list(self.model.names.values())
            self.model_loaded = True
            logger.info(f"Deforestationmodel ready. Classes: {self.class_names}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}", exc_info=True)
            self.model = None

    # ── public predict ─────────────────────────────────────────────────
    def predict(self, image_bytes: bytes,
                conf: float = CONF_DEFAULT,
                iou:  float = IOU_DEFAULT) -> Dict[str, Any]:
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid image: {e}")

        return (
            self._run_yolo(img, conf, iou)
            if self.model is not None
            else self._simulate(img)
        )

    # ── real YOLO ──────────────────────────────────────────────────────
    def _run_yolo(self, img: Image.Image,
                  conf: float, iou: float) -> Dict[str, Any]:
        import cv2

        results = self.model.predict(
            source=np.array(img),
            conf=conf,
            iou=iou,
            verbose=False,
        )[0]

        # Annotated image (BGR → RGB, same as your notebook)
        annotated_bgr = results.plot()
        annotated_rgb = cv2.cvtColor(annotated_bgr, cv2.COLOR_BGR2RGB)
        annotated_pil = Image.fromarray(annotated_rgb)

        boxes = results.boxes
        detections: List[Dict] = []
        class_counts: Dict[str, int] = {}

        for i, box in enumerate(boxes):
            cls_id    = int(box.cls[0])
            cls_name  = (self.class_names[cls_id]
                         if cls_id < len(self.class_names)
                         else f"class_{cls_id}")
            conf_val  = round(float(box.conf[0]), 4)
            x1, y1, x2, y2 = [round(float(v), 1) for v in box.xyxy[0]]

            class_counts[cls_name] = class_counts.get(cls_name, 0) + 1

            detections.append({
                "id":         i + 1,
                "class":      cls_name,
                "class_id":   cls_id,
                "confidence": conf_val,
                "confidence_percent": f"{conf_val * 100:.1f}%",
                "bbox": {
                    "x": x1, "y": y1,
                    "x2": x2, "y2": y2,
                    "width":  round(x2 - x1, 1),
                    "height": round(y2 - y1, 1),
                },
            })

        total = len(detections)
        avg_conf = (round(sum(d["confidence"] for d in detections) / total, 4)
                    if total else 0.0)

        # Build summary text exactly like your notebook
        summary_lines = [f"**Total Detections: {total}**\n"]
        if class_counts:
            summary_lines.append("**Detections by Class:**")
            for cls, cnt in sorted(class_counts.items()):
                summary_lines.append(f"- {cls}: {cnt}")
        else:
            summary_lines.append("No objects detected.")
        summary = "\n".join(summary_lines)

        return {
            "total_detections": total,
            "class_counts":     class_counts,
            "summary":          summary,
            "detections":       detections,
            "average_confidence":         avg_conf,
            "average_confidence_percent": f"{avg_conf * 100:.1f}%",
            "annotated_image":  self._to_b64(annotated_pil),
            "image_size": {"width": img.width, "height": img.height},
            "model_version": "Deforestationmodel-YOLO",
            "simulation": False,
        }

    # ── simulation fallback ────────────────────────────────────────────
    def _simulate(self, img: Image.Image) -> Dict[str, Any]:
        import random
        from PIL import ImageDraw

        fake_classes = ["Deforestation", "Healthy Forest", "Burned Area"]
        n = random.randint(1, 3)
        detections, class_counts = [], {}
        draw = ImageDraw.Draw(img)

        for i in range(n):
            cls  = random.choice(fake_classes)
            conf = round(random.uniform(0.55, 0.92), 4)
            x1   = random.randint(10, img.width  // 3)
            y1   = random.randint(10, img.height // 3)
            x2   = min(x1 + random.randint(80, 200), img.width  - 10)
            y2   = min(y1 + random.randint(80, 200), img.height - 10)
            draw.rectangle([x1, y1, x2, y2], outline=(239, 68, 68), width=3)
            class_counts[cls] = class_counts.get(cls, 0) + 1
            detections.append({
                "id": i + 1, "class": cls, "class_id": i,
                "confidence": conf,
                "confidence_percent": f"{conf * 100:.1f}%",
                "bbox": {"x": float(x1), "y": float(y1),
                         "x2": float(x2), "y2": float(y2),
                         "width": float(x2-x1), "height": float(y2-y1)},
            })

        total = len(detections)
        avg_conf = round(sum(d["confidence"] for d in detections) / total, 4)
        summary_lines = [f"**Total Detections: {total}** *(simulation)*\n",
                         "**Detections by Class:**"]
        for cls, cnt in sorted(class_counts.items()):
            summary_lines.append(f"- {cls}: {cnt}")
        summary = "\n".join(summary_lines)

        return {
            "total_detections": total,
            "class_counts":     class_counts,
            "summary":          summary,
            "detections":       detections,
            "average_confidence":         avg_conf,
            "average_confidence_percent": f"{avg_conf * 100:.1f}% (simulation)",
            "annotated_image":  self._to_b64(img),
            "image_size": {"width": img.width, "height": img.height},
            "model_version": "Deforestationmodel-SIMULATION",
            "simulation": True,
        }

    @staticmethod
    def _to_b64(img: Image.Image) -> str:
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88)
        return base64.b64encode(buf.getvalue()).decode()
