import React from 'react';
import { IconPattern } from '../icons/icons';

const colors = ['#000000', '#FFFFFF', '#FC0FC0', '#00F6FF', '#F9F808', '#FF3B30', '#4CD964', '#007AFF'];

export default function ColorPickerPopup({
  activeColorPicker,
  globalColor, setGlobalColor,
  globalFillColor, setGlobalFillColor,
  globalFillPattern, setGlobalFillPattern,
  globalPatternSettings, setGlobalPatternSettings,
  activeShape, updateSelectedShape,
  customPatterns, openNewPatternTab, setShowColorPopup
}) {
  const isFill = activeColorPicker === 'fill';
  const currentColor = isFill
    ? (activeShape ? activeShape.fillColor : globalFillColor)
    : (activeShape ? activeShape.color : globalColor);

  const currentPattern = activeShape ? activeShape.fillPattern : globalFillPattern;
  const currentCustomSvg = activeShape ? activeShape.customPatternSvg : globalPatternSettings.customSvg;

  const currentSettings = activeShape ? {
    layout: activeShape.patternLayout || 'grid',
    scale: activeShape.patternScale || 1,
    spacing: activeShape.patternSpacing || 0
  } : globalPatternSettings;

  const handleColorSelect = (c) => {
    if (isFill) {
      if (activeShape) updateSelectedShape({ fillColor: c, fillPattern: null });
      else { setGlobalFillColor(c); setGlobalFillPattern(null); }
    } else {
      if (activeShape) updateSelectedShape({ color: c });
      else setGlobalColor(c);
    }
  };

  const handleNoneSelect = () => {
    if (isFill) {
      if (activeShape) updateSelectedShape({ fillColor: null, fillPattern: null });
      else { setGlobalFillColor(null); setGlobalFillPattern(null); }
    }
  };

  const handlePatternSelect = (type, svgData = null) => {
    if (activeShape) updateSelectedShape({ fillPattern: type, customPatternSvg: svgData });
    else {
      setGlobalFillPattern(type);
      setGlobalPatternSettings(prev => ({ ...prev, customSvg: svgData }));
    }
  };

  const updateSettings = (updates) => {
    if (activeShape) updateSelectedShape(updates);
    else setGlobalPatternSettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="absolute top-16 right-4 w-72 bg-white border border-slate-200 shadow-2xl rounded-xl flex flex-col z-50 p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
          {isFill ? 'Kolor Wypełnienia' : 'Kolor Obrysu'}
        </h3>
        <button onClick={() => setShowColorPopup(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
      </div>

      {/* Colors Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2">
          {isFill && (
            <button
              onClick={handleNoneSelect}
              className={`aspect-square rounded-lg border-2 relative hover:scale-105 transition-transform ${!currentColor && !currentPattern ? 'border-sky-500' : 'border-slate-200 hover:border-slate-300'}`}
              title="Brak"
            >
              <div className="absolute inset-0 m-auto w-[120%] h-0.5 bg-red-500 transform rotate-45 -translate-x-1"></div>
            </button>
          )}
          {colors.map(c => (
            <button
              key={c}
              onClick={() => handleColorSelect(c)}
              className={`aspect-square rounded-lg border-2 hover:scale-105 transition-transform ${currentColor === c && !currentPattern ? 'border-sky-500 ring-2 ring-sky-200 ring-offset-1' : 'border-slate-200 hover:border-slate-300'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Patterns Section (Only for Fill) */}
      {isFill && (
        <div className="border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconPattern className="w-4 h-4" /> Wzory
          </h4>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(customPatterns || []).map((pat, i) => (
              <button key={`custom-${i}`} onClick={() => handlePatternSelect('custom', pat)} className={`aspect-square rounded border-2 relative overflow-hidden ${currentPattern === 'custom' && currentCustomSvg === pat ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'}`}>
                <img src={pat} alt="Wzór" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button onClick={() => { openNewPatternTab(); setShowColorPopup(false); }} className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded border border-amber-200 transition-colors mb-4">Nowy Wzór...</button>

          {currentPattern && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Układ (Tiling)</label>
              <select className="w-full text-xs border border-slate-300 rounded p-1 mb-3 bg-white outline-none" value={currentSettings.layout} onChange={(e) => updateSettings({ patternLayout: e.target.value })}>
                <option value="grid">Siatka</option><option value="offset">Ze zjazdem (Cegła)</option><option value="hex">Heksagonalnie</option>
              </select>

              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider"><span>Rozmiar</span><span>x{currentSettings.scale}</span></div>
              <input type="range" min="0.2" max="5" step="0.1" value={currentSettings.scale} onChange={(e) => updateSettings({ patternScale: parseFloat(e.target.value) })} className="w-full mb-3 accent-slate-400" />

              <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider"><span>Odstęp</span><span>{currentSettings.spacing}px</span></div>
              <input type="range" min="0" max="100" step="2" value={currentSettings.spacing} onChange={(e) => updateSettings({ patternSpacing: parseInt(e.target.value) })} className="w-full accent-slate-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
