import React from 'react';
import { getPatternDetails } from '../utils/svgExport';

export default function ShapeRenderer({ shape, index, isSelected, activeTool, handleShapeClick }) {
  const shapeProps = {
    fill: shape.fillPattern ? `url(#pat-${index})` : "none",
    stroke: shape.color, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round",
    onPointerDown: (e) => handleShapeClick(e, index),
    style: { pointerEvents: (activeTool === 'eraser' || activeTool === 'select') ? 'all' : 'none' },
    className: isSelected ? "opacity-80" : ""
  };

  let selectionOutline = null;
  if (isSelected) {
    const outlineProps = { ...shapeProps, stroke: "#0ea5e9", strokeWidth: 8, strokeDasharray: "10,10", fill: "none", opacity: 0.5, style: { pointerEvents: 'none' } };
    if (shape.type === 'ellipse') selectionOutline = <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`} {...outlineProps} />;
    else selectionOutline = <path d={shape.d || `M ${shape.points.map(p => `${p.x},${p.y}`).join(' L ')}`} {...outlineProps} />;
  }

  let renderedShape;
  if (shape.type === 'ellipse') renderedShape = <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`} {...shapeProps} />;
  else renderedShape = <path d={shape.d || `M ${shape.points.map(p => `${p.x},${p.y}`).join(' L ')}`} {...shapeProps} />;

  return <g key={`g-${index}`}>{renderedShape}{selectionOutline}</g>;
}
