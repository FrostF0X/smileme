import React from 'react';
import { getPatternDetails } from '../utils/svgExport';
import { getShapeBounds } from '../utils/shapeProcessor';

export default function ShapeRenderer({ shape, index, isSelected, activeTool, handleShapeInteraction }) {
  const shapeProps = {
    fill: shape.fillPattern ? `url(#pat-${index})` : "none",
    stroke: shape.color, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round",
    onPointerDown: (e) => handleShapeInteraction(e, shape, index, 'move'),
    onPointerEnter: (e) => handleShapeInteraction(e, shape, index, 'move'),
    style: { pointerEvents: (activeTool === 'eraser' || activeTool === 'select') ? 'all' : 'none', cursor: (isSelected && activeTool === 'select') ? 'move' : 'inherit' },
    className: isSelected ? "opacity-80" : ""
  };

  let selectionOutline = null;
  let rotationHandle = null;

  if (isSelected) {
    const outlineProps = { ...shapeProps, stroke: "#0ea5e9", strokeWidth: 8, strokeDasharray: "10,10", fill: "none", opacity: 0.5, style: { pointerEvents: 'none' } };
    if (shape.type === 'ellipse') selectionOutline = <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`} {...outlineProps} />;
    else selectionOutline = <path d={shape.d || `M ${shape.points.map(p => `${p.x},${p.y}`).join(' L ')}`} {...outlineProps} />;

    if (activeTool === 'select') {
      const bounds = getShapeBounds(shape);
      const handleY = bounds.cy - bounds.ry - 30; // Place handle above the shape
      rotationHandle = (
        <g transform={`translate(${bounds.cx}, ${handleY})`}>
          <line x1="0" y1="0" x2="0" y2="30" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4,4" />
          <circle cx="0" cy="0" r="15" fill="white" stroke="#0ea5e9" strokeWidth="3"
                  style={{ pointerEvents: 'all', cursor: 'grab' }}
                  onPointerDown={(e) => { e.stopPropagation(); handleShapeInteraction(e, shape, index, 'rotateScale'); }} />
          <path d="M-5 -2 A7 7 0 1 1 5 -2 M-6 -4 L-5 -2 L-3 -4 M4 -4 L5 -2 L6 -4" fill="none" stroke="#0ea5e9" strokeWidth="1.5" style={{ pointerEvents: 'none' }} />
        </g>
      );
    }
  }

  let renderedShape;
  if (shape.type === 'ellipse') renderedShape = <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`} {...shapeProps} />;
  else renderedShape = <path d={shape.d || `M ${shape.points.map(p => `${p.x},${p.y}`).join(' L ')}`} {...shapeProps} />;

  const bounds = getShapeBounds(shape);
  const cx = bounds.cx;
  const cy = bounds.cy;

  const transform = `translate(${shape.x || 0}, ${shape.y || 0}) rotate(${shape.rotation || 0} ${cx} ${cy}) translate(${cx}, ${cy}) scale(${shape.scaleX !== undefined ? shape.scaleX : 1}, ${shape.scaleY !== undefined ? shape.scaleY : 1}) translate(${-cx}, ${-cy})`;

  return <g key={`g-${index}`} data-shape-index={index} transform={transform}>{renderedShape}{selectionOutline}{rotationHandle}</g>;
}
