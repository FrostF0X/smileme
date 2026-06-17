import React from 'react';
import ShapeRenderer from './ShapeRenderer';
import PatternDefs from './PatternDefs';

export default function Canvas({
  svgRef, mainGroupRef, canvasTransform, shapes, currentStroke, bgImage, isDrawing, activeTool, globalColor,
  handlePointerDown, handlePointerMove, handlePointerUp,
  selectedShapeIndex, handleShapeClick
}) {
  const getCursorClass = () => {
    if (activeTool === 'eraser') return 'eraser-mode';
    if (activeTool === 'select') return 'select-mode';
    if (activeTool === 'pan') return 'cursor-grab active:cursor-grabbing';
    return 'cursor-crosshair';
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-white">
      {shapes.length === 0 && !bgImage.url && currentStroke.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
          <p className="text-slate-400 text-lg font-medium text-center">Narysuj coś lub wgraj tło.</p>
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
              isSelected={activeTool === 'select' && selectedShapeIndex === i}
              activeTool={activeTool}
              handleShapeClick={handleShapeClick}
            />
          ))}

          {currentStroke.length > 0 && activeTool !== 'eraser' && activeTool !== 'select' && activeTool !== 'pan' && (
            <path d={`M ${currentStroke.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="none" stroke={globalColor} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          )}
        </g>
      </svg>
    </div>
  );
}
