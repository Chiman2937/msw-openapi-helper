import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export function scanMswFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    items.forEach((item) => {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.msw.ts')) {
        files.push(fullPath);
      }
    });
  }

  traverse(dir);
  return files;
}
