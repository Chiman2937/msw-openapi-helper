// bin/generate-handlers.js

import { generateHandlers } from '../src/generate/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const configPath = join(process.cwd(), 'config', 'handlers.config.js');

  if (!existsSync(configPath)) {
    console.error('❌ Config file not found: config/handlers.config.js');
    console.error('   Create one using: npx generate-handlers init');
    process.exit(1);
  }

  try {
    const config = (await import(configPath)).default;
    await generateHandlers(config);
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
    'handlers.config.example.js'
  );
  const targetPath = join(configDir, 'handlers.config.js');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  if (existsSync(targetPath)) {
    console.error('❌ Config file already exists: config/handlers.config.js');
    process.exit(1);
  }

  copyFileSync(examplePath, targetPath);
  console.log('✅ Created config/handlers.config.js');
  console.log(
    '   Edit this file with your project structure and run: npx generate-handlers'
  );
  process.exit(0);
}

main();
