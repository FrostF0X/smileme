import Potrace from './potrace.js';

export const traceImageMultipleLayers = (url, options, layersCount) => {
  if (!window.Potrace) window.Potrace = Potrace;
  return new Promise((resolve) => {
    Potrace.setParameter({
      turnpolicy: options.turnpolicy || "minority",
      turdsize: options.turdsize || 2,
      optcurve: options.optcurve !== false,
      alphamax: options.alphamax || 1,
      opttolerance: options.opttolerance || 0.2
    });

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      Potrace.loadImageFromUrl(canvas.toDataURL());

      let checkReadyCount = 0;
      const checkReady = setInterval(() => {
        checkReadyCount++;
        if (checkReadyCount > 2) {
          clearInterval(checkReady);
          startProcess();
        }
      }, 100);
    };
    img.src = url;

    const startProcess = () => {
      const shapes = [];
      const step = 255 / (layersCount + 1);

      let currentLayer = 0;

      const processNextLayer = () => {
        if (currentLayer >= layersCount) {
          resolve(shapes);
          return;
        }

        const threshold = Math.round(step * (currentLayer + 1));
        const colorVal = Math.round(255 - (step * (currentLayer + 1)));
        const hex = colorVal.toString(16).padStart(2, '0');
        const color = `#${hex}${hex}${hex}`;

        Potrace.setParameter({ threshold });

        Potrace.process(() => {
          const d = Potrace.getPath();
          if (d) {
             shapes.push({
               type: 'bezierPath',
               d: d,
               color: color,
               fillPattern: null
             });
          }
          currentLayer++;
          processNextLayer();
        });
      };

      processNextLayer();
    };
  });
};
