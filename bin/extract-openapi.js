#!/usr/bin/env node

import { extractOpenAPI } from '../src/extract/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const configPath = join(process.cwd(), 'config', 'openapi.config.js');

  if (!existsSync(configPath)) {
    console.error('❌ Config file not found: config/openapi.config.js');
    console.error('   Create one using: npx extract-openapi init');
    process.exit(1);
  }

  try {
    const configUrl = pathToFileURL(configPath).href;
    const config = (await import(configUrl)).default;
    await extractOpenAPI(config);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle init command
if (process.argv[2] === 'init') {
  const { copyFileSync, mkdirSync, existsSync } = await import('fs');
  const { join } = await import('path');

  const configDir = join(process.cwd(), 'config');
  const examplePath = join(
    __dirname,
    '..',
    'config',
    'openapi.config.example.js'
  );
  const targetPath = join(configDir, 'openapi.config.js');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  if (existsSync(targetPath)) {
    console.error('❌ Config file already exists: config/openapi.config.js');
    process.exit(1);
  }

  copyFileSync(examplePath, targetPath);
  console.log('✅ Created config/openapi.config.js');
  console.log(
    '   Edit this file with your API details and run: npx extract-openapi'
  );
  process.exit(0);
}

main();
