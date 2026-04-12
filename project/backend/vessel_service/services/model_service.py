import base64
import io
import logging
import os
import time
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
from PIL import Image

logger = logging.getLogger(__name__)

MODEL_PATH   = os.getenv("MODEL_PATH", "/app/models/Vesselmodel.pt")
CONF_DEFAULT = float(os.getenv("CONF_THRESHOLD", "0.25"))


class VesselModelService:
    def __init__(self):
        self.model        = None
        self.model_loaded = False
        self.class_names: List[str] = []

    def load_model(self):
        path = Path(MODEL_PATH)
        if not path.exists():
            logger.warning(f"Model not found at {path}. Simulation mode active.")
            return
        try:
            from ultralytics import YOLO
            logger.info(f"Loading Vesselmodel from {path} …")
            self.model = YOLO(str(path))
            self.class_names = list(self.model.names.values())
            self.model_loaded = True
            logger.info(f"Vesselmodel ready. Classes: {self.class_names}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}", exc_info=True)
            self.model = None

    def predict(self, image_bytes: bytes,
                conf: float = CONF_DEFAULT,
                iou:  float = 0.45) -> Dict[str, Any]:
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid image: {e}")
        return self._run_yolo(img, conf, iou) if self.model else self._simulate(img)

    def _run_yolo(self, img: Image.Image, conf: float, iou: float) -> Dict[str, Any]:
        import cv2
        # Pass directly as numpy — exactly like your notebook, NO resizing
        image_np = np.array(img)
        logger.info(f"Inference: shape={image_np.shape} conf={conf} iou={iou}")

        start = time.time()
        results = self.model(image_np, conf=conf, iou=iou, verbose=False)
        ms = (time.time() - start) * 1000

        boxes          = results[0].boxes
        num_detections = len(boxes)
        logger.info(f"Result: {num_detections} detections at conf={conf}")

        annotated_bgr = results[0].plot()
        annotated_pil = Image.fromarray(cv2.cvtColor(annotated_bgr, cv2.COLOR_BGR2RGB))

        results_text  = f"**Detections Found: {num_detections}**\n\n"
        detections:   List[Dict]     = []
        class_counts: Dict[str, int] = {}

        if num_detections > 0:
            results_text += "| # | Class | Confidence | BBox (x, y, w, h) |\n"
            results_text += "|---|-------|------------|-------------------|\n"
            for idx, box in enumerate(boxes):
                cls        = int(box.cls[0])
                conf_val   = float(box.conf[0])
                xyxy       = box.xyxy[0].cpu().numpy()
                x, y       = float(xyxy[0]), float(xyxy[1])
                w, h       = float(xyxy[2]-xyxy[0]), float(xyxy[3]-xyxy[1])
                class_name = self.model.names[cls]
                results_text += f"| {idx+1} | {class_name} | {conf_val:.3f} | ({x:.1f}, {y:.1f}, {w:.1f}, {h:.1f}) |\n"
                class_counts[class_name] = class_counts.get(class_name, 0) + 1
                detections.append({
                    "id": idx+1, "class": class_name, "class_id": cls,
                    "confidence": round(conf_val, 4),
                    "confidence_percent": f"{conf_val*100:.1f}%",
                    "bbox": {"x": round(x,1), "y": round(y,1),
                             "x2": round(float(xyxy[2]),1), "y2": round(float(xyxy[3]),1),
                             "width": round(w,1), "height": round(h,1)},
                })
        else:
            results_text += "\n*No vessels detected — try lowering confidence to 0.10 or 0.05.*"

        avg_conf = round(sum(d["confidence"] for d in detections)/num_detections, 4) if num_detections else 0.0
        return {
            "vessel_count": num_detections, "class_counts": class_counts,
            "detections": detections, "results_text": results_text,
            "average_confidence": avg_conf,
            "average_confidence_percent": f"{avg_conf*100:.1f}%",
            "inference_time_ms": round(ms, 2), "inference_time_str": f"{ms:.2f} ms",
            "annotated_image": self._to_b64(annotated_pil),
            "image_size": {"width": img.width, "height": img.height},
            "model_version": "Vesselmodel-YOLO", "simulation": False,
        }

    def _simulate(self, img: Image.Image) -> Dict[str, Any]:
        import random
        from PIL import ImageDraw
        n    = random.randint(1,3)
        draw = ImageDraw.Draw(img)
        detections, class_counts = [], {}
        results_text = f"**Detections Found: {n}** *(simulation)*\n\n| # | Class | Confidence | BBox |\n|---|-------|------------|------|\n"
        for i in range(n):
            cls  = "ship"
            conf = round(random.uniform(0.55,0.92),3)
            x1,y1 = random.randint(10,img.width//2), random.randint(10,img.height//2)
            x2,y2 = min(x1+80,img.width-10), min(y1+60,img.height-10)
            draw.rectangle([x1,y1,x2,y2], outline=(56,189,248), width=3)
            class_counts[cls] = class_counts.get(cls,0)+1
            results_text += f"| {i+1} | {cls} | {conf:.3f} | ({float(x1):.1f},{float(y1):.1f},{float(x2-x1):.1f},{float(y2-y1):.1f}) |\n"
            detections.append({"id":i+1,"class":cls,"class_id":0,"confidence":conf,
                "confidence_percent":f"{conf*100:.1f}%",
                "bbox":{"x":float(x1),"y":float(y1),"x2":float(x2),"y2":float(y2),"width":float(x2-x1),"height":float(y2-y1)}})
        avg = round(sum(d["confidence"] for d in detections)/n,4)
        return {"vessel_count":n,"class_counts":class_counts,"detections":detections,
            "results_text":results_text,"average_confidence":avg,
            "average_confidence_percent":f"{avg*100:.1f}% (simulation)",
            "inference_time_ms":0,"inference_time_str":"N/A (simulation)",
            "annotated_image":self._to_b64(img),
            "image_size":{"width":img.width,"height":img.height},
            "model_version":"Vesselmodel-SIMULATION","simulation":True}

    @staticmethod
    def _to_b64(img):
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=88)
        return base64.b64encode(buf.getvalue()).decode()
