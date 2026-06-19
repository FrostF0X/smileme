import React from 'react';

export default function RightPanel({
  showRightPanel, setShowRightPanel, rightPanelTab, setRightPanelTab, bgImage, setBgImage,
  activeTool, activeShape, updateSelectedShape, patternInputRef, svgRef,
  traceConfig, setTraceConfig, handleTrace, isTracing, transformTarget, setTransformTarget, customPatterns, setIsPatternEditor
}) {
  if (!showRightPanel) return null;

  return (
    <aside className="fixed right-0 top-[56px] bottom-[32px] z-40 flex flex-col bg-[#111]/80 backdrop-blur-xl border-l border-[#FC0FC0]/20 shadow-[-5px_0_20px_rgba(252,15,192,0.05)] w-[280px] transition-all glass-edge-right">
      {/* Tabs */}
      <div className="flex border-b border-white/10 px-2 pt-2">
        <button onClick={() => setRightPanelTab('options')} className={`flex-1 pb-2 flex items-center justify-center gap-2 font-label-sm text-label-sm transition-all border-b-2 ${rightPanelTab === 'options' ? 'text-[#FC0FC0] border-[#FC0FC0] drop-shadow-[0_0_5px_rgba(252,15,192,0.5)]' : 'text-on-surface-variant hover:text-[#FC0FC0] border-transparent hover:border-[#FC0FC0]/50'}`}>
          <span className="material-symbols-outlined text-[16px]">tune</span> Właściwości
        </button>
        <button className="flex-1 pb-2 flex items-center justify-center gap-2 text-on-surface-variant hover:text-[#00FFFF] font-label-sm text-label-sm transition-all border-b-2 border-transparent hover:border-[#00FFFF]/50">
          <span className="material-symbols-outlined text-[16px]">layers</span> Warstwy
        </button>
        <button onClick={() => setShowRightPanel(false)} className="flex-1 pb-2 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white font-label-sm text-label-sm transition-all border-b-2 border-transparent">
          <span className="material-symbols-outlined text-[16px]">close</span> Zamknij
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 font-body-md text-body-md custom-scrollbar">

        {/* Gestures Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline-md text-[14px] text-white font-semibold tracking-wide">Cel gestów</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTransformTarget('canvas')} className={`flex-1 text-xs py-2 font-medium rounded transition-all ${transformTarget === 'canvas' ? 'bg-[#FC0FC0] text-white shadow-[0_0_8px_rgba(252,15,192,0.4)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}>Ekran</button>
            <button onClick={() => setTransformTarget('background')} disabled={!bgImage.url} className={`flex-1 text-xs py-2 font-medium rounded transition-all ${transformTarget === 'background' ? 'bg-[#00FFFF] text-[#111] shadow-[0_0_8px_rgba(0,255,255,0.4)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant disabled:opacity-50'}`}>Tło</button>
            <button onClick={() => setTransformTarget('selection')} disabled={!activeShape || activeTool !== 'select'} className={`flex-1 text-xs py-2 font-medium rounded transition-all ${transformTarget === 'selection' ? 'bg-[#FFD700] text-[#111] shadow-[0_0_8px_rgba(255,215,0,0.4)]' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant disabled:opacity-50'}`}>Figura</button>
          </div>
        </section>

        <div className="h-px bg-white/5 w-full"></div>

        {/* Background Trace Section */}
        {bgImage.url && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-md text-[14px] text-white font-semibold tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00FFFF] text-[16px] drop-shadow-[0_0_5px_rgba(0,255,255,0.6)]">image</span>
                Tło Referencyjne
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                  <span>Krycie</span>
                  <span className="text-[#00FFFF] font-bold">{Math.round(bgImage.opacity * 100)}%</span>
                </div>
                <input type="range" min="0.1" max="1" step="0.05" value={bgImage.opacity} onChange={(e) => setBgImage(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))} className="w-full accent-[#00FFFF]" />
              </div>

              <div className="flex gap-2">
                <button onClick={() => {
                  const r = svgRef.current.getBoundingClientRect();
                  const s = Math.min((r.width * 0.8) / bgImage.width, (r.height * 0.8) / bgImage.height);
                  setBgImage(prev => ({ ...prev, x: r.width / 2, y: r.height / 2, scale: s, angle: 0 }));
                }} className="flex-1 text-xs py-1.5 bg-surface-container hover:bg-surface-variant text-white rounded transition-colors border border-white/10 hover:border-[#00FFFF]/50">Wyśrodkuj</button>
                <button onClick={() => { setBgImage({ url: null }); setShowRightPanel(false); }} className="flex-1 text-xs py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded transition-colors border border-red-500/20">Usuń Tło</button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-surface-container rounded-lg border border-[#FC0FC0]/20 shadow-[0_0_10px_rgba(252,15,192,0.05)]">
              <h4 className="text-xs font-bold text-[#FC0FC0] uppercase tracking-wider mb-3">Wektoryzacja</h4>
              <div className="flex justify-between text-[10px] mb-1 text-on-surface-variant"><span>Ilość warstw</span><span className="font-bold text-[#FC0FC0]">{traceConfig?.layers}</span></div>
              <input type="range" min="1" max="10" step="1" value={traceConfig?.layers || 1} onChange={(e) => setTraceConfig(prev => ({...prev, layers: parseInt(e.target.value)}))} className="w-full mb-2 accent-[#FC0FC0]" />

              <div className="flex justify-between text-[10px] mb-1 text-on-surface-variant"><span>Usuwanie szumu</span><span className="font-bold text-[#FC0FC0]">{traceConfig?.turdsize}</span></div>
              <input type="range" min="0" max="10" step="1" value={traceConfig?.turdsize || 2} onChange={(e) => setTraceConfig(prev => ({...prev, turdsize: parseInt(e.target.value)}))} className="w-full mb-3 accent-[#FC0FC0]" />

              <button onClick={handleTrace} disabled={isTracing} className="w-full text-xs py-2 bg-gradient-to-r from-[#FC0FC0] to-[#b20087] text-white font-semibold rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_10px_rgba(252,15,192,0.3)]">
                {isTracing ? 'Wektoryzowanie...' : 'Wektoryzuj (Trace)'}
              </button>
            </div>
          </section>
        )}

        {/* Selected Shape Transform Section */}
        {activeTool === 'select' && activeShape && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline-md text-[14px] text-white font-semibold tracking-wide">Transform</h3>
              <button onClick={() => setTransformTarget('selection')} className={`text-[10px] px-2 py-0.5 rounded-full ${transformTarget === 'selection' ? 'bg-[#FFD700] text-[#111]' : 'bg-surface-container text-on-surface-variant hover:text-white'}`}>Gest</button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center bg-surface-container rounded-md border border-white/5 focus-within:border-[#FFD700]/50 focus-within:shadow-[0_0_8px_rgba(255,215,0,0.2)] transition-all px-2 py-1.5">
                <span className="text-on-surface-variant w-4 font-label-sm">X</span>
                <input type="number" value={activeShape.x !== undefined ? Math.round(activeShape.x) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ x: isNaN(v) ? 0 : v }); }} className="bg-transparent border-none text-white w-full focus:ring-0 text-right font-label-sm p-0 m-0" />
              </div>
              <div className="flex items-center bg-surface-container rounded-md border border-white/5 focus-within:border-[#FFD700]/50 focus-within:shadow-[0_0_8px_rgba(255,215,0,0.2)] transition-all px-2 py-1.5">
                <span className="text-on-surface-variant w-4 font-label-sm">Y</span>
                <input type="number" value={activeShape.y !== undefined ? Math.round(activeShape.y) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ y: isNaN(v) ? 0 : v }); }} className="bg-transparent border-none text-white w-full focus:ring-0 text-right font-label-sm p-0 m-0" />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center bg-surface-container rounded-md border border-white/5 focus-within:border-[#FFD700]/50 focus-within:shadow-[0_0_8px_rgba(255,215,0,0.2)] transition-all px-2 py-1.5 mb-2">
                <span className="text-on-surface-variant w-16 font-label-sm">Obrót</span>
                <input type="number" value={activeShape.rotation !== undefined ? Math.round(activeShape.rotation) : 0} onChange={(e) => { const v = parseFloat(e.target.value); updateSelectedShape({ rotation: isNaN(v) ? 0 : v }); }} className="bg-transparent border-none text-white w-full focus:ring-0 text-right font-label-sm p-0 m-0" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 90) % 360 })} className="flex-1 text-[10px] bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-white/5 p-1 rounded">+90°</button>
                <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 180) % 360 })} className="flex-1 text-[10px] bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-white/5 p-1 rounded">+180°</button>
                <button onClick={() => updateSelectedShape({ rotation: ((activeShape.rotation || 0) + 270) % 360 })} className="flex-1 text-[10px] bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-white/5 p-1 rounded">+270°</button>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant font-semibold block mb-1">Odbicie</span>
              <div className="flex gap-2">
                <button onClick={() => updateSelectedShape({ scaleX: (activeShape.scaleX !== undefined ? activeShape.scaleX : 1) * -1 })} className="flex-1 text-xs py-1.5 bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-white/5 rounded transition-colors">Poziome</button>
                <button onClick={() => updateSelectedShape({ scaleY: (activeShape.scaleY !== undefined ? activeShape.scaleY : 1) * -1 })} className="flex-1 text-xs py-1.5 bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-white/5 rounded transition-colors">Pionowe</button>
              </div>
            </div>
          </section>
        )}

        {/* Pattern Section */}
        {activeTool === 'select' && activeShape && activeShape.fillPattern && (
          <>
            <div className="h-px bg-white/5 w-full"></div>
            <section>
              <h3 className="font-headline-md text-[14px] text-white font-semibold tracking-wide flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#FFD700] text-[16px] drop-shadow-[0_0_5px_rgba(255,215,0,0.6)]">texture</span>
                Wzór Wypełnienia
              </h3>

              {activeShape.fillPattern === 'custom' && (
                <div className="mb-4 pb-4 border-b border-white/10">
                  <button onClick={() => patternInputRef.current.click()} className="w-full py-2 bg-surface-container hover:bg-surface-variant text-[#FFD700] text-sm font-semibold rounded-lg border border-[#FFD700]/20 transition-colors flex items-center justify-center gap-2"><span className="material-symbols-outlined text-[16px]">upload_file</span> Wgraj SVG</button>
                  {activeShape.customPatternSvg && <p className="text-[10px] text-center text-[#00FFFF] mt-2 font-medium">Plik SVG załadowany ✓</p>}
                </div>
              )}

              <div className="mb-3">
                <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Układ (Tiling)</label>
                <select className="w-full text-xs border border-white/10 rounded p-1.5 bg-surface-container text-white outline-none focus:ring-1 ring-[#FFD700]" value={activeShape.patternLayout || 'grid'} onChange={(e) => updateSelectedShape({ patternLayout: e.target.value })}>
                  <option value="grid">Kwadratowo (Siatka)</option><option value="offset">Ze zjazdem (Cegła)</option><option value="hex">Heksagonalnie</option>
                </select>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-[10px] mb-1 text-on-surface-variant"><span>Rozmiar</span><span className="font-bold text-white">x{activeShape.patternScale || 1}</span></div>
                <input type="range" min="0.2" max="5" step="0.1" value={activeShape.patternScale || 1} onChange={(e) => updateSelectedShape({ patternScale: parseFloat(e.target.value) })} className="w-full accent-[#FFD700]" />
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1 text-on-surface-variant"><span>Odstęp</span><span className="font-bold text-white">{activeShape.patternSpacing || 0}px</span></div>
                <input type="range" min="0" max="100" step="2" value={activeShape.patternSpacing || 0} onChange={(e) => updateSelectedShape({ patternSpacing: parseInt(e.target.value) })} className="w-full accent-[#FFD700]" />
              </div>
            </section>
          </>
        )}
      </div>
    </aside>
  );
}
