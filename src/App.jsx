import React, { useState, useRef, useEffect } from 'react';
import DrawingHistory from './models/DrawingHistory';
import ToolbarLeft from './components/ToolbarLeft';
import ToolbarTop from './components/ToolbarTop';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import GeminiApp from './components/GeminiApp';
import PatternEditor from './components/PatternEditor';
import useDrawing from './hooks/useDrawing';
import { exportCleanSVG } from './utils/svgExport';
import { handlePatternUploadEvent, handleImageChangeEvent, handleFileChangeEvent } from './utils/fileHandlers';
import { traceImageMultipleLayers } from './utils/traceUtils';
import { pointInPolygon, getShapePoints } from './utils/shapeProcessor';


export default function App() {
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const patternInputRef = useRef(null);
  const mainGroupRef = useRef(null);

  const [historyObj, setHistoryObj] = useState(() => {
    try {
      const saved = localStorage.getItem('drawing_history_pro_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return new DrawingHistory(parsed.history, parsed.step);
      }
    } catch (e) { }
    return new DrawingHistory();
  });

  const shapes = historyObj.getCurrentShapes();

  useEffect(() => {
    try {
      localStorage.setItem('drawing_history_pro_v3', JSON.stringify({ history: historyObj.history, step: historyObj.step }));
    } catch (e) { }
  }, [historyObj]);

  const commitShapes = (newShapesArray, replace = false) => {
    setHistoryObj(prev => {
      const curr = prev.getCurrentShapes();
      if (curr.length === newShapesArray.length && curr.every((s, i) => s === newShapesArray[i])) return prev;
      return prev.commit(newShapesArray, replace);
    });
  };
  const commitShapesFunctional = (updater, replace = false) => {
    setHistoryObj((prev) => {
      const curr = prev.getCurrentShapes();
      const next = updater(curr);
      if (curr.length === next.length && curr.every((s, i) => s === next[i])) return prev;
      return prev.commit(next, replace);
    });
  };
  const erasingGesture = useRef({ active: false, hasErased: false });
  const undo = () => setHistoryObj(historyObj.undo());
  const redo = () => setHistoryObj(historyObj.redo());

  const [activeTool, setActiveTool] = useState('smoother');
  const [smoothAmount, setSmoothAmount] = useState(50);
  const [forceCloseShape, setForceCloseShape] = useState(true);
  const [globalColor, setGlobalColor] = useState('#000000');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedShapeIndices, setSelectedShapeIndices] = useState([]);
  const [bgImage, setBgImage] = useState({ url: null, width: 0, height: 0, x: 0, y: 0, scale: 1, angle: 0, opacity: 0.7 });
  const [traceConfig, setTraceConfig] = useState({ layers: 1, turdsize: 2, turnpolicy: 'minority' });
  const [isTracing, setIsTracing] = useState(false);
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1, angle: 0 });
  const [transformTarget, setTransformTarget] = useState('canvas');
  const [showGeminiApp, setShowGeminiApp] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('options');
  const [isPatternEditor, setIsPatternEditor] = useState(false);
  const [customPatterns, setCustomPatterns] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_patterns_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('custom_patterns_v1', JSON.stringify(customPatterns));
    } catch (e) {}
  }, [customPatterns]);


  const handleTrace = async () => {
    if (!bgImage.url || isTracing) return;
    setIsTracing(true);
    try {
      const newPathShapes = await traceImageMultipleLayers(bgImage.url, traceConfig, traceConfig.layers);
      if (newPathShapes.length > 0) commitShapes([...shapes, ...newPathShapes]);
    } catch (e) { console.error("Trace error", e); }
    setIsTracing(false);
  };

  const onLassoComplete = (polygonPoints) => {
    if (!polygonPoints || polygonPoints.length === 0) {
      setSelectedShapeIndices([]);
      return;
    }
    const selected = [];
    shapes.forEach((shape, index) => {
      const shapePoints = getShapePoints(shape);
      if (shapePoints && shapePoints.length > 0) {
        // If at least one point is inside the lasso
        if (shapePoints.some(pt => pointInPolygon(pt, polygonPoints))) {
          selected.push(index);
        }
      }
    });
    setSelectedShapeIndices(selected);
    if (selected.length > 0) setShowRightPanel(true);
  };

  const { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing(
    svgRef, activeTool, globalColor, smoothAmount, forceCloseShape, commitShapes, shapes, bgImage, setBgImage, canvasTransform, setCanvasTransform, transformTarget, mainGroupRef, onLassoComplete
  );

  useEffect(() => { if (activeTool !== 'select') setSelectedShapeIndices([]); }, [activeTool]);

  const transformingRef = useRef(null);

  const getScreenCoordinates = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getCanvasCoordinates = (e) => {
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
  };

  const handleShapeInteraction = (e, shape, index, actionType) => {
    if (activeTool === 'select' && e.type === 'pointerdown') {
      e.stopPropagation();
      if (!selectedShapeIndices.includes(index)) {
        setSelectedShapeIndices([index]);
      }
      setShowRightPanel(true);

      if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);

      const pt = getScreenCoordinates(e);
      const canvasPt = getCanvasCoordinates(e);
      const bounds = getShapeBounds(shape);

      transformingRef.current = {
        active: true,
        pointerId: e.pointerId,
        action: actionType,
        index: index,
        startX: pt.x,
        startY: pt.y,
        canvasStartX: canvasPt.x,
        canvasStartY: canvasPt.y,
        shapeStartX: shape.x || 0,
        shapeStartY: shape.y || 0,
        shapeStartRotation: shape.rotation || 0,
        shapeCenterX: bounds.cx + (shape.x || 0),
        shapeCenterY: bounds.cy + (shape.y || 0),
        hasMoved: false
      };
    }
  };

  const handleEraserMove = (e) => {
    if (!erasingGesture.current.active) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const gEl = el.closest('g[data-shape-index]');
    if (gEl) {
      const idx = parseInt(gEl.getAttribute('data-shape-index'), 10);
      if (!isNaN(idx) && shapes[idx]) {
        const shapeToErase = shapes[idx];
        const replace = erasingGesture.current.hasErased;
        commitShapesFunctional((prev) => {
          return prev.filter(s => s !== shapeToErase);
        }, replace);
        erasingGesture.current.hasErased = true;
      }
    }
  };

  const handleCanvasPointerDown = (e) => {
    if (activeTool === 'eraser') {
      erasingGesture.current = { active: true, hasErased: false };
      handleEraserMove(e);
      if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);
    } else {
      handlePointerDown(e);
    }
  };

  const handleCanvasPointerMove = (e) => {
    if (transformingRef.current && transformingRef.current.active && transformingRef.current.pointerId === e.pointerId) {
      const pt = getScreenCoordinates(e);
      const dx = pt.x - transformingRef.current.startX;
      const dy = pt.y - transformingRef.current.startY;

      const scale = canvasTransform.scale || 1;
      const actualDx = dx / scale;
      const actualDy = dy / scale;

      const replaceHistory = transformingRef.current.hasMoved;

      if (transformingRef.current.action === 'move') {
        commitShapesFunctional((prev) => {
          const next = [...prev];
          next[transformingRef.current.index] = {
            ...next[transformingRef.current.index],
            x: transformingRef.current.shapeStartX + actualDx,
            y: transformingRef.current.shapeStartY + actualDy
          };
          return next;
        }, replaceHistory);
      } else if (transformingRef.current.action === 'rotateScale') {
        const canvasPt = getCanvasCoordinates(e);
        const cx = transformingRef.current.shapeCenterX;
        const cy = transformingRef.current.shapeCenterY;

        const startAngle = Math.atan2(transformingRef.current.canvasStartY - cy, transformingRef.current.canvasStartX - cx);
        const currentAngle = Math.atan2(canvasPt.y - cy, canvasPt.x - cx);

        let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);

        commitShapesFunctional((prev) => {
          const next = [...prev];
          next[transformingRef.current.index] = {
            ...next[transformingRef.current.index],
            rotation: (transformingRef.current.shapeStartRotation + angleDiff) % 360
          };
          return next;
        }, replaceHistory);
      }

      transformingRef.current.hasMoved = true;
      return;
    }

    if (activeTool === 'eraser') {
      handleEraserMove(e);
    } else {
      handlePointerMove(e);
    }
  };

  const handleCanvasPointerUp = (e) => {
    if (transformingRef.current && transformingRef.current.active && transformingRef.current.pointerId === e.pointerId) {
      transformingRef.current = null;
      if (svgRef.current) svgRef.current.releasePointerCapture(e.pointerId);
      return;
    }

    if (activeTool === 'eraser') {
      erasingGesture.current.active = false;
      if (svgRef.current) svgRef.current.releasePointerCapture(e.pointerId);
    } else {
      handlePointerUp(e);
    }
  };

  const updateSelectedShape = (updates) => {
    if (selectedShapeIndices.length === 0) return;
    const newShapes = [...shapes];
    selectedShapeIndices.forEach(idx => {
      newShapes[idx] = { ...newShapes[idx], ...updates };
    });
    commitShapes(newShapes);
  };

  if (isPatternEditor) {
    return (
      <PatternEditor
        onClose={() => setIsPatternEditor(false)}
        onSave={(dataUrl) => {
          setCustomPatterns(prev => [...prev, dataUrl]);
          if (selectedShapeIndices.length > 0) {
            updateSelectedShape({ fillPattern: 'custom', customPatternSvg: dataUrl });
          }
          setIsPatternEditor(false);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
      <input type="file" accept=".svg" ref={fileInputRef} onChange={(e) => handleFileChangeEvent(e, commitShapes, shapes)} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleImageChangeEvent(e, setBgImage, setShowRightPanel, svgRef)} className="hidden" />
      <input type="file" accept=".svg" ref={patternInputRef} onChange={(e) => handlePatternUploadEvent(e, updateSelectedShape)} className="hidden" />

      <ToolbarLeft activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} setShowGeminiApp={setShowGeminiApp} />

      {showGeminiApp && <GeminiApp onClose={() => setShowGeminiApp(false)} bgImage={bgImage} setBgImage={setBgImage} />}

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ToolbarTop
          activeTool={activeTool} globalColor={globalColor} setGlobalColor={setGlobalColor} forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape}
          smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel} setRightPanelTab={setRightPanelTab}
          undo={undo} redo={redo} canUndo={historyObj.canUndo()} canRedo={historyObj.canRedo()}
          handleClear={() => { if (window.confirm("Wyczyścić wektory?")) commitShapes([]); }} fileInputRef={fileInputRef}
          exportSVG={() => exportCleanSVG(shapes, svgRef)} shapesCount={shapes.length}
        />

        <div className="flex-1 relative flex">
          <Canvas
            svgRef={svgRef} mainGroupRef={mainGroupRef} canvasTransform={canvasTransform} shapes={shapes} currentStroke={currentStroke} bgImage={bgImage} isDrawing={isDrawing} activeTool={activeTool} globalColor={globalColor}
            handlePointerDown={handleCanvasPointerDown} handlePointerMove={handleCanvasPointerMove} handlePointerUp={handleCanvasPointerUp}
            selectedShapeIndices={selectedShapeIndices} handleShapeInteraction={handleShapeInteraction}
          />
          <RightPanel
            showRightPanel={showRightPanel} setShowRightPanel={setShowRightPanel} rightPanelTab={rightPanelTab} setRightPanelTab={setRightPanelTab} bgImage={bgImage} setBgImage={setBgImage}
            activeTool={activeTool} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
            updateSelectedShape={updateSelectedShape} patternInputRef={patternInputRef} svgRef={svgRef}
            traceConfig={traceConfig} setTraceConfig={setTraceConfig} handleTrace={handleTrace} isTracing={isTracing}
            transformTarget={transformTarget} setTransformTarget={setTransformTarget} customPatterns={customPatterns} setIsPatternEditor={setIsPatternEditor}
          />
        </div>
      </div>
    </div>
  );
}
