// src/generate/parser.js
import { readFileSync } from 'fs';

export function extractMockFunctionNames(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = [];

  // getXxxMock 패턴만 찾기
  const regex = /export const (get\w+Mock)\s*=/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const functionName = match[1];

    // "ResponseMock"은 제외
    if (!functionName.includes('Response')) {
      matches.push(functionName);
    }
  }

  return matches;
}
