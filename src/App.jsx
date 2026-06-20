import React, { useState, useRef, useEffect } from 'react';
import DrawingHistory from './models/DrawingHistory';
import ToolbarLeft from './components/ToolbarLeft';
import ToolbarTop from './components/ToolbarTop';
import Canvas from './components/Canvas';
import RightPanel from './components/RightPanel';
import GeminiApp from './components/GeminiApp';
import ColorPickerPopup from './components/ColorPickerPopup';
import useDrawing from './hooks/useDrawing';
import { exportCleanSVG } from './utils/svgExport';
import { Transaction, executeTool } from './mcp/index';
import { handlePatternUploadEvent, handleImageChangeEvent, handleFileChangeEvent } from './utils/fileHandlers';
import { traceImageMultipleLayers } from './utils/traceUtils';
import { pointInPolygon, getShapePoints } from './utils/shapeProcessor';

function Workspace({ tabId, isPattern, openNewPatternTab }) {
  const svgRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const patternInputRef = useRef(null);
  const mainGroupRef = useRef(null);

  const [historyObj, setHistoryObj] = useState(() => {
    try {
      const saved = localStorage.getItem(`drawing_history_pro_v3_${tabId}`);
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
      localStorage.setItem(`drawing_history_pro_v3_${tabId}`, JSON.stringify({ history: historyObj.history, step: historyObj.step }));
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

  const handleRunComputerTool = () => {
    try {
      const tx = new Transaction(historyObj);
      tx.begin();
      tx.addOperation((shapes) => {
        return executeTool('createEllipse', {
          cx: Math.random() * 400 + 100,
          cy: Math.random() * 400 + 100,
          rx: Math.random() * 50 + 20,
          ry: Math.random() * 50 + 20,
          color: globalColor
        }, shapes);
      });
      setHistoryObj(tx.commit(historyObj));
    } catch (err) {
      console.error("Transaction Error", err);
    }
  };

  const [activeTool, setActiveTool] = useState('smoother');
  const [smoothAmount, setSmoothAmount] = useState(50);
  const [forceCloseShape, setForceCloseShape] = useState(true);
  const [globalColor, setGlobalColor] = useState('#000000');
  const [globalFillColor, setGlobalFillColor] = useState(null);
  const [globalFillPattern, setGlobalFillPattern] = useState(null);
  const [globalPatternSettings, setGlobalPatternSettings] = useState({ layout: 'grid', scale: 1, spacing: 0 });
  const [showColorPopup, setShowColorPopup] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState('stroke');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedShapeIndices, setSelectedShapeIndices] = useState([]);
  const [bgImage, setBgImage] = useState({ url: null, width: 0, height: 0, x: 0, y: 0, scale: 1, angle: 0, opacity: 0.7 });
  const [traceConfig, setTraceConfig] = useState({ layers: 1, turdsize: 2, turnpolicy: 'minority' });
  const [isTracing, setIsTracing] = useState(false);
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1, angle: 0 });
  const [transformTarget, setTransformTarget] = useState('canvas');
  const [showGeminiApp, setShowGeminiApp] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState('options');
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

  const updateSelectedShape = (updates, replace = false) => {
    if (selectedShapeIndices.length === 0) return;
    commitShapesFunctional((prev) => {
      const next = [...prev];
      selectedShapeIndices.forEach(idx => {
        next[idx] = { ...next[idx], ...updates };
      });
      return next;
    }, replace);
  };

  const { isDrawing, currentStroke, handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing(
    svgRef, activeTool, globalColor, globalFillColor, globalFillPattern, globalPatternSettings, smoothAmount, forceCloseShape, commitShapes, shapes, bgImage, setBgImage, canvasTransform, setCanvasTransform, transformTarget, mainGroupRef, onLassoComplete, selectedShapeIndices, updateSelectedShape
  );

  useEffect(() => { if (activeTool !== 'select') setSelectedShapeIndices([]); }, [activeTool]);

  useEffect(() => {
    if (transformTarget === 'selection' && (selectedShapeIndices.length === 0 || activeTool !== 'select')) {
      setTransformTarget('canvas');
    }
  }, [transformTarget, selectedShapeIndices, activeTool]);

  const transformingRef = useRef(null);

  const getScreenCoordinates = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

      transformingRef.current = {
        active: true,
        pointerId: e.pointerId,
        index: index,
        startX: pt.x,
        startY: pt.y,
        shapeStartX: shape.x || 0,
        shapeStartY: shape.y || 0,
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

      commitShapesFunctional((prev) => {
        const next = [...prev];
        next[transformingRef.current.index] = {
          ...next[transformingRef.current.index],
          x: transformingRef.current.shapeStartX + actualDx,
          y: transformingRef.current.shapeStartY + actualDy
        };
        return next;
      }, replaceHistory);

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

  return (
    <>
      <input type="file" accept=".svg" ref={fileInputRef} onChange={(e) => handleFileChangeEvent(e, commitShapes, shapes)} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleImageChangeEvent(e, setBgImage, setShowRightPanel, svgRef)} className="hidden" />
      <input type="file" accept=".svg" ref={patternInputRef} onChange={(e) => handlePatternUploadEvent(e, updateSelectedShape)} className="hidden" />

      {showGeminiApp && <GeminiApp onClose={() => setShowGeminiApp(false)} bgImage={bgImage} setBgImage={setBgImage} />}
      {showColorPopup && (
        <ColorPickerPopup
          activeColorPicker={activeColorPicker}
          globalColor={globalColor} setGlobalColor={setGlobalColor}
          globalFillColor={globalFillColor} setGlobalFillColor={setGlobalFillColor}
          globalFillPattern={globalFillPattern} setGlobalFillPattern={setGlobalFillPattern}
          globalPatternSettings={globalPatternSettings} setGlobalPatternSettings={setGlobalPatternSettings}
          activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          updateSelectedShape={updateSelectedShape}
          customPatterns={customPatterns}
          openNewPatternTab={openNewPatternTab}
          setShowColorPopup={setShowColorPopup}
        />
      )}

      {/* TopAppBar - Integrates TopToolbar features */}
      <ToolbarTop
        activeTool={activeTool} globalColor={globalColor} setGlobalColor={setGlobalColor} forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape}
        smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
        updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel}
        undo={undo} redo={redo} canUndo={historyObj.canUndo()} canRedo={historyObj.canRedo()}
        handleClear={() => { if (window.confirm("Wyczyścić wektory?")) commitShapes([]); }}
        handleRunComputerTool={handleRunComputerTool}
        fileInputRef={fileInputRef}
        exportSVG={() => exportCleanSVG(shapes, svgRef)} shapesCount={shapes.length}
      />

      <main className="absolute inset-0 pt-[56px] pb-[32px] flex overflow-hidden">
        {/* Left SideNavBar */}
        <ToolbarLeft
          activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} setShowGeminiApp={setShowGeminiApp}
          globalColor={globalColor} globalFillColor={globalFillColor} globalFillPattern={globalFillPattern}
          activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          showColorPopup={showColorPopup} setShowColorPopup={setShowColorPopup}
          activeColorPicker={activeColorPicker} setActiveColorPicker={setActiveColorPicker}
        />

        {/* Central Canvas Area */}
        <div className="flex-1 ml-[56px] mr-[280px] h-full relative overflow-auto bg-[#050505] flex items-center justify-center p-8 custom-scrollbar">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          <Canvas
            svgRef={svgRef} mainGroupRef={mainGroupRef} canvasTransform={canvasTransform} shapes={shapes} currentStroke={currentStroke} bgImage={bgImage} isDrawing={isDrawing} activeTool={activeTool} globalColor={globalColor}
            handlePointerDown={handleCanvasPointerDown} handlePointerMove={handleCanvasPointerMove} handlePointerUp={handleCanvasPointerUp}
            selectedShapeIndices={selectedShapeIndices} handleShapeInteraction={handleShapeInteraction}
          />
        </div>

        {/* Right SideNavBar (Inspector) */}
        <RightPanel
          showRightPanel={showRightPanel} setShowRightPanel={setShowRightPanel} rightPanelTab={rightPanelTab} setRightPanelTab={setRightPanelTab} bgImage={bgImage} setBgImage={setBgImage}
          activeTool={activeTool} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          updateSelectedShape={updateSelectedShape} patternInputRef={patternInputRef} svgRef={svgRef}
          traceConfig={traceConfig} setTraceConfig={setTraceConfig} handleTrace={handleTrace} isTracing={isTracing}
          transformTarget={transformTarget} setTransformTarget={setTransformTarget} customPatterns={customPatterns} openNewPatternTab={openNewPatternTab}
        />
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-[#111]/90 backdrop-blur-md border-t border-[#00FFFF]/20 h-8 shadow-[0_-2px_10px_rgba(0,255,255,0.05)]">
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm cursor-default">
          <span className="hover:text-[#FC0FC0] transition-colors">Zoom {Math.round((canvasTransform.scale || 1) * 100)}%</span>
          <span className="w-px h-3 bg-white/10"></span>
          <span className="hover:text-[#FC0FC0] transition-colors">Artboard 1</span>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm cursor-default">
          <span className="hover:text-[#00FFFF] transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_5px_rgba(0,255,255,0.8)]"></span>
            GPU Preview
          </span>
          <span className="w-px h-3 bg-white/10"></span>
          <span className="hover:text-[#FFD700] transition-colors">AetherDesign Pro v2024</span>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  const [tabs, setTabs] = useState([
    { id: 'main', title: 'Main Drawing', type: 'main' }
  ]);
  const [activeTabId, setActiveTabId] = useState('main');
  const [patternCounter, setPatternCounter] = useState(1);

  const openNewPatternTab = () => {
    const newTabId = `pattern_${patternCounter}`;
    setTabs([...tabs, { id: newTabId, title: `Pattern ${patternCounter}`, type: 'pattern' }]);
    setActiveTabId(newTabId);
    setPatternCounter(c => c + 1);
  };

  const closeTab = (e, tabId) => {
    e.stopPropagation();
    if (tabId === 'main') return; // Cannot close main tab
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId('main');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] overflow-hidden">
      {/* Tabs Header */}
      <div className="h-10 bg-[#111] border-b border-[#FC0FC0]/20 flex items-center px-2 overflow-x-auto shrink-0 z-50">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              flex items-center h-8 px-4 mr-1 rounded-t-md cursor-pointer transition-colors border border-b-0
              ${activeTabId === tab.id
                ? 'bg-[#222] border-[#FC0FC0]/50 text-white'
                : 'bg-[#111] border-transparent text-on-surface-variant hover:bg-[#1a1a1a] hover:text-white'}
            `}
          >
            <span className="text-sm font-medium whitespace-nowrap">{tab.title}</span>
            {tab.id !== 'main' && (
              <button
                onClick={(e) => closeTab(e, tab.id)}
                className="ml-2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-red-400"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={openNewPatternTab}
          className="h-8 px-3 ml-2 flex items-center justify-center text-on-surface-variant hover:text-[#00FFFF] hover:bg-white/5 rounded transition-colors"
          title="New Pattern Tab"
        >
          +
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 relative">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`absolute inset-0 ${activeTabId === tab.id ? 'block' : 'hidden'}`}
          >
            <Workspace
              tabId={tab.id}
              isPattern={tab.type === 'pattern'}
              openNewPatternTab={openNewPatternTab}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
