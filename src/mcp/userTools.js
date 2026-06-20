import { processSnapper, processBezierSmoother, processDrawer } from '../utils/shapeProcessor';

export const userTools = [
  {
    name: "drawSmoothedPath",
    description: "Draw a smoothed bezier path from an array of raw points.",
    inputSchema: {
      type: "object",
      properties: {
        points: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            },
            required: ["x", "y"]
          },
          description: "Array of raw pointer coordinates."
        },
        color: { type: "string", description: "Stroke color" },
        strokeWidth: { type: "number", description: "Stroke width" },
        amount: { type: "number", description: "Smoothing amount" },
        forceClosed: { type: "boolean", description: "Force the path to close" },
        fillColor: { type: "string", description: "Fill color (optional)" },
        fillPattern: { type: "string", description: "Fill pattern (optional)" },
        patSettings: { type: "object", description: "Pattern settings (optional)" }
      },
      required: ["points", "color", "amount", "forceClosed"]
    },
    execute: (args, currentShapes = []) => {
      const { points, color, strokeWidth, amount, forceClosed, fillColor, fillPattern, patSettings } = args;
      const newShape = processBezierSmoother(points, color, strokeWidth, amount, forceClosed, fillColor, fillPattern, patSettings);
      return [...currentShapes, newShape];
    }
  },
  {
    name: "drawRawPath",
    description: "Draw a raw path from an array of raw points.",
    inputSchema: {
      type: "object",
      properties: {
        points: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            },
            required: ["x", "y"]
          },
          description: "Array of raw pointer coordinates."
        },
        color: { type: "string", description: "Stroke color" },
        strokeWidth: { type: "number", description: "Stroke width" },
        amount: { type: "number", description: "Smoothing amount for drawer" },
        forceClosed: { type: "boolean", description: "Force the path to close" },
        fillColor: { type: "string", description: "Fill color (optional)" },
        fillPattern: { type: "string", description: "Fill pattern (optional)" },
        patSettings: { type: "object", description: "Pattern settings (optional)" }
      },
      required: ["points", "color", "amount", "forceClosed"]
    },
    execute: (args, currentShapes = []) => {
      const { points, color, strokeWidth, amount, forceClosed, fillColor, fillPattern, patSettings } = args;
      const newShape = processDrawer(points, color, strokeWidth, amount, forceClosed, fillColor, fillPattern, patSettings);
      return [...currentShapes, newShape];
    }
  },
  {
    name: "drawSnappedShape",
    description: "Draw a path that snaps to an ellipse if appropriate, from raw points.",
    inputSchema: {
      type: "object",
      properties: {
        points: {
          type: "array",
          items: {
            type: "object",
            properties: {
              x: { type: "number" },
              y: { type: "number" }
            },
            required: ["x", "y"]
          },
          description: "Array of raw pointer coordinates."
        },
        color: { type: "string", description: "Stroke color" },
        strokeWidth: { type: "number", description: "Stroke width" },
        fillColor: { type: "string", description: "Fill color (optional)" },
        fillPattern: { type: "string", description: "Fill pattern (optional)" },
        patSettings: { type: "object", description: "Pattern settings (optional)" }
      },
      required: ["points", "color"]
    },
    execute: (args, currentShapes = []) => {
      const { points, color, strokeWidth, fillColor, fillPattern, patSettings } = args;
      const newShape = processSnapper(points, color, strokeWidth, fillColor, fillPattern, patSettings);
      return [...currentShapes, newShape];
    }
  }
];