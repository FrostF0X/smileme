import React from 'react';

export default function ToolbarLeft({
  activeTool, setActiveTool, bgImage, setShowRightPanel, imageInputRef,
  setCanvasTransform, setShowGeminiApp,
  globalColor, globalFillColor, globalFillPattern,
  activeShape, showColorPopup, setShowColorPopup,
  activeColorPicker, setActiveColorPicker
}) {

  const strokeColor = activeShape ? activeShape.color : globalColor;
  const fillColor = activeShape ? activeShape.fillColor : globalFillColor;
  const fillPattern = activeShape ? activeShape.fillPattern : globalFillPattern;
  const isFillEmpty = !fillPattern && !fillColor;

  const handleStrokeClick = () => {
    setActiveColorPicker('stroke');
    if (!showColorPopup || activeColorPicker !== 'stroke') setShowColorPopup(true);
    else setShowColorPopup(false);
  };

  const handleFillClick = () => {
    setActiveColorPicker('fill');
    if (!showColorPopup || activeColorPicker !== 'fill') setShowColorPopup(true);
    else setShowColorPopup(false);
  };

  const getToolClass = (toolName, colorHex) => {
    const isActive = activeTool === toolName;
    if (isActive) {
      return `w-10 h-10 flex items-center justify-center bg-[${colorHex}] text-white shadow-[0_0_15px_rgba(252,15,192,0.5)] rounded-xl transition-all duration-200 ease-in-out`;
    }
    return `w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-[${colorHex}]/10 hover:text-[${colorHex}] transition-all duration-200 ease-in-out`;
  };

  return (
    <aside className="fixed left-0 top-[56px] bottom-[32px] z-40 flex flex-col items-center py-4 bg-[#111]/80 backdrop-blur-xl border-r border-[#00FFFF]/20 shadow-[0_0_20px_rgba(0,255,255,0.05)] w-[56px] glass-edge-left transition-all duration-200 ease-in-out">
      <div className="flex-1 flex flex-col items-center gap-2 w-full px-2">
        {/* Tools */}
        <button onClick={() => setActiveTool('select')} className={getToolClass('select', '#FC0FC0')} title="Select">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'select' ? 'icon-fill' : ''}`}>near_me</span>
        </button>
        <button onClick={() => setActiveTool('drawer')} className={getToolClass('drawer', '#00FFFF')} title="Proste Linie">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'drawer' ? 'icon-fill' : ''}`}>edit_square</span>
        </button>
        <button onClick={() => setActiveTool('smoother')} className={getToolClass('smoother', '#FFD700')} title="Płynne Krzywe">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'smoother' ? 'icon-fill' : ''}`}>gesture</span>
        </button>
        <button onClick={() => setActiveTool('snapper')} className={getToolClass('snapper', '#FC0FC0')} title="Auto-Elipsy">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'snapper' ? 'icon-fill' : ''}`}>category</span>
        </button>
        <button onClick={() => { setActiveTool('eraser'); setShowRightPanel(false); setShowColorPopup(false); }} className={getToolClass('eraser', '#00FFFF')} title="Gumka">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'eraser' ? 'icon-fill' : ''}`}>ink_eraser</span>
        </button>
        <button onClick={() => setActiveTool('pan')} onDoubleClick={() => setCanvasTransform({x: 0, y: 0, scale: 1, angle: 0})} className={getToolClass('pan', '#FFD700')} title="Przesuwanie">
          <span className={`material-symbols-outlined text-[20px] ${activeTool === 'pan' ? 'icon-fill' : ''}`}>pan_tool</span>
        </button>
      </div>

      <div className="h-px w-8 bg-white/10 my-2"></div>

      {/* Photoshop style swatches for color popup */}
      <div className="flex flex-col items-center relative w-10 h-10 shrink-0 my-2">
        <button
          onClick={handleFillClick}
          className={`absolute bottom-0 right-0 w-6 h-6 rounded border border-white/30 shadow-[0_0_5px_rgba(0,255,255,0.4)] flex items-center justify-center overflow-hidden transition-all ${activeColorPicker === 'fill' && showColorPopup ? 'z-10 scale-110 border-[#00FFFF]' : 'z-0'}`}
          style={{ backgroundColor: fillPattern ? 'transparent' : (fillColor || 'transparent') }}
          title="Fill Color/Pattern"
        >
          {isFillEmpty && (
            <div className="absolute inset-0 m-auto w-[140%] h-0.5 bg-red-500 transform rotate-45 -translate-x-1"></div>
          )}
          {fillPattern && (
            <span className="material-symbols-outlined text-[14px] text-white opacity-70">texture</span>
          )}
        </button>

        <button
          onClick={handleStrokeClick}
          className={`absolute top-0 left-0 w-6 h-6 rounded border border-white/30 shadow-[0_0_5px_rgba(252,15,192,0.4)] transition-all ${activeColorPicker === 'stroke' && showColorPopup ? 'z-10 scale-110 border-[#FC0FC0]' : 'z-5'}`}
          style={{ backgroundColor: strokeColor || '#000000' }}
          title="Stroke Color"
        />
      </div>

      <div className="h-px w-8 bg-white/10 my-2"></div>

      <div className="flex flex-col items-center gap-2 w-full px-2">
        <button onClick={() => { if (!bgImage.url) imageInputRef.current.click(); else setShowRightPanel(true); }} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${bgImage.url ? 'text-[#00FFFF] bg-[#00FFFF]/10 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'text-on-surface-variant hover:bg-[#00FFFF]/10 hover:text-[#00FFFF]'}`} title="Obraz Referencyjny">
          <span className="material-symbols-outlined text-[20px]">image</span>
          {bgImage.url && <span className="absolute top-2 right-2 w-2 h-2 bg-[#00FFFF] rounded-full shadow-[0_0_5px_rgba(0,255,255,0.8)]"></span>}
        </button>
        <button onClick={() => setShowGeminiApp(true)} className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-all duration-200 ease-in-out" title="AI Generator">
          <span className="material-symbols-outlined text-[20px]">temp_preferences_custom</span>
        </button>
      </div>
    </aside>
  );
}
