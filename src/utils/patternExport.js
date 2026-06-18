export const exportPatternToSVG = (shapes) => {
  let shapesHtml = '';
  shapes.forEach((s) => {
    if (s.type === 'ellipse') {
      shapesHtml += `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="none" stroke="${s.color}" stroke-width="4" transform="rotate(${s.angle} ${s.cx} ${s.cy})" stroke-linecap="round" stroke-linejoin="round" />`;
    } else if (s.type === 'bezierPath' || s.type === 'rawPath') {
      const d = s.d || `M ${s.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
      shapesHtml += `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />`;
    }
  });
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">${shapesHtml}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};
