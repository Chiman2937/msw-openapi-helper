#!/usr/bin/env node

import { generateHandlers } from '../src/generate/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const configPath = join(process.cwd(), 'handlers.config.js');

  if (!existsSync(configPath)) {
    console.error('❌ Config file not found: handlers.config.js');
    console.error('   Create one using: npx msw-openapi-helper init');
    process.exit(1);
  }

  try {
    const configUrl = pathToFileURL(configPath).href;
    const config = (await import(configUrl)).default;
    await generateHandlers(config);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
