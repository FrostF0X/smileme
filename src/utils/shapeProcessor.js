import Ellipse from '../models/Ellipse';
import Path from '../models/Path';

export const processSnapper = (points, strokeColor) => {
  const pStart = points[0], pEnd = points[points.length - 1];
  const closureDistance = Math.hypot(pEnd.x - pStart.x, pEnd.y - pStart.y);
  let pathLength = 0;
  for (let i = 1; i < points.length; i++) {
    pathLength += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }

  if (closureDistance < (pathLength * 0.2) && points.length > 15) {
    let maxD = 0, p1 = points[0], p2 = points[0];
    const step = Math.max(1, Math.floor(points.length / 50));
    for (let i = 0; i < points.length; i += step) {
      for (let j = i + step; j < points.length; j += step) {
        const d = Math.hypot(points[j].x - points[i].x, points[j].y - points[i].y);
        if (d > maxD) { maxD = d; p1 = points[i]; p2 = points[j]; }
      }
    }
    const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2, rx = maxD / 2;
    const angleRad = Math.atan2(p2.y - p1.y, p2.x - p1.x), angleDeg = angleRad * (180 / Math.PI);
    let maxRy = 0;
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs((p2.x - p1.x) * (p1.y - points[i].y) - (p1.x - points[i].x) * (p2.y - p1.y)) / maxD;
      if (d > maxRy) maxRy = d;
    }
    return new Ellipse({ cx, cy, rx, ry: maxRy, angle: angleDeg, color: strokeColor });
  } else {
    return new Path({ type: 'rawPath', points: [...points], color: strokeColor });
  }
};

const simplifyPath = (points, tolerance) => {
  if (points.length <= 2) return points;
  let maxDist = 0, index = 0, end = points.length - 1;
  for (let i = 1; i < end; i++) {
    const dx = points[end].x - points[0].x, dy = points[end].y - points[0].y;
    const mag = Math.hypot(dx, dy);
    const dist = mag > 0 ? Math.abs(dx * (points[0].y - points[i].y) - (points[0].x - points[i].x) * dy) / mag : Math.hypot(points[i].x - points[0].x, points[i].y - points[0].y);
    if (dist > maxDist) { maxDist = dist; index = i; }
  }
  if (maxDist > tolerance) {
    const left = simplifyPath(points.slice(0, index + 1), tolerance);
    const right = simplifyPath(points.slice(index), tolerance);
    return left.slice(0, -1).concat(right);
  } else return [points[0], points[end]];
};

const pointsToBezierSVG = (points, isClosed) => {
  if (points.length < 3) return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  let pts = [...points];
  if (isClosed) { pts.unshift(pts[pts.length - 2]); pts.push(pts[1]); }
  else { pts.unshift(pts[0]); pts.push(pts[pts.length - 1]); }
  let d = `M ${pts[1].x.toFixed(2)},${pts[1].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i - 1].x) * 0.2, cp1y = pts[i].y + (pts[i + 1].y - pts[i - 1].y) * 0.2;
    const cp2x = pts[i + 1].x - (pts[i + 2].x - pts[i].x) * 0.2, cp2y = pts[i + 1].y - (pts[i + 2].y - pts[i].y) * 0.2;
    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${pts[i + 1].x.toFixed(2)},${pts[i + 1].y.toFixed(2)}`;
  }
  if (isClosed) d += ' Z';
  return d;
};

export const processBezierSmoother = (points, strokeColor, amount, forceClosed) => {
  let pts = [...points];
  const isClosed = forceClosed && pts.length > 3;
  if (isClosed) pts.push({ x: pts[0].x, y: pts[0].y });
  const tolerance = amount === 0 ? 0.5 : (amount / 100) * 20;
  const simplifiedPoints = simplifyPath(pts, tolerance);
  const svgPathD = pointsToBezierSVG(simplifiedPoints, isClosed);
  return new Path({ type: 'bezierPath', d: svgPathD, color: strokeColor });
};

export const processDrawer = (points, strokeColor, amount, forceClosed) => {
  let pts = [...points];
  const isClosed = forceClosed && pts.length > 3;
  if (isClosed) pts.push({ x: pts[0].x, y: pts[0].y });
  const tolerance = amount === 0 ? 0.5 : (amount / 100) * 20;
  const simplifiedPoints = simplifyPath(pts, tolerance);
  return new Path({ type: 'rawPath', points: simplifiedPoints, color: strokeColor });
};

export const pointInPolygon = (point, vs) => {
  let x = point.x, y = point.y, inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i].x, yi = vs[i].y, xj = vs[j].x, yj = vs[j].y;
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const getShapePoints = (shape) => {
  if (shape.type === 'ellipse') {
    return [
      { x: shape.cx - shape.rx, y: shape.cy - shape.ry },
      { x: shape.cx + shape.rx, y: shape.cy - shape.ry },
      { x: shape.cx + shape.rx, y: shape.cy + shape.ry },
      { x: shape.cx - shape.rx, y: shape.cy + shape.ry },
      { x: shape.cx, y: shape.cy }
    ];
  } else if (shape.type === 'rawPath') {
    return shape.points;
  } else if (shape.type === 'bezierPath' && shape.d) {
    const parts = shape.d.split(/[ ,]+/);
    const pts = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!isNaN(p) && i > 0 && ['M','L','C'].includes(parts[i-2] || parts[i-3] || parts[i-4])) {
        // Just extract numbers roughly to get bounding box/sample points
      }
    }
    // Better way: parse simple M x,y or C ... x,y
    const coords = shape.d.match(/-?\d+\.?\d*/g);
    if (coords) {
      for (let i = 0; i < coords.length; i += 2) {
        pts.push({ x: parseFloat(coords[i]), y: parseFloat(coords[i+1]) });
      }
    }
    return pts;
  }
  return [];
};
