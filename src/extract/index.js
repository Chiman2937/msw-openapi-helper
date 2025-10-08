// src/extract/index.js
import { fetchData } from '../utils/fetcher.js';
import { extractFromJS } from './extractors/jsExtractor.js';
import { extractFromJSON } from './extractors/jsonExtractor.js';
import { processServerUrl } from './processors/serverUrlProcessor.js';
import { processPathPrefix } from './processors/pathPrefixProcessor.js';
import { writeFileSync } from 'fs';
import { colors } from '../utils/colors.js';

export async function extractOpenAPI(config) {
  const { type, url, baseUrl, removePathPrefix, outputFile } = config;

  // Validate
  if (!type || !['js', 'json'].includes(type)) {
    throw new Error(`Invalid type: '${type}'. Must be 'js' or 'json'`);
  }
  if (!url) throw new Error('URL is required');
  if (!baseUrl) throw new Error('Base URL is required');

  console.log(`${colors.cyan}🚀 Starting OpenAPI extraction...${colors.reset}`);
  console.log(
    `${colors.dim}  Source type: ${colors.reset}${type.toUpperCase()}`
  );
  console.log(`${colors.dim}  Swagger URL: ${colors.reset}${url}`);
  console.log(`${colors.dim}  Base URL: ${colors.reset}${baseUrl}`);
  console.log(
    `${colors.dim}  Path prefix to remove: ${colors.reset}${
      removePathPrefix || 'None'
    }`
  );
  console.log(`${colors.dim}  Output file: ${colors.reset}${outputFile}\n`);

  try {
    // Fetch data
    const data = await fetchData(url);

    // Extract JSON
    let jsonObj;
    if (type === 'js') {
      jsonObj = extractFromJS(data);
    } else {
      jsonObj = extractFromJSON(data);
    }

    // Process
    processServerUrl(jsonObj, baseUrl);
    if (removePathPrefix) {
      processPathPrefix(jsonObj, removePathPrefix);
    }

    // Save
    const prettyJson = JSON.stringify(jsonObj, null, 2);
    writeFileSync(outputFile, prettyJson);

    console.log(
      `\n${colors.green}✅ ${outputFile} has been generated successfully!${colors.reset}`
    );
    console.log(
      `${colors.magenta}📊 Total ${colors.bright}${
        Object.keys(jsonObj.paths || {}).length
      }${colors.reset}${colors.magenta} endpoints${colors.reset}\n`
    );
  } catch (error) {
    throw new Error(`Extraction failed: ${error.message}`);
  }
}
