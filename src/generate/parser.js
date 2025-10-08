// src/generate/parser.js
import { readFileSync } from 'fs';

export function extractMockFunctionNames(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = [];

  // getXxxMock 패턴만 찾기
  const regex = /export const (get\w+Mock)\s*=/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}
