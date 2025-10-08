#!/usr/bin/env node

import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initConfigs() {
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

  let created = 0;
  let skipped = 0;

  for (const config of configs) {
    const examplePath = join(__dirname, '..', 'config', config.example);
    const targetPath = join(process.cwd(), config.target);

    if (existsSync(targetPath)) {
      console.log(`⏭️  ${config.name} already exists, skipping...`);
      skipped++;
    } else {
      copyFileSync(examplePath, targetPath);
      console.log(`✅ Created ${config.target}`);
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

// Handle commands
const command = process.argv[2];

if (command === 'init') {
  initConfigs();
} else {
  console.log('Usage:');
  console.log('  npx msw-openapi-helper init  - Create config files');
}
