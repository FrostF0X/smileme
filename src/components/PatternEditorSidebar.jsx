import React from 'react';
import { IconWave, IconPen, IconCircle, IconEraser } from '../icons/icons';

export default function PatternEditorSidebar({ activeTool, setActiveTool }) {
  return (
    <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 shrink-0 gap-3">
      <button onClick={() => setActiveTool('snapper')} className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'snapper' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' : 'text-slate-400 hover:bg-slate-800'}`}><IconCircle /></button>
      <button onClick={() => setActiveTool('smoother')} className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'smoother' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' : 'text-slate-400 hover:bg-slate-800'}`}><IconWave /></button>
      <button onClick={() => setActiveTool('drawer')} className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'drawer' ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50' : 'text-slate-400 hover:bg-slate-800'}`}><IconPen /></button>
      <button onClick={() => setActiveTool('eraser')} className={`p-2.5 rounded-xl flex justify-center transition-all ${activeTool === 'eraser' ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50' : 'text-slate-400 hover:bg-slate-800'}`}><IconEraser /></button>
    </div>
  );
}
