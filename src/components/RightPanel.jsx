import React from 'react';
import { IconSettings, IconPattern, IconFilePlus } from '../icons/icons';

export default function RightPanel({ showRightPanel, setShowRightPanel, rightPanelTab, setRightPanelTab, bgImage, setBgImage, activeTool, activeShape, updateSelectedShape, patternInputRef, svgRef, traceConfig, setTraceConfig, handleTrace, isTracing, transformTarget, setTransformTarget, customPatterns, setIsPatternEditor }) {
  if (!showRightPanel || (!bgImage.url && !(activeTool === 'select' && activeShape))) return null;

  const currentTab = rightPanelTab || 'options';
  const tabs = ['options', 'patterns'];
  const handleTabKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextTab = tabs[(tabs.indexOf(currentTab) + offset + tabs.length) % tabs.length];
    setRightPanelTab(nextTab);
    window.requestAnimationFrame(() => {
      document.getElementById(`right-panel-tab-${nextTab}`)?.focus();
    });
  };

  return (
    <div className="w-72 bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col panel-slide z-20 shrink-0">
      <div className="flex justify-between items-center p-4 border-b border-slate-200 shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><IconSettings /> Panel Boczny</h3>
        <button onClick={() => setShowRightPanel(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentTab === 'options' && (
          <div role="tabpanel" id="right-panel-options" aria-labelledby="right-panel-tab-options">
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
                  <input type="range" min="1" max="10" step="1" value={traceConfig?.layers || 1} onChange={(e) => setTraceConfig(prev => ({ ...prev, layers: parseInt(e.target.value) }))} className="w-full mb-3 accent-indigo-500" />
                  <div className="flex justify-between text-xs mb-2 text-slate-600"><span>Usuwanie szumu</span><span className="font-bold text-indigo-600">{traceConfig?.turdsize}</span></div>
                  <input type="range" min="0" max="10" step="1" value={traceConfig?.turdsize || 2} onChange={(e) => setTraceConfig(prev => ({ ...prev, turdsize: parseInt(e.target.value) }))} className="w-full mb-4 accent-indigo-500" />
                  <button onClick={handleTrace} disabled={isTracing} className="w-full text-sm py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                    {isTracing ? 'Wektoryzowanie...' : 'Wektoryzuj (Trace)'}
                  </button>
                </div>
              </div>
            )}

            {activeTool === 'select' && activeShape && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">Przekształcenia</h4>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Pozycja X</span>
                    <input type="number" value={activeShape.x !== undefined ? Math.round(activeShape.x) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ x: isNaN(v) ? 0 : v }); }} className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 ring-amber-300 outline-none" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Pozycja Y</span>
                    <input type="number" value={activeShape.y !== undefined ? Math.round(activeShape.y) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ y: isNaN(v) ? 0 : v }); }} className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 ring-amber-300 outline-none" />
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">Obrót (Kąt)</span>
                  <input type="number" value={activeShape.rotation !== undefined ? Math.round(activeShape.rotation) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ rotation: isNaN(v) ? 0 : v }); }} className="w-full text-xs p-1.5 border border-slate-300 rounded focus:ring-1 ring-amber-300 outline-none mb-2" />
                  <div className="flex gap-1">
                    <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 90) % 360 })} className="flex-1 text-[10px] bg-slate-100 hover:bg-slate-200 p-1 rounded font-medium">+90°</button>
                    <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 180) % 360 })} className="flex-1 text-[10px] bg-slate-100 hover:bg-slate-200 p-1 rounded font-medium">+180°</button>
                    <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 270) % 360 })} className="flex-1 text-[10px] bg-slate-100 hover:bg-slate-200 p-1 rounded font-medium">+270°</button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">Odbicie</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateSelectedShape({ scaleX: (activeShape.scaleX !== undefined ? activeShape.scaleX : 1) * -1 })} className="flex-1 text-xs py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors text-slate-700 border border-slate-200">Poziome</button>
                    <button onClick={() => updateSelectedShape({ scaleY: (activeShape.scaleY !== undefined ? activeShape.scaleY : 1) * -1 })} className="flex-1 text-xs py-1.5 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors text-slate-700 border border-slate-200">Pionowe</button>
                  </div>
                </div>
              </div>
            )}

            {activeTool === 'select' && activeShape && activeShape.fillPattern && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2"><IconPattern /> Opcje Wzoru</h4>
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
        )}

        {currentTab === 'patterns' && activeTool === 'select' && activeShape && (
          <div role="tabpanel" id="right-panel-patterns" aria-labelledby="right-panel-tab-patterns" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
            <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2"><IconPattern /> Dostępne Wzory</h4>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => updateSelectedShape({ fillPattern: 'dots' })} className={`aspect-square rounded border-2 flex items-center justify-center ${activeShape.fillPattern === 'dots' ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="w-2 h-2 rounded-full bg-slate-600 shadow-[4px_4px_0_0_#475569,-4px_-4px_0_0_#475569,-4px_4px_0_0_#475569,4px_-4px_0_0_#475569]"></div>
              </button>
              <button onClick={() => updateSelectedShape({ fillPattern: 'grid' })} className={`aspect-square rounded border-2 flex items-center justify-center ${activeShape.fillPattern === 'grid' ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="w-4 h-4 border border-slate-600 grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-slate-600"></div><div className="border-b border-slate-600"></div><div className="border-r border-slate-600"></div><div></div></div>
              </button>
              <button onClick={() => updateSelectedShape({ fillPattern: 'lines' })} className={`aspect-square rounded border-2 flex items-center justify-center ${activeShape.fillPattern === 'lines' ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="flex flex-col gap-1 w-4"><div className="h-0.5 bg-slate-600"></div><div className="h-0.5 bg-slate-600"></div><div className="h-0.5 bg-slate-600"></div></div>
              </button>

              {(customPatterns || []).map((pat, i) => (
                <button key={`custom-${i}`} onClick={() => updateSelectedShape({ fillPattern: 'custom', customPatternSvg: pat })} className={`aspect-square rounded border-2 relative overflow-hidden ${activeShape.fillPattern === 'custom' && activeShape.customPatternSvg === pat ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'}`}>
                  <img src={pat} alt="Wzór" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button onClick={() => patternInputRef.current.click()} className="w-full py-2 mb-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors flex items-center justify-center gap-2"><IconFilePlus /> Wgraj plik SVG</button>
            <button onClick={() => setIsPatternEditor(true)} className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-semibold rounded-lg border border-amber-300 transition-colors flex items-center justify-center gap-2">Nowy Wzór</button>
          </div>
        )}
      </div>

      <div role="tablist" className="flex border-t border-slate-200 bg-slate-100 shrink-0">
        <button id="right-panel-tab-options" role="tab" aria-selected={currentTab === 'options'} aria-controls="right-panel-options" onClick={() => setRightPanelTab('options')} onKeyDown={handleTabKeyDown} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${currentTab === 'options' ? 'bg-white text-sky-600 border-t-2 border-sky-500' : 'text-slate-500 hover:bg-slate-200 border-t-2 border-transparent'}`}>Opcje</button>
        <button id="right-panel-tab-patterns" role="tab" aria-selected={currentTab === 'patterns'} aria-controls="right-panel-patterns" onClick={() => setRightPanelTab('patterns')} onKeyDown={handleTabKeyDown} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${currentTab === 'patterns' ? 'bg-white text-amber-600 border-t-2 border-amber-500' : 'text-slate-500 hover:bg-slate-200 border-t-2 border-transparent'}`}>Wzory</button>
      </div>
    </div>
  );
}
