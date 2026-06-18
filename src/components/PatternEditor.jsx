import React, { useState, useRef } from 'react';
import useDrawing from '../hooks/useDrawing';
import DrawingHistory from '../models/DrawingHistory';
import PatternEditorToolbar from './PatternEditorToolbar';
import PatternEditorSidebar from './PatternEditorSidebar';
import PatternEditorCanvas from './PatternEditorCanvas';
import { exportPatternToSVG } from '../utils/patternExport';

export default function PatternEditor({ onClose, onSave }) {
  const [historyObj, setHistoryObj] = useState(new DrawingHistory());
  const shapes = historyObj.getCurrentShapes();

  const commitShapes = (newShapesArray, replace = false) => {
    setHistoryObj(prev => prev.commit(newShapesArray, replace));
  };

  const svgRef = useRef(null);
  const mainGroupRef = useRef(null);

  const [activeTool, setActiveTool] = useState('smoother');
  const [globalColor, setGlobalColor] = useState('#000000');

  const { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing(
    svgRef, activeTool, globalColor, 50, false, commitShapes, shapes, { url: null }, () => {}, { x: 0, y: 0, scale: 1, angle: 0 }, () => {}, 'canvas', mainGroupRef, () => {}
  );

  const erasingGesture = useRef({ active: false, hasErased: false });

  const handleEraserMove = (e) => {
    if (!erasingGesture.current.active) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const gEl = el.closest('g[data-shape-index]');
    if (gEl) {
      const idx = parseInt(gEl.getAttribute('data-shape-index'), 10);
      if (!isNaN(idx) && shapes[idx]) {
        commitShapes(shapes.filter(s => s !== shapes[idx]), erasingGesture.current.hasErased);
        erasingGesture.current.hasErased = true;
      }
    }
  };

  const handleCanvasPointerDown = (e) => {
    if (activeTool === 'eraser') {
      erasingGesture.current = { active: true, hasErased: false };
      handleEraserMove(e);
      if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);
    } else handlePointerDown(e);
  };
  const handleCanvasPointerMove = (e) => activeTool === 'eraser' ? handleEraserMove(e) : handlePointerMove(e);
  const handleCanvasPointerUp = (e) => {
    if (activeTool === 'eraser') {
      erasingGesture.current.active = false;
      if (svgRef.current) svgRef.current.releasePointerCapture(e.pointerId);
    } else handlePointerUp(e);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-800 z-50 fixed inset-0">
      <PatternEditorToolbar globalColor={globalColor} setGlobalColor={setGlobalColor} undo={() => setHistoryObj(historyObj.undo())} redo={() => setHistoryObj(historyObj.redo())} canUndo={historyObj.canUndo()} canRedo={historyObj.canRedo()} handleClear={() => commitShapes([])} onClose={onClose} handleSave={() => onSave(exportPatternToSVG(shapes))} />
      <div className="flex-1 flex overflow-hidden">
        <PatternEditorSidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <PatternEditorCanvas svgRef={svgRef} activeTool={activeTool} handleCanvasPointerDown={handleCanvasPointerDown} handleCanvasPointerMove={handleCanvasPointerMove} handleCanvasPointerUp={handleCanvasPointerUp} mainGroupRef={mainGroupRef} shapes={shapes} currentStroke={currentStroke} globalColor={globalColor} />
      </div>
    </div>
  );
}
