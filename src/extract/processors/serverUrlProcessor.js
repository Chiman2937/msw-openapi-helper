// src/extract/processors/serverUrlProcessor.js
import { colors } from '../../utils/colors.js';

export function processServerUrl(jsonObj, baseUrl) {
  if (jsonObj.servers && jsonObj.servers[0] && jsonObj.servers[0].url === '/') {
    jsonObj.servers[0].url = baseUrl;
    console.log(
      `${colors.green}✓${colors.reset} Server URL modified: ${colors.dim}/ → ${baseUrl}${colors.reset}`
    );
  }
}
