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
      name: 'OpenAPI config',
      type: 'config',
    },
    {
      example: 'handlers.config.example.js',
      target: 'handlers.config.js',
      name: 'Handlers config',
      type: 'config',
    },
  ];

  const mswFiles = [
    {
      template: 'browser.ts',
      target: 'src/mock/browser.ts',
      name: 'MSW browser setup',
    },
    {
      template: 'server.ts',
      target: 'src/mock/server.ts',
      name: 'MSW server setup',
    },
    {
      template: 'handlers.ts',
      target: 'src/mock/handlers.ts',
      name: 'MSW handlers',
    },
    {
      template: 'MSWProvider.tsx',
      target: 'src/providers/MSWProvider.tsx',
      name: 'MSW Provider',
    },
  ];

  let created = 0;
  let skipped = 0;

  // Create config files
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

  // Create MSW files
  const mswDir = join(process.cwd(), 'src', 'mock');
  if (!existsSync(mswDir)) {
    mkdirSync(mswDir, { recursive: true });
  }

  for (const file of mswFiles) {
    const templatePath = join(__dirname, '..', 'templates', file.template);
    const targetPath = join(process.cwd(), file.target);

    if (existsSync(targetPath)) {
      console.log(`⏭️  ${file.name} already exists, skipping...`);
      skipped++;
    } else {
      copyFileSync(templatePath, targetPath);
      console.log(`✅ Created ${file.target}`);
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
