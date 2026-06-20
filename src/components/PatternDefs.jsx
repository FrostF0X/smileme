import React from 'react';
import { getPatternDetails } from '../utils/svgExport';

export default function PatternDefs({ shapes }) {
  return (
    <defs>
      {shapes.map((s, i) => {
        if (!s.fillPattern) return null;
        const { sp, S, W, pWidth, pHeight, layout } = getPatternDetails(s);

        const renderContent = (x, y) => {
          if (s.fillPattern === 'custom' && s.customPatternSvg) {
            return <image x={x} y={y} width={S} height={S} href={s.customPatternSvg} preserveAspectRatio="xMidYMid meet" />;
          } else if (s.fillPattern === 'dots') {
            return <circle cx={x + S / 2} cy={y + S / 2} r={S * 0.2} fill={s.color} />;
          } else if (s.fillPattern === 'grid') {
            return <path d={`M ${x + S} ${y} L ${x} ${y} L ${x} ${y + S}`} fill="none" stroke={s.color} strokeWidth={Math.max(1, S * 0.05)} />;
          } else if (s.fillPattern === 'lines') {
            return <line x1={x} y1={y + S} x2={x + S} y2={y} stroke={s.color} strokeWidth={Math.max(2, S * 0.1)} strokeLinecap="square" />;
          }
          return null;
        };

        return (
          <pattern key={`pat-${i}`} id={`pat-${i}`} width={pWidth} height={pHeight} patternUnits="userSpaceOnUse">
            {renderContent(sp / 2, sp / 2)}
            {(layout === 'offset' || layout === 'hex') && (
              <>
                {renderContent(sp / 2 + W / 2, sp / 2 + (layout === 'hex' ? W * 0.866 : W))}
                {renderContent(sp / 2 - W / 2, sp / 2 + (layout === 'hex' ? W * 0.866 : W))}
              </>
            )}
          </pattern>
        );
      })}
    </defs>
  );
}
