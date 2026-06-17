import { useState, useRef, useCallback } from 'react';
import { processSnapper, processBezierSmoother } from '../utils/shapeProcessor';

const calculateNewBgImageState = (pts, bgImage, gestureStart) => {
  const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

  if (!gestureStart) {
    return { startX: center.x, startY: center.y, startDist: dist, startAngle: angle };
  }

  return {
    ...bgImage,
    x: gestureStart.imgX + (center.x - gestureStart.startX),
    y: gestureStart.imgY + (center.y - gestureStart.startY),
    scale: gestureStart.imgScale * (dist / gestureStart.startDist),
    angle: gestureStart.imgAngle + (angle - gestureStart.startAngle) * (180 / Math.PI)
  };
};

export default function useDrawing(svgRef, activeTool, globalColor, smoothAmount, forceCloseShape, commitShapes, shapes, bgImage, setBgImage) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const activePointers = useRef(new Map());
  const gestureStart = useRef(null);

  const getCoordinates = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [svgRef]);

  const handlePointerDown = useCallback((e) => {
    activePointers.current.set(e.pointerId, getCoordinates(e));
    if (svgRef.current && activeTool !== 'eraser') svgRef.current.setPointerCapture(e.pointerId);

    if (activePointers.current.size === 2 && bgImage.url) {
      setIsDrawing(false); setCurrentStroke([]);
      const pts = Array.from(activePointers.current.values());
      const state = calculateNewBgImageState(pts, bgImage, null);
      gestureStart.current = { imgX: bgImage.x, imgY: bgImage.y, imgScale: bgImage.scale, imgAngle: bgImage.angle, ...state };
    }
    else if (activePointers.current.size === 1 && (activeTool === 'snapper' || activeTool === 'smoother')) {
      setIsDrawing(true); setCurrentStroke([getCoordinates(e)]);
    }
  }, [getCoordinates, activeTool, bgImage]);

  const handlePointerMove = useCallback((e) => {
    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, getCoordinates(e));

    if (activePointers.current.size === 2 && bgImage.url && gestureStart.current) {
      const pts = Array.from(activePointers.current.values());
      const newState = calculateNewBgImageState(pts, bgImage, gestureStart.current);
      setBgImage(newState);
    }
    else if (activePointers.current.size === 1 && isDrawing) {
      const pt = getCoordinates(e);
      setCurrentStroke((prev) => {
        if (prev.length === 0) return [pt];
        const last = prev[prev.length - 1];
        if (Math.hypot(pt.x - last.x, pt.y - last.y) > 3) return [...prev, pt];
        return prev;
      });
    }
  }, [getCoordinates, isDrawing, bgImage, setBgImage]);

  const handlePointerUp = useCallback((e) => {
    activePointers.current.delete(e.pointerId);
    if (svgRef.current) {
      try {
        svgRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    if (activePointers.current.size === 0) {
      gestureStart.current = null;
      if (isDrawing) {
        setIsDrawing(false);
        if (currentStroke.length > 4) {
          try {
            let newShape = activeTool === 'snapper' ? processSnapper(currentStroke, globalColor) : processBezierSmoother(currentStroke, globalColor, smoothAmount, forceCloseShape);
            commitShapes([...shapes, newShape]);
          } catch (err) { console.error(err); }
        }
        setCurrentStroke([]);
      }
    }
  }, [isDrawing, currentStroke, activeTool, globalColor, smoothAmount, forceCloseShape, commitShapes, shapes, svgRef]);

  return { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp };
}
