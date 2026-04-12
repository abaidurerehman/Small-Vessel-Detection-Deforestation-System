/**
 * Generate and download a PDF report for detection results.
 * Uses jsPDF directly — no html2canvas needed, works offline.
 */
export async function downloadDetectionPdf({ type, result, imageDataUrl }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  const isVessel = type === 'vessel';
  const accentR = isVessel ? 56  : 34;
  const accentG = isVessel ? 189 : 197;
  const accentB = isVessel ? 248 : 94;

  // ── Header bar ─────────────────────────────────────────────────────
  doc.setFillColor(accentR, accentG, accentB);
  doc.rect(0, 0, W, 28, 'F');
  doc.setTextColor(5, 8, 16);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(isVessel ? ' Vessel Detection Report' : ' Deforestation Detection Report', margin, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 20);
  doc.text(`Model: ${result.model_version}`, W - margin, 20, { align: 'right' });
  y = 36;

  // ── Summary boxes ──────────────────────────────────────────────────
  doc.setTextColor(30, 30, 30);
  const boxes = isVessel
    ? [
        { label: 'Vessels Detected', value: String(result.vessel_count) },
        { label: 'Avg Confidence',   value: result.average_confidence_percent },
        { label: 'Inference Time',   value: result.inference_time_str },
        { label: 'Image Size',       value: `${result.image_size?.width}×${result.image_size?.height}px` },
      ]
    : [
        { label: 'Total Detections', value: String(result.total_detections) },
        { label: 'Avg Confidence',   value: result.average_confidence_percent },
        { label: 'Image Size',       value: `${result.image_size?.width}×${result.image_size?.height}px` },
        { label: 'Model',            value: result.model_version?.replace('model-YOLO','') },
      ];

  const bw = (W - margin * 2 - 9) / 4;
  boxes.forEach((b, i) => {
    const bx = margin + i * (bw + 3);
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(bx, y, bw, 18, 2, 2, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentR, accentG, accentB);
    doc.text(b.value, bx + bw / 2, y + 9, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(b.label.toUpperCase(), bx + bw / 2, y + 15, { align: 'center' });
  });
  y += 26;

  // ── Annotated image ────────────────────────────────────────────────
  if (imageDataUrl) {
    try {
      const imgW = W - margin * 2;
      const imgH = 70;
      doc.setFillColor(10, 10, 10);
      doc.rect(margin, y, imgW, imgH, 'F');
      doc.addImage(imageDataUrl, 'JPEG', margin, y, imgW, imgH, '', 'FAST');
      doc.setFontSize(7);
      doc.setTextColor(120,120,120);
      doc.text('Detection Results — Annotated Output', margin, y + imgH + 4);
      y += imgH + 10;
    } catch (_) {}
  }

  // ── Detections table ───────────────────────────────────────────────
  const detections = result.detections || [];
  if (detections.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Detection Details', margin, y);
    y += 6;

    // Table header
    const cols = ['#', 'Class', 'Confidence', 'BBox (x, y, w, h)'];
    const cw   = [10, 45, 35, 85];
    let cx = margin;
    doc.setFillColor(accentR, accentG, accentB);
    doc.rect(margin, y, W - margin * 2, 7, 'F');
    doc.setTextColor(5, 8, 16);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    cols.forEach((c, i) => { doc.text(c, cx + 2, y + 5); cx += cw[i]; });
    y += 8;

    // Rows
    detections.forEach((det, ri) => {
      if (y > 265) { doc.addPage(); y = margin; }
      doc.setFillColor(ri % 2 === 0 ? 250 : 255, ri % 2 === 0 ? 250 : 255, ri % 2 === 0 ? 252 : 255);
      doc.rect(margin, y, W - margin * 2, 6.5, 'F');
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      cx = margin;
      const bb = det.bbox || det.bounding_box || {};
      const row = [
        String(det.id),
        det.class,
        det.confidence?.toFixed(3) ?? '-',
        `(${(bb.x||0).toFixed(1)}, ${(bb.y||0).toFixed(1)}, ${(bb.width||0).toFixed(1)}, ${(bb.height||0).toFixed(1)})`,
      ];
      row.forEach((v, i) => { doc.text(String(v), cx + 2, y + 4.5); cx += cw[i]; });
      y += 7;
    });
    y += 4;
  }

  // ── Class counts ───────────────────────────────────────────────────
  const counts = result.class_counts || {};
  if (Object.keys(counts).length > 0) {
    if (y > 250) { doc.addPage(); y = margin; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Detections by Class', margin, y); y += 6;
    Object.entries(counts).sort().forEach(([cls, cnt]) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`• ${cls}: ${cnt}`, margin + 4, y); y += 6;
    });
  }

  // ── Footer ─────────────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(160,160,160);
    doc.text('Small Vessel Detection & Deforestation System — UET Lahore, Narowal Campus',
      W / 2, 292, { align: 'center' });
    doc.text(`Page ${p} of ${pages}`, W - margin, 292, { align: 'right' });
  }

  const filename = isVessel
    ? `vessel-detection-${Date.now()}.pdf`
    : `deforestation-detection-${Date.now()}.pdf`;
  doc.save(filename);
}
