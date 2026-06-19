export { Transaction } from './Transaction';
export { computerTools } from './computerTools';
export { userTools } from './userTools';

import { computerTools } from './computerTools';
import { userTools } from './userTools';

// A unified collection of all tools for easy server setup
export const allTools = [...computerTools, ...userTools];

// Utility to execute a specific tool by name
export const executeTool = (toolName, args, currentShapes = []) => {
  const tool = allTools.find(t => t.name === toolName);
  if (!tool) {
    throw new Error(`Tool ${toolName} not found.`);
  }

  return tool.execute(args, currentShapes);
};
