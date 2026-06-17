import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

# Merge conflict in App.jsx: keep the zoom/pan logic and the new ref
content = re.sub(
    r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> origin/main',
    lambda m: m.group(1).replace('const imageInputRef = useRef(null);', 'const imageInputRef = useRef(null);\n  const shapeDragStartPos = useRef(null);') if 'shapeDragStartPos' in m.group(2) else (m.group(1).replace('setCanvasTransform={setCanvasTransform}', 'setCanvasTransform={setCanvasTransform} activeShape={selectedShapeIndex !== null ? shapes[selectedShapeIndex] : null} commitShapes={commitShapesFunctional} selectedShapeIndex={selectedShapeIndex}') if 'activeShape' in m.group(2) else m.group(1)),
    content,
    flags=re.DOTALL
)

# For App.jsx, let's just let python do a simple manual text replacement
with open('src/App.jsx', 'w') as f:
    f.write(content)

with open('src/components/ToolbarLeft.jsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> origin/main',
    lambda m: m.group(1).replace('imageInputRef, setCanvasTransform', 'imageInputRef, setCanvasTransform, activeShape, commitShapes, selectedShapeIndex') if 'IconArrangeFront' in m.group(2) else m.group(1),
    content,
    flags=re.DOTALL
)

with open('src/components/ToolbarLeft.jsx', 'w') as f:
    f.write(content)

with open('src/icons/icons.jsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> origin/main',
    lambda m: m.group(1) + '\n' + '\n'.join([line for line in m.group(2).split('\n') if line not in m.group(1)]),
    content,
    flags=re.DOTALL
)

with open('src/icons/icons.jsx', 'w') as f:
    f.write(content)
