// src/extract/extractors/jsExtractor.js
import { colors } from '../../utils/colors.js';

export function extractFromJS(data) {
  const match = data.match(
    /"swaggerDoc":\s*(\{[\s\S]*?\})\s*,\s*"customOptions"/
  );

  if (!match) {
    throw new Error('Could not find swaggerDoc in JS file');
  }

  const swaggerDoc = match[1];
  const jsonObj = JSON.parse(swaggerDoc);
  console.log(
    `${colors.green}✓${colors.reset} Extracted swaggerDoc from JS file`
  );

  return jsonObj;
}
