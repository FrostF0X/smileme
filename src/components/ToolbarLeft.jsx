import React from 'react';
import { IconCircle, IconWave, IconSelect, IconEraser, IconImage, IconHand, IconSparkles, IconPen } from '../icons/icons';

export default function ToolbarLeft({ activeTool, setActiveTool, bgImage, setShowRightPanel, imageInputRef, setCanvasTransform, setShowGeminiApp }) {
  return (
    <div className="w-16 bg-white border-r border-slate-300 flex flex-col items-center py-4 z-20 shrink-0 shadow-lg relative z-30">
      <div className="flex flex-col gap-3 w-full px-2">
        <button onClick={() => setActiveTool('snapper')} title="Auto-Elipsy" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'snapper' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconCircle /></button>
        <button onClick={() => setActiveTool('smoother')} title="Płynne Krzywe" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'smoother' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconWave /></button>
        <button onClick={() => setActiveTool('drawer')} title="Proste Linie" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'drawer' ? 'bg-indigo-100 text-indigo-600 shadow-sm ring-1 ring-indigo-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconPen /></button>
        <button onClick={() => setActiveTool('select')} title="Kursor (Wybieranie i Wypełnianie)" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'select' ? 'bg-amber-100 text-amber-600 shadow-sm ring-1 ring-amber-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconSelect /></button>
        <button onClick={() => { setActiveTool('eraser'); setShowRightPanel(false); }} title="Gumka" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'eraser' ? 'bg-red-100 text-red-600 shadow-sm ring-1 ring-red-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconEraser /></button>
        <button onClick={() => setActiveTool('pan')} onDoubleClick={() => setCanvasTransform({x: 0, y: 0, scale: 1, angle: 0})} title="Przesuwanie (2-krotne kliknięcie resetuje widok)" className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'pan' ? 'bg-sky-100 text-sky-600 shadow-sm ring-1 ring-sky-300' : 'text-slate-500 hover:bg-slate-100'}`}><IconHand /></button>
      </div>
      <div className="w-10 h-px bg-slate-200 my-4"></div>
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
