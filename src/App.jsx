import React, { useState, useRef, useEffect } from 'react';
import DrawingHistory from './models/DrawingHistory';
import ToolbarLeft from './components/ToolbarLeft';
import ToolbarTop from './components/ToolbarTop';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import useDrawing from './hooks/useDrawing';
import { exportCleanSVG } from './utils/svgExport';
import { handlePatternUploadEvent, handleImageChangeEvent, handleFileChangeEvent } from './utils/fileHandlers';
import { traceImageMultipleLayers } from './utils/traceUtils';

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

  const commitShapes = (newShapesArray) => setHistoryObj(historyObj.commit(newShapesArray));
  const commitShapesFunctional = (updater) => {
    setHistoryObj((prev) => prev.commit(updater(prev.getCurrentShapes())));
  };
  const undo = () => setHistoryObj(historyObj.undo());
  const redo = () => setHistoryObj(historyObj.redo());

  const [activeTool, setActiveTool] = useState('smoother');
  const [smoothAmount, setSmoothAmount] = useState(50);
  const [forceCloseShape, setForceCloseShape] = useState(true);
  const [globalColor, setGlobalColor] = useState('#000000');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [bgImage, setBgImage] = useState({ url: null, width: 0, height: 0, x: 0, y: 0, scale: 1, angle: 0, opacity: 0.7 });
  const [traceConfig, setTraceConfig] = useState({ layers: 1, turdsize: 2, turnpolicy: 'minority' });
  const [isTracing, setIsTracing] = useState(false);
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1, angle: 0 });
  const [transformTarget, setTransformTarget] = useState('canvas');

  const handleTrace = async () => {
    if (!bgImage.url || isTracing) return;
    setIsTracing(true);
    try {
      const newPathShapes = await traceImageMultipleLayers(bgImage.url, traceConfig, traceConfig.layers);
      if (newPathShapes.length > 0) commitShapes([...shapes, ...newPathShapes]);
    } catch (e) { console.error("Trace error", e); }
    setIsTracing(false);
  };

  const { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing(
    svgRef, activeTool, globalColor, smoothAmount, forceCloseShape, commitShapes, shapes, bgImage, setBgImage, canvasTransform, setCanvasTransform, transformTarget, mainGroupRef
  );

  useEffect(() => { if (activeTool !== 'select') setSelectedShapeIndex(null); }, [activeTool]);

  const handleShapeInteraction = (e, shape, index) => {
    if (activeTool === 'eraser') {
      if (e.buttons === 1 || e.type === 'pointerdown') {
        e.stopPropagation();
        commitShapesFunctional((prevShapes) => prevShapes.filter(s => s !== shape));
      }
    } else if (activeTool === 'select' && e.type === 'pointerdown') {
      e.stopPropagation();
      setSelectedShapeIndex(index);
      setShowRightPanel(true);
    }
  };

  const updateSelectedShape = (updates) => {
    if (selectedShapeIndex === null) return;
    const newShapes = [...shapes];
    newShapes[selectedShapeIndex] = { ...newShapes[selectedShapeIndex], ...updates };
    commitShapes(newShapes);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
      <input type="file" accept=".svg" ref={fileInputRef} onChange={(e) => handleFileChangeEvent(e, commitShapes, shapes)} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleImageChangeEvent(e, setBgImage, setShowRightPanel, svgRef)} className="hidden" />
      <input type="file" accept=".svg" ref={patternInputRef} onChange={(e) => handlePatternUploadEvent(e, updateSelectedShape)} className="hidden" />

      <ToolbarLeft activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <ToolbarTop
          activeTool={activeTool} globalColor={globalColor} setGlobalColor={setGlobalColor} forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape}
          smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} activeShape={selectedShapeIndex !== null ? shapes[selectedShapeIndex] : null}
          updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel}
          undo={undo} redo={redo} canUndo={historyObj.canUndo()} canRedo={historyObj.canRedo()}
          handleClear={() => { if (window.confirm("Wyczyścić wektory?")) commitShapes([]); }} fileInputRef={fileInputRef}
          exportSVG={() => exportCleanSVG(shapes, svgRef)} shapesCount={shapes.length}
        />

        <div className="flex-1 relative flex">
          <Canvas
            svgRef={svgRef} mainGroupRef={mainGroupRef} canvasTransform={canvasTransform} shapes={shapes} currentStroke={currentStroke} bgImage={bgImage} isDrawing={isDrawing} activeTool={activeTool} globalColor={globalColor}
            handlePointerDown={handlePointerDown} handlePointerMove={handlePointerMove} handlePointerUp={handlePointerUp}
            selectedShapeIndex={selectedShapeIndex} handleShapeInteraction={handleShapeInteraction}
          />
          <RightPanel
            showRightPanel={showRightPanel} setShowRightPanel={setShowRightPanel} bgImage={bgImage} setBgImage={setBgImage}
            activeTool={activeTool} activeShape={selectedShapeIndex !== null ? shapes[selectedShapeIndex] : null}
            updateSelectedShape={updateSelectedShape} patternInputRef={patternInputRef} svgRef={svgRef}
            traceConfig={traceConfig} setTraceConfig={setTraceConfig} handleTrace={handleTrace} isTracing={isTracing}
            transformTarget={transformTarget} setTransformTarget={setTransformTarget}
          />
        </div>
      </div>
    </div>
  );
}
