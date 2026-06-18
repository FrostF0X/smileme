import React, { useState } from 'react';
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

const EditControls = ({ activeShape, updateSelectedShape, setShowRightPanel, setRightPanelTab }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const handleColorSelect = (c, isFill) => {
    if (isFill) updateSelectedShape({ fillPattern: null, fillColor: c });
    else updateSelectedShape({ color: c });
    setActiveDropdown(null);
  };

  const handlePatternSelect = () => {
    setShowRightPanel(true);
    setRightPanelTab('patterns');
    setActiveDropdown(null);
  };

  const isFillEmpty = !activeShape.fillPattern && !activeShape.fillColor;

  return (
    <div className="flex items-center gap-4 shrink-0 relative">
      <span className="text-sm font-bold text-amber-600">Edycja:</span>

      <div className="flex items-center gap-3">
        {/* Stroke Color Square */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('stroke')}
            className={`w-8 h-8 rounded border-2 ${activeDropdown === 'stroke' ? 'border-amber-400' : 'border-slate-300'}`}
            style={{ backgroundColor: activeShape.color || '#000' }}
            title="Stroke Color"
          />
          {activeDropdown === 'stroke' && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 shadow-xl rounded-lg p-2 flex gap-2 z-50">
              {colors.map(c => (
                <button key={c} onClick={() => handleColorSelect(c, false)} className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </div>

        {/* Fill Color Square */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('fill')}
            className={`w-8 h-8 rounded border-2 relative ${activeDropdown === 'fill' ? 'border-amber-400' : 'border-slate-300'}`}
            style={{ backgroundColor: activeShape.fillPattern ? 'transparent' : (activeShape.fillColor || 'transparent') }}
            title="Fill Options"
          >
            {isFillEmpty && (
              <div className="absolute inset-0 m-auto w-full h-0.5 bg-red-500 transform rotate-45"></div>
            )}
            {activeShape.fillPattern && (
              <div className="absolute inset-0 flex items-center justify-center"><IconPattern /></div>
            )}
          </button>

          {activeDropdown === 'fill' && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 shadow-xl rounded-lg p-2 flex flex-col gap-2 z-50 w-max">
              <div className="flex gap-2">
                <button onClick={() => handleColorSelect(null, true)} className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 relative" title="Brak">
                  <div className="absolute inset-0 m-auto w-full h-0.5 bg-red-500 transform rotate-45"></div>
                </button>
                {colors.map(c => (
                  <button key={c} onClick={() => handleColorSelect(c, true)} className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="h-px w-full bg-slate-200"></div>
              <button onClick={handlePatternSelect} className="flex items-center gap-2 text-sm text-slate-700 hover:bg-slate-100 p-1.5 rounded w-full">
                <IconPattern /> <span className="font-medium">Wzory...</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ToolbarTop({ activeTool, globalColor, setGlobalColor, forceCloseShape, setForceCloseShape, smoothAmount, setSmoothAmount, activeShape, updateSelectedShape, setShowRightPanel, setRightPanelTab, undo, redo, canUndo, canRedo, handleClear, fileInputRef, exportSVG, shapesCount }) {
  return (
    <div className="h-14 bg-white border-b border-slate-300 flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-6 overflow-visible">
        {(activeTool === 'smoother' || activeTool === 'snapper' || activeTool === 'drawer') && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              {colors.map(c => (
                <button key={c} onClick={() => setGlobalColor(c)} className={`w-6 h-6 rounded-full border ${globalColor === c ? 'scale-110 ring-2 ring-offset-1 ring-slate-400 border-transparent' : 'border-slate-300 hover:scale-110'}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            {(activeTool === 'smoother' || activeTool === 'drawer') && <SmoothControls forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape} smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} />}
          </div>
        )}
        {activeTool === 'select' && !activeShape && (<span className="text-sm font-medium text-slate-500">Wybierz kształt na płótnie, aby go edytować.</span>)}
        {activeTool === 'select' && activeShape && <EditControls activeShape={activeShape} updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel} setRightPanelTab={setRightPanelTab} />}
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
