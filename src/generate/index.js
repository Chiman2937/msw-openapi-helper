import { colors } from '../utils/colors.js';
import { scanMswFiles } from './scanner.js';

export function generateHandlers(config) {
  const { endpointsDir, outputFile } = config; // includeMethods 제거

  console.log(`${colors.cyan}🔍 Scanning MSW files...${colors.reset}`);

  const mswFiles = scanMswFiles(endpointsDir);
  console.log(
    `${colors.dim}   Found ${colors.bright}${mswFiles.length}${colors.reset}${colors.dim} .msw.ts files${colors.reset}`
  );

  const mockFiles = mswFiles
    .map((file) => ({
      path: file,
      functionNames: extractMockFunctionNames(file), // includeMethods 제거
    }))
    .filter((file) => file.functionNames.length > 0);

  const result = generateHandlers(mockFiles, outputFile);

  console.log(
    `\n${colors.green}✅ Successfully generated handlers.ts${colors.reset}`
  );
  console.log(
    `   ${colors.blue}📁 ${mockFiles.length}${colors.reset} MSW files processed`
  );
  console.log(
    `   ${colors.magenta}🔧 ${result.totalHandlers}${colors.reset} total handlers exported`
  );
  console.log(`   ${colors.cyan}📄 Output:${colors.reset} ${outputFile}\n`);
}
