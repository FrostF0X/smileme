import Ellipse from '../models/Ellipse';
import Path from '../models/Path';

export const computerTools = [
  {
    name: "createEllipse",
    description: "Create an ellipse shape with specific coordinates and color.",
    inputSchema: {
      type: "object",
      properties: {
        cx: { type: "number", description: "Center X coordinate" },
        cy: { type: "number", description: "Center Y coordinate" },
        rx: { type: "number", description: "X radius" },
        ry: { type: "number", description: "Y radius" },
        color: { type: "string", description: "Stroke color" },
        fillColor: { type: "string", description: "Fill color (optional)" },
        fillPattern: { type: "string", description: "Fill pattern (optional)" }
      },
      required: ["cx", "cy", "rx", "ry", "color"]
    },
    execute: (args, currentShapes = []) => {
      const { cx, cy, rx, ry, color, fillColor, fillPattern } = args;
      const newShape = new Ellipse({ cx, cy, rx, ry, color, fillColor, fillPattern });
      return [...currentShapes, newShape];
    }
  },
  {
    name: "createPath",
    description: "Create a path shape with an SVG path string and color.",
    inputSchema: {
      type: "object",
      properties: {
        d: { type: "string", description: "SVG path data string" },
        color: { type: "string", description: "Stroke color" },
        fillColor: { type: "string", description: "Fill color (optional)" },
        fillPattern: { type: "string", description: "Fill pattern (optional)" }
      },
      required: ["d", "color"]
    },
    execute: (args, currentShapes = []) => {
      const { d, color, fillColor, fillPattern } = args;
      const newShape = new Path({ type: 'bezierPath', d, color, fillColor, fillPattern });
      return [...currentShapes, newShape];
    }
  },
  {
    name: "eraseShape",
    description: "Erase a shape by its index.",
    inputSchema: {
      type: "object",
      properties: {
        index: { type: "number", description: "Index of the shape to erase" }
      },
      required: ["index"]
    },
    execute: (args, currentShapes = []) => {
      const { index } = args;
      if (index >= 0 && index < currentShapes.length) {
        return currentShapes.filter((_, i) => i !== index);
      }
      return currentShapes;
    }
  },
  {
    name: "updateShapeColor",
    description: "Update the color of a specific shape.",
    inputSchema: {
      type: "object",
      properties: {
        index: { type: "number", description: "Index of the shape to update" },
        color: { type: "string", description: "New stroke color" },
        fillColor: { type: "string", description: "New fill color (optional)" }
      },
      required: ["index", "color"]
    },
    execute: (args, currentShapes = []) => {
      const { index, color, fillColor } = args;
      if (index >= 0 && index < currentShapes.length) {
        const newShapes = [...currentShapes];
        const shape = newShapes[index];
        const newShapeProps = { ...shape, color };
        if (fillColor !== undefined) newShapeProps.fillColor = fillColor;

        // Clone the shape appropriately
        if (shape.type === 'ellipse') {
          newShapes[index] = new Ellipse(newShapeProps);
        } else {
          newShapes[index] = new Path(newShapeProps);
        }
        return newShapes;
      }
      return currentShapes;
    }
  },
  {
    name: "moveShape",
    description: "Move a shape by dx and dy.",
    inputSchema: {
      type: "object",
      properties: {
        index: { type: "number", description: "Index of the shape to move" },
        dx: { type: "number", description: "Delta X" },
        dy: { type: "number", description: "Delta Y" }
      },
      required: ["index", "dx", "dy"]
    },
    execute: (args, currentShapes = []) => {
       const { index, dx, dy } = args;
       if (index >= 0 && index < currentShapes.length) {
         const newShapes = [...currentShapes];
         const shape = newShapes[index];

         if (shape.type === 'ellipse') {
           newShapes[index] = new Ellipse({ ...shape, cx: shape.cx + dx, cy: shape.cy + dy });
         } else if (shape.type === 'rawPath') {
           const newPoints = shape.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
           newShapes[index] = new Path({ ...shape, points: newPoints });
         } else if (shape.type === 'bezierPath' && shape.d) {
             console.warn("moveShape for bezierPath requires modifying the d string or using transforms. Not fully supported in primitive tool.");
         }
         return newShapes;
       }
       return currentShapes;
    }
  },
  {
    name: "clearCanvas",
    description: "Clear all shapes from the canvas.",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    execute: () => {
      return [];
    }
  }
];