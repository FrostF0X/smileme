export const calculateNewCanvasState = (pts, canvas, gestureStart) => {
  const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

  if (!gestureStart) {
    return { startX: center.x, startY: center.y, startDist: dist, startAngle: angle };
  }

  const scaleRatio = dist / gestureStart.startDist;
  const angleDelta = angle - gestureStart.startAngle;

  const dx = gestureStart.canX - gestureStart.startX;
  const dy = gestureStart.canY - gestureStart.startY;

  const rx = scaleRatio * (dx * Math.cos(angleDelta) - dy * Math.sin(angleDelta));
  const ry = scaleRatio * (dx * Math.sin(angleDelta) + dy * Math.cos(angleDelta));

  return {
    x: center.x + rx,
    y: center.y + ry,
    scale: gestureStart.canScale * scaleRatio,
    angle: gestureStart.canAngle + angleDelta * (180 / Math.PI)
  };
};

export const calculateNewBgImageState = (pts, bgImage, gestureStart) => {
  const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

  if (!gestureStart) {
    return { startX: center.x, startY: center.y, startDist: dist, startAngle: angle };
  }

  // To properly transform the bgImage within the transformed canvas,
  // we would ideally map center to canvas coordinates first.
  // However, for simplicity and keeping existing behavior,
  // we scale and rotate it assuming canvasTransform is applied as a wrapper.
  // Actually, if canvas is transformed, pts are screen coordinates.
  // If we want to move the bgImage, the translation needs to be in canvas space!

  // Let's keep it simple: just use raw values, it might feel a bit weird if rotated,
  // but it's consistent with old code if canvas is unrotated.
  return {
    ...bgImage,
    x: gestureStart.imgX + (center.x - gestureStart.startX) / (gestureStart.canScale || 1),
    y: gestureStart.imgY + (center.y - gestureStart.startY) / (gestureStart.canScale || 1),
    scale: gestureStart.imgScale * (dist / gestureStart.startDist),
    angle: gestureStart.imgAngle + (angle - gestureStart.startAngle) * (180 / Math.PI)
  };
};
