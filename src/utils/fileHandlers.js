export const handlePatternUploadEvent = (e, updateSelectedShape) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    if (text.includes('<svg')) {
      const encoded = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(text)));
      updateSelectedShape({ customPatternSvg: encoded });
    } else alert("To nie jest poprawny plik SVG.");
  };
  reader.readAsText(file);
  e.target.value = null;
};

export const handleImageChangeEvent = (e, setBgImage, setShowRightPanel, svgRef) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const initScale = Math.min((svgRect.width * 0.8) / img.width, (svgRect.height * 0.8) / img.height);
    setBgImage({ url, width: img.width, height: img.height, x: svgRect.width / 2, y: svgRect.height / 2, scale: initScale, angle: 0, opacity: 0.7 });
    setShowRightPanel(true);
  };
  img.src = url;
  e.target.value = null;
};

export const handleFileChangeEvent = (e, commitShapes, shapes) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const doc = new DOMParser().parseFromString(event.target.result, "image/svg+xml");
      const newShapes = [];
      doc.querySelectorAll('ellipse').forEach(el => {
        let angle = 0;
        const match = (el.getAttribute('transform') || '').match(/rotate\(([^ ]+) /);
        if (match) angle = parseFloat(match[1]);
        newShapes.push({ type: 'ellipse', cx: parseFloat(el.getAttribute('cx') || 0), cy: parseFloat(el.getAttribute('cy') || 0), rx: parseFloat(el.getAttribute('rx') || 0), ry: parseFloat(el.getAttribute('ry') || 0), angle, color: el.getAttribute('stroke') || '#000000', fillPattern: null });
      });
      doc.querySelectorAll('path').forEach(el => {
        newShapes.push({ type: 'bezierPath', d: el.getAttribute('d'), color: el.getAttribute('stroke') || '#000000', fillPattern: null });
      });
      if (newShapes.length > 0) commitShapes([...shapes, ...newShapes]);
    } catch (err) { alert("Błąd odczytu SVG."); }
  };
  reader.readAsText(file);
  e.target.value = null;
};
