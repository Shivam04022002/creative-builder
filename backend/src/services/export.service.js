export const generateHTML = (creative) => {
  const layersHTML = creative.layers.map(layer => {
    const animationStyle = layer.animation && layer.animation !== 'none'
      ? `animation: ${layer.animation} 0.5s ease-out forwards;`
      : ''

    const baseStyle = `
      position: absolute;
      left: ${layer.x}px;
      top: ${layer.y}px;
      width: ${layer.width}px;
      height: ${layer.height}px;
      z-index: ${layer.zIndex};
      background-color: ${layer.styles?.backgroundColor || 'transparent'};
      opacity: ${layer.styles?.opacity ?? 1};
      display: flex;
      align-items: center;
      justify-content: ${layer.type === 'text' ? layer.styles?.textAlign || 'left' : 'center'};
      ${animationStyle}
    `

    if (layer.type === 'text') {
      const textStyle = `
        color: ${layer.styles?.color || '#000000'};
        font-size: ${layer.styles?.fontSize || 16}px;
        font-weight: ${layer.styles?.fontWeight || 'normal'};
      `
      return `<div style="${baseStyle}"><span style="${textStyle}">${layer.text || ''}</span></div>`
    } else if (layer.imageUrl) {
      return `<div style="${baseStyle}"><img src="${layer.imageUrl}" style="width:100%;height:100%;object-fit:contain;" /></div>`
    } else {
      return `<div style="${baseStyle}"><div style="color:#9ca3af;font-size:12px;text-align:center;">Image</div></div>`
    }
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${creative.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1f2937; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .canvas { background: white; position: relative; overflow: hidden; width: ${creative.canvas.width}px; height: ${creative.canvas.height}px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
  </style>
</head>
<body>
  <div class="canvas">
    ${layersHTML}
  </div>
</body>
</html>`
}
