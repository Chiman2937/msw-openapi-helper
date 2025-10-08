#!/usr/bin/env node

import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { extractOpenAPI } from '../src/extract/index.js';
import { generateHandlers } from '../src/generate/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initConfigs() {
  const configDir = join(process.cwd(), 'config');

  const configs = [
    {
      example: 'openapi.config.example.js',
      target: 'openapi.config.js',
      name: 'OpenAPI config'
    },
    {
      example: 'handlers.config.example.js',
      target: 'handlers.config.js',
      name: 'Handlers config'
    }
  ];

  // Create config directory if not exists
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  for (const config of configs) {
    const examplePath = join(__dirname, '..', 'config', config.example);
    const targetPath = join(configDir, config.target);

    if (existsSync(targetPath)) {
      console.log(`⏭️  ${config.name} already exists, skipping...`);
      skipped++;
    } else {
      copyFileSync(examplePath, targetPath);
      console.log(`✅ Created config/${config.target}`);
      created++;
    }
  }

  console.log();
  if (created > 0) {
    console.log('🎉 Setup complete!');
    console.log('   Edit the config files and run:');
    console.log('   1. npx extract-openapi   - to extract OpenAPI spec');
    console.log('   2. npx generate-handlers - to generate MSW handlers');
  } else {
    console.log('ℹ️  All config files already exist.');
  }
}

async function runAll() {
  const openapiConfigPath = join(process.cwd(), 'config', 'openapi.config.js');
  const handlersConfigPath = join(process.cwd(), 'config', 'handlers.config.js');

  // Check config files exist
  if (!existsSync(openapiConfigPath) || !existsSync(handlersConfigPath)) {
    console.error('❌ Config files not found');
    console.error('   Run: npx msw-openapi-helper init');
    process.exit(1);
  }

  try {
    // 1. Extract OpenAPI
    const openapiConfig = (await import(openapiConfigPath)).default;
    await extractOpenAPI(openapiConfig);

    console.log();

    // 2. Generate Handlers
    const handlersConfig = (await import(handlersConfigPath)).default;
    await generateHandlers(handlersConfig);

    console.log('🎉 All tasks completed successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Handle commands
const command = process.argv[2];

if (command === 'init') {
  initConfigs();
} else if (!command) {
  runAll();
} else {
  console.log('Usage:');
  console.log('  npx msw-openapi-helper init  - Create config files');
  console.log('  npx msw-openapi-helper       - Run extract and generate');
}
