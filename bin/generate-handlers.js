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
    const configModule = await import(configUrl);
    const config = configModule.default;

    if (!config) {
      console.error('❌ Config file must export a default object');
      console.error('   Example: export default { endpointsDir: "...", outputFile: "..." }');
      process.exit(1);
    }

    if (!config.endpointsDir || !config.outputFile) {
      console.error('❌ Config must include "endpointsDir" and "outputFile"');
      console.error('   Current config:', config);
      process.exit(1);
    }

    await generateHandlers(config);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
