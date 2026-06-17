with open('src/hooks/useDrawing.js', 'r') as f:
    content = f.read()

content = content.replace(
    "if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);",
    "if (svgRef.current && activeTool !== 'eraser') svgRef.current.setPointerCapture(e.pointerId);"
)

with open('src/hooks/useDrawing.js', 'w') as f:
    f.write(content)
