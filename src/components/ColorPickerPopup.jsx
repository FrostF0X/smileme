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
  customPatterns, setIsPatternEditor, setShowColorPopup
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
    <div className="absolute bottom-16 left-16 w-72 bg-[#1A1A1A] border border-[#333333] shadow-2xl rounded-xl flex flex-col z-50 p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#333333]">
        <h3 className="font-bold text-white uppercase text-xs tracking-wider">
          {isFill ? 'Kolor Wypełnienia' : 'Kolor Obrysu'}
        </h3>
        <button onClick={() => setShowColorPopup(false)} className="text-gray-400 hover:text-gray-200 font-bold">&times;</button>
      </div>

      {/* Colors Grid */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 justify-start">
          {isFill && (
            <button
              onClick={handleNoneSelect}
              className={`w-8 h-8 rounded-md border-2 relative hover:scale-105 transition-transform ${!currentColor && !currentPattern ? 'border-[#FC0FC0]' : 'border-[#333333] hover:border-[#444444]'}`}
              title="Brak"
            >
              <div className="absolute inset-0 m-auto w-[120%] h-0.5 bg-red-500 transform rotate-45 -translate-x-1"></div>
            </button>
          )}
          {colors.map(c => (
            <button
              key={c}
              onClick={() => handleColorSelect(c)}
              className={`w-8 h-8 rounded-md border-2 hover:scale-105 transition-transform ${currentColor === c && !currentPattern ? 'border-[#FC0FC0] ring-2 ring-[#FC0FC0]/50 ring-offset-1 ring-offset-[#1A1A1A]' : 'border-[#333333] hover:border-[#444444]'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Patterns Section (Only for Fill) */}
      {isFill && (
        <div className="border-t border-[#333333] pt-4">
          <h4 className="text-xs font-bold text-[#00FFFF] uppercase tracking-wider mb-3 flex items-center gap-2">
            <IconPattern className="w-4 h-4" /> Wzory
          </h4>

          <div className="flex flex-wrap gap-2 mb-4 justify-start">
            <button onClick={() => handlePatternSelect('dots')} className={`w-8 h-8 rounded border-2 flex items-center justify-center ${currentPattern === 'dots' ? 'border-[#FC0FC0]' : 'border-[#333333] hover:border-[#444444]'}`}>
              <div className="w-2 h-2 rounded-full bg-gray-500 shadow-[4px_4px_0_0_#6b7280,-4px_-4px_0_0_#6b7280,-4px_4px_0_0_#6b7280,4px_-4px_0_0_#6b7280]"></div>
            </button>
            <button onClick={() => handlePatternSelect('grid')} className={`w-8 h-8 rounded border-2 flex items-center justify-center ${currentPattern === 'grid' ? 'border-[#FC0FC0]' : 'border-[#333333] hover:border-[#444444]'}`}>
              <div className="w-4 h-4 border border-gray-500 grid grid-cols-2 grid-rows-2"><div className="border-r border-b border-gray-500"></div><div className="border-b border-gray-500"></div><div className="border-r border-gray-500"></div><div></div></div>
            </button>
            <button onClick={() => handlePatternSelect('lines')} className={`w-8 h-8 rounded border-2 flex items-center justify-center ${currentPattern === 'lines' ? 'border-[#FC0FC0]' : 'border-[#333333] hover:border-[#444444]'}`}>
              <div className="flex flex-col gap-1 w-4"><div className="h-0.5 bg-gray-500"></div><div className="h-0.5 bg-gray-500"></div><div className="h-0.5 bg-gray-500"></div></div>
            </button>

            {(customPatterns || []).map((pat, i) => (
              <button key={`custom-${i}`} onClick={() => handlePatternSelect('custom', pat)} className={`w-8 h-8 rounded border-2 relative overflow-hidden ${currentPattern === 'custom' && currentCustomSvg === pat ? 'border-[#FC0FC0]' : 'border-[#333333] hover:border-[#444444]'}`}>
                <img src={pat} alt="Wzór" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button onClick={() => { setIsPatternEditor(true); setShowColorPopup(false); }} className="w-full py-1.5 bg-[#333333] hover:bg-[#444444] text-white text-xs font-semibold rounded border border-[#555555] transition-colors mb-4">Nowy Wzór...</button>

          {currentPattern && (
            <div className="bg-[#222222] p-3 rounded-md border border-[#333333]">
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Układ (Tiling)</label>
              <select className="w-full text-xs border border-[#444444] rounded p-1 mb-3 bg-[#1A1A1A] outline-none text-white" value={currentSettings.layout} onChange={(e) => updateSettings({ patternLayout: e.target.value })}>
                <option value="grid">Siatka</option><option value="offset">Ze zjazdem (Cegła)</option><option value="hex">Heksagonalnie</option>
              </select>

              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider"><span>Rozmiar</span><span>x{currentSettings.scale}</span></div>
              <input type="range" min="0.2" max="5" step="0.1" value={currentSettings.scale} onChange={(e) => updateSettings({ patternScale: parseFloat(e.target.value) })} className="w-full mb-3 accent-[#FC0FC0]" />

              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider"><span>Odstęp</span><span>{currentSettings.spacing}px</span></div>
              <input type="range" min="0" max="100" step="2" value={currentSettings.spacing} onChange={(e) => updateSettings({ patternSpacing: parseInt(e.target.value) })} className="w-full accent-[#FC0FC0]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
