with open('src/App.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const [transformTarget, setTransformTarget] = useState('canvas');",
    "const [transformTarget, setTransformTarget] = useState('canvas');\n  const [showGeminiApp, setShowGeminiApp] = useState(false);"
)

content = content.replace(
    "<ToolbarLeft activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} />",
    "<ToolbarLeft activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} setShowGeminiApp={setShowGeminiApp} />"
)

content = content.replace(
    "        </div>\n      </div>\n    </div>",
    "        </div>\n      </div>\n      {showGeminiApp && <GeminiApp onClose={() => setShowGeminiApp(false)} bgImage={bgImage} setBgImage={setBgImage} />}\n    </div>"
)

with open('src/App.jsx', 'w') as f:
    f.write(content)
