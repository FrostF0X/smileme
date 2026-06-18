import React from 'react';
import { IconTrash, IconUndo, IconRedo } from '../icons/icons';

const colors = ['#000000', '#FFFFFF', '#FC0FC0', '#00F6FF', '#F9F808', '#FF3B30', '#4CD964', '#007AFF'];

export default function PatternEditorToolbar({ globalColor, setGlobalColor, undo, redo, canUndo, canRedo, handleClear, onClose, handleSave }) {
  return (
    <div className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4 text-white">
        <span className="font-bold text-amber-500">Edytor Wzoru (200x200)</span>
        <div className="w-px h-6 bg-slate-700 mx-2"></div>
        <div className="flex items-center gap-2">
          {colors.map(c => (
            <button key={c} onClick={() => setGlobalColor(c)} className={`w-6 h-6 rounded-full border ${globalColor === c ? 'scale-110 ring-2 ring-offset-1 ring-offset-slate-900 ring-slate-400 border-transparent' : 'border-slate-600 hover:scale-110'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={undo} disabled={!canUndo} className="p-2 text-slate-300 hover:bg-slate-700 rounded disabled:opacity-30"><IconUndo /></button>
        <button onClick={redo} disabled={!canRedo} className="p-2 text-slate-300 hover:bg-slate-700 rounded disabled:opacity-30"><IconRedo /></button>
        <button onClick={handleClear} className="p-2 text-red-400 hover:bg-red-900/50 rounded"><IconTrash /></button>
        <div className="w-px h-6 bg-slate-700 mx-1"></div>
        <button onClick={onClose} className="px-4 py-1.5 text-slate-300 hover:bg-slate-700 rounded font-medium text-sm">Anuluj</button>
        <button onClick={handleSave} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded font-bold text-sm shadow">Zapisz Wzór</button>
      </div>
    </div>
  );
}
