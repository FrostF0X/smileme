import React from 'react';
import ShapeRenderer from './ShapeRenderer';

export default function PatternEditorCanvas({ svgRef, activeTool, handleCanvasPointerDown, handleCanvasPointerMove, handleCanvasPointerUp, mainGroupRef, shapes, currentStroke, globalColor }) {
  return (
    <div className="flex-1 relative flex items-center justify-center p-8">
      <div className="w-[200px] h-[200px] bg-white shadow-2xl relative">
        <svg
          ref={svgRef}
          className="w-full h-full touch-none block overflow-visible cursor-crosshair"
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          onPointerLeave={handleCanvasPointerUp}
        >
          <g ref={mainGroupRef}>
            {shapes.map((shape, i) => (
              <ShapeRenderer key={i} shape={shape} index={i} isSelected={false} activeTool={activeTool} handleShapeInteraction={() => {}} />
            ))}
            {currentStroke.length > 0 && activeTool !== 'eraser' && (
              <path d={`M ${currentStroke.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="none" stroke={globalColor} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
            )}
          </g>
        </svg>
      </div>
      <p className="absolute bottom-8 text-slate-500 text-sm">Rysujesz w obszarze 200x200 pikseli. Ten wzór będzie się powtarzał.</p>
    </div>
  );
}
