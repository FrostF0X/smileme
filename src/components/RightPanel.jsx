import React from 'react';
import { IconSettings, IconPattern, IconFilePlus } from '../icons/icons';

export default function RightPanel({ showRightPanel, setShowRightPanel, bgImage, setBgImage, activeTool, activeShape, updateSelectedShape, patternInputRef, svgRef, traceConfig, setTraceConfig, handleTrace, isTracing, transformTarget, setTransformTarget }) {
  if (!showRightPanel || (!bgImage.url && !(activeTool === 'select' && activeShape))) return null;

  return (
    <div className="w-72 bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col p-4 panel-slide z-20 shrink-0 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><IconSettings /> Opcje</h3>
        <button onClick={() => setShowRightPanel(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cel gestów</h4>
        <div className="flex gap-2">
          <button onClick={() => setTransformTarget('canvas')} className={`flex-1 text-xs py-2 font-medium rounded-lg transition-colors ${transformTarget === 'canvas' ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Ekran</button>
          <button onClick={() => setTransformTarget('background')} disabled={!bgImage.url} className={`flex-1 text-xs py-2 font-medium rounded-lg transition-colors ${transformTarget === 'background' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'}`}>Tło</button>
        </div>
      </div>

      {bgImage.url && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tło Referencyjne</h4>
          <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Krycie</span><span className="font-bold text-emerald-600">{Math.round(bgImage.opacity * 100)}%</span></div>
          <input type="range" min="0.1" max="1" step="0.05" value={bgImage.opacity} onChange={(e) => setBgImage(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))} className="w-full mb-4 accent-emerald-500" />
          <div className="flex gap-2">
            <button onClick={() => {
              const r = svgRef.current.getBoundingClientRect();
              const s = Math.min((r.width * 0.8) / bgImage.width, (r.height * 0.8) / bgImage.height);
              setBgImage(prev => ({ ...prev, x: r.width / 2, y: r.height / 2, scale: s, angle: 0 }));
            }} className="flex-1 text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">Wyśrodkuj</button>
            <button onClick={() => { setBgImage({ url: null }); setShowRightPanel(false); }} className="flex-1 text-xs py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors">Usuń Tło</button>
          </div>

        <div className="bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-200 mb-4 mt-4">
          <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">Wektoryzacja (Potrace)</h4>
          <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Ilość warstw</span><span className="font-bold text-indigo-600">{traceConfig?.layers}</span></div>
          <input type="range" min="1" max="10" step="1" value={traceConfig?.layers || 1} onChange={(e) => setTraceConfig(prev => ({...prev, layers: parseInt(e.target.value)}))} className="w-full mb-3 accent-indigo-500" />
          <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Usuwanie szumu</span><span className="font-bold text-indigo-600">{traceConfig?.turdsize}</span></div>
          <input type="range" min="0" max="10" step="1" value={traceConfig?.turdsize || 2} onChange={(e) => setTraceConfig(prev => ({...prev, turdsize: parseInt(e.target.value)}))} className="w-full mb-4 accent-indigo-500" />
          <button onClick={handleTrace} disabled={isTracing} className="w-full text-sm py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {isTracing ? 'Wektoryzowanie...' : 'Wektoryzuj (Trace)'}
          </button>
        </div>

        </div>
      )}

      {activeTool === 'select' && activeShape && activeShape.fillPattern && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2"><IconPattern /> Wzór Wypełnienia</h4>
          {activeShape.fillPattern === 'custom' && (
            <div className="mb-5 pb-5 border-b border-slate-100">
              <button onClick={() => patternInputRef.current.click()} className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-semibold rounded-lg border border-amber-200 transition-colors flex items-center justify-center gap-2"><IconFilePlus /> Wgraj swój plik SVG</button>
              {activeShape.customPatternSvg && <p className="text-[10px] text-center text-emerald-600 mt-2 font-medium">Plik SVG pomyślnie załadowany ✓</p>}
            </div>
          )}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Układ (Tiling)</label>
            <select className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-slate-50 outline-none focus:ring-2 ring-amber-200" value={activeShape.patternLayout || 'grid'} onChange={(e) => updateSelectedShape({ patternLayout: e.target.value })}>
              <option value="grid">Kwadratowo (Siatka)</option><option value="offset">Ze zjazdem (Cegła)</option><option value="hex">Heksagonalnie</option>
            </select>
          </div>
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Rozmiar elementu</span><span className="font-bold">x{activeShape.patternScale || 1}</span></div>
            <input type="range" min="0.2" max="5" step="0.1" value={activeShape.patternScale || 1} onChange={(e) => updateSelectedShape({ patternScale: parseFloat(e.target.value) })} className="w-full accent-amber-500" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Odstęp między elementami</span><span className="font-bold">{activeShape.patternSpacing || 0}px</span></div>
            <input type="range" min="0" max="100" step="2" value={activeShape.patternSpacing || 0} onChange={(e) => updateSelectedShape({ patternSpacing: parseInt(e.target.value) })} className="w-full accent-amber-500" />
          </div>
        </div>
      )}
    </div>
  );
}
