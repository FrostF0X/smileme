export const getPatternDetails = (s) => {
  const sc = s.patternScale || 1;
  const sp = s.patternSpacing || 0;
  const S = 30 * sc; // Bazowy rozmiar obrazka
  const W = S + sp; // Szerokość jednego "segmentu" z odstępem
  let pWidth = W, pHeight = W;
  const layout = s.patternLayout || 'grid';
  if (layout === 'offset') pHeight = 2 * W;
  if (layout === 'hex') pHeight = 2 * (W * 0.866);
  return { sc, sp, S, W, pWidth, pHeight, layout };
};

export const exportCleanSVG = async (shapes, svgRef) => {
  if (!svgRef.current) return;
  const rect = svgRef.current.getBoundingClientRect();

  let defsHtml = '<defs>';
  shapes.forEach((s, i) => {
    if (s.fillPattern) {
      const { sp, S, W, pWidth, pHeight, layout } = getPatternDetails(s);
      defsHtml += `<pattern id="exp-pat-${i}" width="${pWidth}" height="${pHeight}" patternUnits="userSpaceOnUse">`;

      const getContent = (x, y) => {
        if (s.fillPattern === 'custom' && s.customPatternSvg) {
          return `<image x="${x}" y="${y}" width="${S}" height="${S}" href="${s.customPatternSvg}" preserveAspectRatio="xMidYMid meet" />`;
        } else if (s.fillPattern === 'dots') {
          return `<circle cx="${x + S / 2}" cy="${y + S / 2}" r="${S * 0.2}" fill="${s.color}" />`;
        } else if (s.fillPattern === 'grid') {
          return `<path d="M ${x + S} ${y} L ${x} ${y} L ${x} ${y + S}" fill="none" stroke="${s.color}" stroke-width="${Math.max(1, S * 0.05)}"/>`;
        } else if (s.fillPattern === 'lines') {
          return `<line x1="${x}" y1="${y + S}" x2="${x + S}" y2="${y}" stroke="${s.color}" stroke-width="${Math.max(2, S * 0.1)}" stroke-linecap="square"/>`;
        }
        return '';
      };

      defsHtml += getContent(sp / 2, sp / 2);
      if (layout === 'offset' || layout === 'hex') {
        const yOff = layout === 'hex' ? W * 0.866 : W;
        defsHtml += getContent(sp / 2 + W / 2, sp / 2 + yOff);
        defsHtml += getContent(sp / 2 - W / 2, sp / 2 + yOff); // Dla poprawnego zawijania na brzegach
      }
      defsHtml += `</pattern>`;
    }
  });
  defsHtml += '</defs>';

  let shapesHtml = '';
  shapes.forEach((s, i) => {
    const fillStr = s.fillPattern ? `url(#exp-pat-${i})` : 'none';
    if (s.type === 'ellipse') {
      shapesHtml += `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="${fillStr}" stroke="${s.color}" stroke-width="4" transform="rotate(${s.angle} ${s.cx} ${s.cy})" stroke-linecap="round" stroke-linejoin="round" />`;
    } else if (s.type === 'bezierPath' || s.type === 'rawPath') {
      const d = s.d || `M ${s.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
      shapesHtml += `<path d="${d}" fill="${fillStr}" stroke="${s.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />`;
    }
  });

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rect.width} ${rect.height}" width="${rect.width}" height="${rect.height}">${defsHtml}${shapesHtml}</svg>`;

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'Rysunek_Pro.svg',
        types: [{ description: 'Plik SVG', accept: { 'image/svg+xml': ['.svg'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(svgString);
      await writable.close();
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Rysunek_Pro.svg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
