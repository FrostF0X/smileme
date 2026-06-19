import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# We need to replace the return block of App.jsx.
# The original starts with:
#   return (
#     <div className="flex h-screen w-screen overflow-hidden bg-slate-200">
#       <input type="file" ...
# and ends at the last </div>\n  );

# The new structure:
# <div className="..."> (hidden inputs)
# <header ...> (TopAppBar + ToolbarTop functionality integrated) </header>
# <main ...>
#   <ToolbarLeft />
#   <Canvas />
#   <RightPanel />
# </main>
# <footer ...> </footer>

new_return_block = """  return (
    <>
      <input type="file" accept=".svg" ref={fileInputRef} onChange={(e) => handleFileChangeEvent(e, commitShapes, shapes)} className="hidden" />
      <input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => handleImageChangeEvent(e, setBgImage, setShowRightPanel, svgRef)} className="hidden" />
      <input type="file" accept=".svg" ref={patternInputRef} onChange={(e) => handlePatternUploadEvent(e, updateSelectedShape)} className="hidden" />

      {showGeminiApp && <GeminiApp onClose={() => setShowGeminiApp(false)} bgImage={bgImage} setBgImage={setBgImage} />}
      {showColorPopup && (
        <ColorPickerPopup
          activeColorPicker={activeColorPicker}
          globalColor={globalColor} setGlobalColor={setGlobalColor}
          globalFillColor={globalFillColor} setGlobalFillColor={setGlobalFillColor}
          globalFillPattern={globalFillPattern} setGlobalFillPattern={setGlobalFillPattern}
          globalPatternSettings={globalPatternSettings} setGlobalPatternSettings={setGlobalPatternSettings}
          activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          updateSelectedShape={updateSelectedShape}
          customPatterns={customPatterns}
          setIsPatternEditor={setIsPatternEditor}
          setShowColorPopup={setShowColorPopup}
        />
      )}

      {/* TopAppBar - Integrates TopToolbar features */}
      <ToolbarTop
        activeTool={activeTool} globalColor={globalColor} setGlobalColor={setGlobalColor} forceCloseShape={forceCloseShape} setForceCloseShape={setForceCloseShape}
        smoothAmount={smoothAmount} setSmoothAmount={setSmoothAmount} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
        updateSelectedShape={updateSelectedShape} setShowRightPanel={setShowRightPanel}
        undo={undo} redo={redo} canUndo={historyObj.canUndo()} canRedo={historyObj.canRedo()}
        handleClear={() => { if (window.confirm("Wyczyścić wektory?")) commitShapes([]); }} fileInputRef={fileInputRef}
        exportSVG={() => exportCleanSVG(shapes, svgRef)} shapesCount={shapes.length}
      />

      <main className="absolute inset-0 pt-[56px] pb-[32px] flex overflow-hidden">
        {/* Left SideNavBar */}
        <ToolbarLeft
          activeTool={activeTool} setActiveTool={setActiveTool} bgImage={bgImage} setShowRightPanel={setShowRightPanel} imageInputRef={imageInputRef} setCanvasTransform={setCanvasTransform} setShowGeminiApp={setShowGeminiApp}
          globalColor={globalColor} globalFillColor={globalFillColor} globalFillPattern={globalFillPattern}
          activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          showColorPopup={showColorPopup} setShowColorPopup={setShowColorPopup}
          activeColorPicker={activeColorPicker} setActiveColorPicker={setActiveColorPicker}
        />

        {/* Central Canvas Area */}
        <div className="flex-1 ml-[56px] mr-[280px] h-full relative overflow-auto bg-[#050505] flex items-center justify-center p-8 custom-scrollbar">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
          <Canvas
            svgRef={svgRef} mainGroupRef={mainGroupRef} canvasTransform={canvasTransform} shapes={shapes} currentStroke={currentStroke} bgImage={bgImage} isDrawing={isDrawing} activeTool={activeTool} globalColor={globalColor}
            handlePointerDown={handleCanvasPointerDown} handlePointerMove={handleCanvasPointerMove} handlePointerUp={handleCanvasPointerUp}
            selectedShapeIndices={selectedShapeIndices} handleShapeInteraction={handleShapeInteraction}
          />
        </div>

        {/* Right SideNavBar (Inspector) */}
        <RightPanel
          showRightPanel={showRightPanel} setShowRightPanel={setShowRightPanel} rightPanelTab={rightPanelTab} setRightPanelTab={setRightPanelTab} bgImage={bgImage} setBgImage={setBgImage}
          activeTool={activeTool} activeShape={selectedShapeIndices.length > 0 ? shapes[selectedShapeIndices[0]] : null}
          updateSelectedShape={updateSelectedShape} patternInputRef={patternInputRef} svgRef={svgRef}
          traceConfig={traceConfig} setTraceConfig={setTraceConfig} handleTrace={handleTrace} isTracing={isTracing}
          transformTarget={transformTarget} setTransformTarget={setTransformTarget} customPatterns={customPatterns} setIsPatternEditor={setIsPatternEditor}
        />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 bg-[#111]/90 backdrop-blur-md border-t border-[#00FFFF]/20 h-8 shadow-[0_-2px_10px_rgba(0,255,255,0.05)]">
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm cursor-default">
          <span className="hover:text-[#FC0FC0] transition-colors">Zoom {Math.round((canvasTransform.scale || 1) * 100)}%</span>
          <span className="w-px h-3 bg-white/10"></span>
          <span className="hover:text-[#FC0FC0] transition-colors">Artboard 1</span>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm cursor-default">
          <span className="hover:text-[#00FFFF] transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#00FFFF] shadow-[0_0_5px_rgba(0,255,255,0.8)]"></span>
            GPU Preview
          </span>
          <span className="w-px h-3 bg-white/10"></span>
          <span className="hover:text-[#FFD700] transition-colors">AetherDesign Pro v2024</span>
        </div>
      </footer>
    </>
  );
}"""

# Find return ( ... ); block
start_idx = content.find("  return (\n    <div className=\"flex h-screen w-screen overflow-hidden bg-slate-200\">")
if start_idx == -1:
    print("Could not find start index")
    exit(1)

# Just replace from start_idx to end
new_content = content[:start_idx] + new_return_block + "\n"

with open('src/App.jsx', 'w') as f:
    f.write(new_content)

print("Updated App.jsx layout successfully.")
