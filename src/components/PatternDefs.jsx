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
