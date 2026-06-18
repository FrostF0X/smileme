import { useState, useRef, useCallback } from 'react';
import { processSnapper, processBezierSmoother, processDrawer } from '../utils/shapeProcessor';
import { calculateNewCanvasState, calculateNewBgImageState } from '../utils/transformUtils';

export default function useDrawing(svgRef, activeTool, globalColor, globalFillColor, globalFillPattern, globalPatternSettings, smoothAmount, forceCloseShape, commitShapes, shapes, bgImage, setBgImage, canvasTransform, setCanvasTransform, transformTarget, mainGroupRef, onLassoComplete, selectedShapeIndices, updateSelectedShape) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);
  const activePointers = useRef(new Map());
  const gestureStart = useRef(null);

  const getCoordinates = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    let pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    if (mainGroupRef.current) {
      try {
        const ctm = mainGroupRef.current.getScreenCTM();
        if (ctm) pt = pt.matrixTransform(ctm.inverse());
      } catch (err) {}
    } else {
      const rect = svgRef.current.getBoundingClientRect();
      pt.x -= rect.left;
      pt.y -= rect.top;
    }
    return { x: pt.x, y: pt.y };
  }, [svgRef, mainGroupRef]);

  const getScreenCoordinates = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [svgRef]);

  const handlePointerDown = useCallback((e) => {
    activePointers.current.set(e.pointerId, { raw: getScreenCoordinates(e), transformed: getCoordinates(e) });
    if (svgRef.current && activeTool !== 'eraser') svgRef.current.setPointerCapture(e.pointerId);

    if (activePointers.current.size === 2) {
      setIsDrawing(false); setCurrentStroke([]);
      const pts = Array.from(activePointers.current.values()).map(p => p.raw);

      const stateCanvas = calculateNewCanvasState(pts, canvasTransform, null);
      const stateBg = calculateNewBgImageState(pts, bgImage, null);

      let shapeState = {};
      if (transformTarget === 'selection' && selectedShapeIndices && selectedShapeIndices.length > 0) {
        const activeShape = shapes[selectedShapeIndices[0]];
        shapeState = {
           shapeStartScaleX: activeShape.scaleX !== undefined ? activeShape.scaleX : 1,
           shapeStartScaleY: activeShape.scaleY !== undefined ? activeShape.scaleY : 1,
           shapeStartRotation: activeShape.rotation || 0,
           hasMoved: false
        };
      }

      gestureStart.current = {
        canX: canvasTransform.x, canY: canvasTransform.y, canScale: canvasTransform.scale, canAngle: canvasTransform.angle,
        imgX: bgImage.x, imgY: bgImage.y, imgScale: bgImage.scale, imgAngle: bgImage.angle,
        ...stateCanvas,
        ...stateBg,
        ...shapeState
      };
    }
    else if (activePointers.current.size === 1 && activeTool === 'pan') {
       setIsDrawing(false); setCurrentStroke([]);
       const pt = getScreenCoordinates(e);
       gestureStart.current = {
         canX: canvasTransform.x, canY: canvasTransform.y,
         imgX: bgImage.x, imgY: bgImage.y,
         startX: pt.x, startY: pt.y
       };
    }
    else if (activePointers.current.size === 1 && (activeTool === 'snapper' || activeTool === 'smoother' || activeTool === 'drawer' || activeTool === 'select')) {
      setIsDrawing(true); setCurrentStroke([getCoordinates(e)]);
    }
  }, [getCoordinates, getScreenCoordinates, activeTool, bgImage, canvasTransform]);

  const handlePointerMove = useCallback((e) => {
    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, { raw: getScreenCoordinates(e), transformed: getCoordinates(e) });

    if (activePointers.current.size === 2 && gestureStart.current) {
      const pts = Array.from(activePointers.current.values()).map(p => p.raw);
      if (transformTarget === 'canvas') {
        const newState = calculateNewCanvasState(pts, canvasTransform, gestureStart.current);
        setCanvasTransform(newState);
      } else if (transformTarget === 'background' && bgImage.url) {
        const newState = calculateNewBgImageState(pts, bgImage, gestureStart.current);
        setBgImage(newState);
      } else if (transformTarget === 'selection' && selectedShapeIndices && selectedShapeIndices.length > 0) {
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);

        const scaleRatio = dist / gestureStart.current.startDist;
        const angleDelta = (angle - gestureStart.current.startAngle) * (180 / Math.PI);

        const replaceHistory = gestureStart.current.hasMoved;
        updateSelectedShape({
          scaleX: gestureStart.current.shapeStartScaleX * scaleRatio,
          scaleY: gestureStart.current.shapeStartScaleY * scaleRatio,
          rotation: (gestureStart.current.shapeStartRotation + angleDelta) % 360
        }, replaceHistory);
        gestureStart.current.hasMoved = true;
      }
    }
    else if (activePointers.current.size === 1 && activeTool === 'pan' && gestureStart.current) {
      const pt = getScreenCoordinates(e);
      const { startX, startY, canX, canY, imgX, imgY } = gestureStart.current;
      const dx = pt.x - startX;
      const dy = pt.y - startY;
      if (transformTarget === 'canvas') {
        setCanvasTransform(prev => ({ ...prev, x: canX + dx, y: canY + dy }));
      } else if (transformTarget === 'background' && bgImage.url) {
        const scale = canvasTransform.scale;
        setBgImage(prev => ({ ...prev, x: imgX + dx / scale, y: imgY + dy / scale }));
      }
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
  }, [getCoordinates, getScreenCoordinates, isDrawing, bgImage, setBgImage, activeTool, transformTarget, canvasTransform, setCanvasTransform]);

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
        if (activeTool === 'select') {
          if (currentStroke.length > 4 && onLassoComplete) {
            onLassoComplete(currentStroke);
          } else if (currentStroke.length <= 4 && onLassoComplete) {
            onLassoComplete([]);
          }
        } else if (currentStroke.length > 4) {
          try {
            let newShape;
            if (activeTool === 'snapper') {
              newShape = processSnapper(currentStroke, globalColor, globalFillColor, globalFillPattern, globalPatternSettings);
            } else if (activeTool === 'drawer') {
              newShape = processDrawer(currentStroke, globalColor, smoothAmount, forceCloseShape, globalFillColor, globalFillPattern, globalPatternSettings);
            } else {
              newShape = processBezierSmoother(currentStroke, globalColor, smoothAmount, forceCloseShape, globalFillColor, globalFillPattern, globalPatternSettings);
            }
            commitShapes([...shapes, newShape]);
          } catch (err) { console.error(err); }
        }
        setCurrentStroke([]);
      }
    }
  }, [isDrawing, currentStroke, activeTool, globalColor, smoothAmount, forceCloseShape, commitShapes, shapes, svgRef, onLassoComplete]);

  return { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp };
}
