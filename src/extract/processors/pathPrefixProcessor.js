// src/extract/processors/pathPrefixProcessor.js
import { colors } from '../../utils/colors.js';

export function processPathPrefix(jsonObj, removePathPrefix) {
  if (!jsonObj.paths) return;

  const newPaths = {};
  let removedCount = 0;

  Object.keys(jsonObj.paths).forEach((path) => {
    const newPath = path.replace(removePathPrefix, '');
    newPaths[newPath] = jsonObj.paths[path];

    if (path !== newPath) {
      removedCount++;
    }

    // Remove parameter
    const paramName = removePathPrefix.replace(/[{}\/]/g, '');
    Object.keys(newPaths[newPath]).forEach((method) => {
      const operation = newPaths[newPath][method];
      if (operation && operation.parameters) {
        operation.parameters = operation.parameters.filter(
          (p) => p.name !== paramName
        );
      }
    });
  });

  jsonObj.paths = newPaths;
  console.log(
    `${colors.green}✓${colors.reset} Path prefix removed: ${colors.bright}${removedCount}${colors.reset} paths modified`
  );
}
