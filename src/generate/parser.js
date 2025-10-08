// src/generate/parser.js
import { readFileSync } from 'fs';

export function extractMockFunctionNames(filePath, includeMethods) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = [];

  includeMethods.forEach((method) => {
    // "Mock" 로 끝나되 "ResponseMock"이 아닌 함수만 찾기
    const regex = new RegExp(
      `export const (${method}\\w+Mock)(?!Handler)\\s*=`,
      'g'
    );
    let match;

    while ((match = regex.exec(content)) !== null) {
      const functionName = match[1];
      // "ResponseMock"으로 끝나지 않는 것만 추가
      if (!functionName.includes('Response')) {
        matches.push(functionName);
      }
    }
  });

  return matches;
}
