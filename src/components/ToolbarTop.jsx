import React from 'react';

const SmoothControls = ({ forceCloseShape, setForceCloseShape, smoothAmount, setSmoothAmount }) => (
  <div className="flex items-center gap-3 border-l border-white/10 pl-4 shrink-0">
    <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer hover:text-white transition-colors">
      <input type="checkbox" checked={forceCloseShape} onChange={(e) => setForceCloseShape(e.target.checked)} className="rounded border-white/20 bg-surface focus:ring-[#FC0FC0]" />
      Domknij
    </label>
    <span className="text-sm text-on-surface-variant ml-2">Wygładzanie:</span>
    <input type="range" min="0" max="100" step="5" value={smoothAmount} onChange={(e) => setSmoothAmount(parseInt(e.target.value))} className="w-20 accent-[#00FFFF]" />
  </div>
);

export default function ToolbarTop({ activeTool, forceCloseShape, setForceCloseShape, smoothAmount, setSmoothAmount, activeShape, undo, redo, canUndo, canRedo, handleClear, fileInputRef, exportSVG, shapesCount }) {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-panel-padding h-[56px] bg-[#111]/80 backdrop-blur-xl border-b border-[#FC0FC0]/20 shadow-sm glass-edge-top">
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="font-display-lg text-[24px] font-bold text-[#FC0FC0] tracking-tighter leading-none flex items-center">
            AetherDesign
        </div>

        {/* Navigation Links / Dynamic Context */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="px-3 py-1.5 rounded-md text-on-surface-variant font-body-md text-body-md hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95" onClick={() => fileInputRef.current.click()}>File (Import)</div>
          <div className="px-3 py-1.5 rounded-md text-on-surface-variant font-body-md text-body-md hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95" onClick={exportSVG}>Export</div>
          <div className="px-3 py-1.5 rounded-md text-on-surface-variant font-body-md text-body-md hover:bg-surface-variant/50 transition-colors cursor-pointer active:scale-95" onClick={handleClear}>Clear</div>

          {(activeTool === 'smoother' || activeTool === 'snapper' || activeTool === 'drawer') && (
            <div className="flex items-center ml-4">
              {(activeTool === 'smoother' || activeTool === 'drawer') && <SmoothControls forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape} smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} />}
            </div>
          )}
          {activeTool === 'select' && !activeShape && (<span className="text-sm font-medium text-on-surface-variant ml-4">Wybierz kształt na płótnie, aby go edytować.</span>)}
          {activeTool === 'select' && activeShape && (<span className="text-sm font-bold text-[#FFD700] ml-4">Edycja aktywnego kształtu</span>)}
        </nav>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-2">
        <button onClick={undo} disabled={!canUndo} className="p-2 rounded-full text-on-surface-variant hover:bg-[#FC0FC0]/10 hover:text-[#FC0FC0] transition-colors cursor-pointer active:scale-95 disabled:opacity-30">
            <span className="material-symbols-outlined text-[20px]">undo</span>
        </button>
        <button onClick={redo} disabled={!canRedo} className="p-2 rounded-full text-on-surface-variant hover:bg-[#00FFFF]/10 hover:text-[#00FFFF] transition-colors cursor-pointer active:scale-95 disabled:opacity-30">
            <span className="material-symbols-outlined text-[20px]">redo</span>
        </button>
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-[#FFD700]/10 hover:text-[#FFD700] transition-colors cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high border border-[#FC0FC0]/50 ml-2 overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(252,15,192,0.3)]">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpwP7iGzm4GQkPWXIE0_MLCblcfHtTYbsBvAHMUkUgriIrZN2QmFE4AH50qOrNCTY56dN_WhQ9pTQdZHLQ-zLoGV6aryR3bfnvYwL-joyUH1pOu-r6znjLj4_vGU-zLPHZFN3YT9P7khhjgYXy7qcBDOni3QuBrTReVfB80o_p8aGrBeeAKo0BizLXf2iRmVmBmWFE6bmQ4kT7WvUbA-BRmj8K1pjNATLW3ifygc3QfK9_OoHr4X5z" alt="Avatar"/>
        </div>
      </div>
    </header>
  );
}
