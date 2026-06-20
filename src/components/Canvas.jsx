import React from 'react';
import ShapeRenderer from './ShapeRenderer';
import PatternDefs from './PatternDefs';

export default function Canvas({
  svgRef, mainGroupRef, canvasTransform, shapes, currentStroke, bgImage, isDrawing, activeTool, globalColor, globalStrokeWidth,
  handlePointerDown, handlePointerMove, handlePointerUp,
  selectedShapeIndices, handleShapeInteraction
}) {
  const getCursorClass = () => {
    if (activeTool === 'eraser') return 'eraser-mode';
    if (activeTool === 'select') return 'select-mode';
    if (activeTool === 'pan') return 'cursor-grab active:cursor-grabbing';
    return 'cursor-crosshair';
  };
  return (
    <div className="w-[800px] h-[600px] bg-black shadow-2xl relative group ring-1 ring-white/5 mx-auto my-auto mt-4 mb-4 flex-shrink-0">
      {/* Artboard Shadow / Glow */}
      <div className="absolute inset-0 -z-10 bg-[#FC0FC0]/10 blur-[60px]"></div>

      {/* Artboard Label */}
      <div className="absolute top-4 left-4 flex gap-2 z-20 pointer-events-none">
        <div className="bg-[#111]/80 backdrop-blur-md px-3 py-1 rounded-full font-label-sm text-label-sm text-[#FC0FC0] border border-[#FC0FC0]/30 flex items-center gap-1 shadow-[0_0_10px_rgba(252,15,192,0.2)]">
          <span className="material-symbols-outlined text-[14px]">crop_free</span> Artboard 1
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {shapes.length === 0 && !bgImage.url && currentStroke.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
            <p className="text-on-surface-variant text-sm font-medium text-center">Narysuj coś lub wgraj tło.</p>
          </div>
        )}

        <svg
          ref={svgRef}
          className={`w-full h-full touch-none block overflow-visible ${getCursorClass()}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <PatternDefs shapes={shapes} />

          <g ref={mainGroupRef} transform={`translate(${canvasTransform.x}, ${canvasTransform.y}) rotate(${canvasTransform.angle}) scale(${canvasTransform.scale})`}>
            {bgImage.url && (
              <g id="reference-image" transform={`translate(${bgImage.x}, ${bgImage.y}) rotate(${bgImage.angle}) scale(${bgImage.scale})`}>
                <image href={bgImage.url} x={-bgImage.width / 2} y={-bgImage.height / 2} width={bgImage.width} height={bgImage.height} opacity={bgImage.opacity} pointerEvents="none" />
              </g>
            )}

          {shapes.map((shape, i) => (
            <ShapeRenderer
              key={i}
              shape={shape}
              index={i}
              isSelected={activeTool === 'select' && selectedShapeIndices && selectedShapeIndices.includes(i)}
              activeTool={activeTool}
              handleShapeInteraction={handleShapeInteraction}
            />
          ))}

            {currentStroke.length > 0 && activeTool !== 'eraser' && activeTool !== 'select' && activeTool !== 'pan' && (
              <path d={`M ${currentStroke.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="none" stroke={globalColor} strokeWidth={globalStrokeWidth || 4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
            )}
            {currentStroke.length > 0 && activeTool === 'select' && (
              <path d={`M ${currentStroke.map(p => `${p.x},${p.y}`).join(' L ')} Z`} fill="rgba(14, 165, 233, 0.1)" stroke="#0ea5e9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" opacity={0.8} style={{ pointerEvents: 'none' }} />
            )}
          </g>
        </svg>
      </div>

      {/* Selection Handles (Visual only for Artboard) */}
      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-nwse-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-ns-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-nesw-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-ew-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-ew-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-nesw-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-ns-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>
      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#FC0FC0] border-[1.5px] border-white z-10 cursor-nwse-resize shadow-[0_0_5px_rgba(252,15,192,0.8)] pointer-events-none"></div>

      {/* Bounding Box Outline */}
      <div className="absolute inset-0 border border-[#FC0FC0] shadow-[0_0_8px_rgba(252,15,192,0.3)_inset] pointer-events-none"></div>
    </div>
  );
}
