with open('src/components/ToolbarLeft.jsx', 'r') as f:
    content = f.read()

content = content.replace("IconImage, IconHand }", "IconImage, IconHand, IconSparkles }")
content = content.replace(
    "export default function ToolbarLeft({ activeTool, setActiveTool, bgImage, setShowRightPanel, imageInputRef, setCanvasTransform }) {",
    "export default function ToolbarLeft({ activeTool, setActiveTool, bgImage, setShowRightPanel, imageInputRef, setCanvasTransform, setShowGeminiApp }) {"
)

with open('src/components/ToolbarLeft.jsx', 'w') as f:
    f.write(content)
