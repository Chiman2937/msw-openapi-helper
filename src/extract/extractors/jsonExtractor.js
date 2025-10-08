// src/extract/extractors/jsonExtractor.js
import { colors } from '../../utils/colors.js';

export function extractFromJSON(data) {
  const jsonObj = JSON.parse(data);
  console.log(`${colors.green}✓${colors.reset} Parsed JSON response`);
  return jsonObj;
}
