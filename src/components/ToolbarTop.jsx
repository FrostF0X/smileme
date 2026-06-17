import React from 'react';
import { IconPattern, IconUndo, IconRedo, IconTrash, IconUpload, IconDownload } from '../icons/icons';

const colors = ['#000000', '#FFFFFF', '#FC0FC0', '#00F6FF', '#F9F808', '#FF3B30', '#4CD964', '#007AFF'];

const SmoothControls = ({ forceCloseShape, setForceCloseShape, smoothAmount, setSmoothAmount }) => (
  <div className="flex items-center gap-3 border-l border-slate-200 pl-4 shrink-0">
    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
      <input type="checkbox" checked={forceCloseShape} onChange={(e) => setForceCloseShape(e.target.checked)} />
      Domknij
    </label>
    <span className="text-sm text-slate-500 ml-2">Wygładzanie:</span>
    <input type="range" min="0" max="100" step="5" value={smoothAmount} onChange={(e) => setSmoothAmount(parseInt(e.target.value))} className="w-20" />
  </div>
);

const EditControls = ({ activeShape, updateSelectedShape, setShowRightPanel }) => (
  <div className="flex items-center gap-4 shrink-0">
    <span className="text-sm font-bold text-amber-600">Edycja:</span>
    <div className="flex items-center gap-2">
      {colors.map(c => (
        <button key={c} onClick={() => updateSelectedShape({ color: c })} className={`w-6 h-6 rounded-full border ${activeShape.color === c ? 'scale-110 ring-2 ring-offset-1 ring-amber-400 border-transparent' : 'border-slate-300'}`} style={{ backgroundColor: c }} />
      ))}
    </div>
    <div className="border-l border-slate-200 pl-4 flex items-center gap-2">
      <IconPattern />
      <select className="text-sm border border-slate-300 rounded p-1 bg-slate-50 outline-none" value={activeShape.fillPattern || ''} onChange={(e) => { const val = e.target.value; updateSelectedShape({ fillPattern: val || null }); if (val) setShowRightPanel(true); }}>
        <option value="">Brak Wypełnienia</option><option value="dots">Kropki</option><option value="grid">Siatka</option><option value="lines">Paski</option><option value="custom">Własny SVG...</option>
      </select>
    </div>
    <button onClick={() => setShowRightPanel(true)} className="ml-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-medium rounded border border-slate-200 text-slate-700">Opcje Wzoru</button>
  </div>
);

export default function ToolbarTop({ activeTool, globalColor, setGlobalColor, forceCloseShape, setForceCloseShape, smoothAmount, setSmoothAmount, activeShape, updateSelectedShape, setShowRightPanel, undo, redo, canUndo, canRedo, handleClear, fileInputRef, exportSVG, shapesCount }) {
  return (
    <div className="h-14 bg-white border-b border-slate-300 flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-6 overflow-x-auto">
        {(activeTool === 'smoother' || activeTool === 'snapper') && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              {colors.map(c => (
                <button key={c} onClick={() => setGlobalColor(c)} className={`w-6 h-6 rounded-full border ${globalColor === c ? 'scale-110 ring-2 ring-offset-1 ring-slate-400 border-transparent' : 'border-slate-300 hover:scale-110'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            {activeTool === 'smoother' && <SmoothControls forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape} smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} />}
          </div>
        )}
        {activeTool === 'select' && !activeShape && (<span className="text-sm font-medium text-slate-500">Wybierz kształt na płótnie, aby go edytować.</span>)}
        {activeTool === 'select' && activeShape && <EditControls activeShape={activeShape} updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel} />}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={undo} disabled={!canUndo} title="Cofnij" className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"><IconUndo /></button>
        <button onClick={redo} disabled={!canRedo} title="Ponów" className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"><IconRedo /></button>
        <div className="w-px h-6 bg-slate-300 mx-1"></div>
        <button onClick={handleClear} title="Wyczyść" className="p-2 text-red-500 hover:bg-red-50 rounded"><IconTrash /></button>
        <button onClick={() => fileInputRef.current.click()} title="Import SVG" className="p-2 text-slate-600 hover:bg-slate-100 rounded"><IconUpload /></button>
        <button onClick={exportSVG} disabled={shapesCount === 0} className="flex items-center px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded shadow disabled:opacity-50 ml-2"><IconDownload /> <span className="ml-2">Zapisz Jako</span></button>
      </div>
    </div>
  );
}
