import React from 'react';
import { IconCircle, IconWave, IconSelect, IconEraser, IconImage, IconHand, IconSparkles, IconPen, IconPattern } from '../icons/icons';

export default function ToolbarLeft({
  activeTool, setActiveTool, bgImage, setShowRightPanel, imageInputRef,
  setCanvasTransform, setShowGeminiApp,
  globalColor, globalFillColor, globalFillPattern,
  activeShape, showColorPopup, setShowColorPopup,
  activeColorPicker, setActiveColorPicker
}) {

  // Use selected shape's properties if active shape is present
  const strokeColor = activeShape ? activeShape.color : globalColor;
  const fillColor = activeShape ? activeShape.fillColor : globalFillColor;
  const fillPattern = activeShape ? activeShape.fillPattern : globalFillPattern;
  const isFillEmpty = !fillPattern && !fillColor;

  const handleStrokeClick = () => {
    setActiveColorPicker('stroke');
    if (!showColorPopup || activeColorPicker !== 'stroke') setShowColorPopup(true);
    else setShowColorPopup(false); // toggle off if already open on stroke
  };

  const handleFillClick = () => {
    setActiveColorPicker('fill');
    if (!showColorPopup || activeColorPicker !== 'fill') setShowColorPopup(true);
    else setShowColorPopup(false); // toggle off if already open on fill
  };

  return (
    <div className="w-16 bg-white border-r border-slate-300 flex flex-col items-center py-4 z-20 shrink-0 shadow-lg relative z-30">
      <div className="flex flex-col gap-3 w-full px-2">
        <button onClick={() => setActiveTool('snapper')} title="Auto-Elipsy" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'snapper' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconCircle /></button>
        <button onClick={() => setActiveTool('smoother')} title="Płynne Krzywe" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'smoother' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconWave /></button>
        <button onClick={() => setActiveTool('drawer')} title="Proste Linie" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'drawer' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconPen /></button>
        <button onClick={() => setActiveTool('select')} title="Kursor (Wybieranie i Wypełnianie)" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'select' ? 'bg-amber-100 text-amber-600 shadow-sm ring-1 ring-amber-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconSelect /></button>
        <button onClick={() => { setActiveTool('eraser'); setShowRightPanel(false); setShowColorPopup(false); }} title="Gumka" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'eraser' ? 'bg-red-100 text-red-600 shadow-sm ring-1 ring-red-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconEraser /></button>
        <button onClick={() => setActiveTool('pan')} onDoubleClick={() => setCanvasTransform({x: 0, y: 0, scale: 1, angle: 0})} title="Przesuwanie (2-krotne kliknięcie resetuje widok)" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'pan' ? 'bg-sky-100 text-sky-600 shadow-sm ring-1 ring-sky-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconHand /></button>
      </div>

      <div className="w-10 h-px bg-slate-200 my-4 shrink-0"></div>

      {/* Photoshop style swatches */}
      <div className="flex flex-col items-center mb-4 relative w-12 h-12 shrink-0">
        {/* Fill Square (Bottom) */}
        <button
          onClick={handleFillClick}
          className={`absolute bottom-0 right-0 w-8 h-8 rounded border-2 shadow-sm flex items-center justify-center overflow-hidden transition-all ${activeColorPicker === 'fill' && showColorPopup ? 'z-10 scale-110 border-sky-400 ring-2 ring-sky-200' : 'z-0 border-slate-300 hover:border-slate-400'}`}
          style={{ backgroundColor: fillPattern ? 'transparent' : (fillColor || 'transparent') }}
          title="Fill Color/Pattern"
        >
          {isFillEmpty && (
            <div className="absolute inset-0 m-auto w-[140%] h-0.5 bg-red-500 transform rotate-45 -translate-x-1"></div>
          )}
          {fillPattern && (
            <IconPattern className="w-4 h-4 text-slate-700 opacity-70" />
          )}
        </button>

        {/* Stroke Square (Top) */}
        <button
          onClick={handleStrokeClick}
          className={`absolute top-0 left-0 w-8 h-8 rounded border-2 shadow-sm transition-all ${activeColorPicker === 'stroke' && showColorPopup ? 'z-10 scale-110 border-sky-400 ring-2 ring-sky-200' : 'z-5 border-slate-300 hover:border-slate-400'}`}
          style={{ backgroundColor: strokeColor || '#000000' }}
          title="Stroke Color"
        />
      </div>

      <div className="w-10 h-px bg-slate-200 my-2 shrink-0"></div>

      <div className="flex flex-col gap-3 w-full px-2">
        <button onClick={() => { if (!bgImage.url) imageInputRef.current.click(); else setShowRightPanel(true); }} title="Obraz Referencyjny (Kalka)" className={`p-2.5 rounded-xl flex justify-center transition-all relative ${bgImage.url ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
          <IconImage />
          {bgImage.url && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>}
        </button>
        <button onClick={() => setShowGeminiApp(true)} title="Generator Obrazów AI" className="p-2.5 rounded-xl flex justify-center transition-all text-purple-500 hover:bg-purple-100">
          <IconSparkles />
        </button>
      </div>
    </div>
  );
}
