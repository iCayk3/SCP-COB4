import { readFileSync, unlinkSync } from 'node:fs';

const committed = readFileSync(new URL('../src/types/api.generated.ts', import.meta.url), 'utf8');
const generatedPath = new URL('../src/types/api.generated.check.ts', import.meta.url);
const generated = readFileSync(generatedPath, 'utf8');
unlinkSync(generatedPath);

if (committed !== generated) {
  console.error('O contrato TypeScript está desatualizado. Execute: npm run api:generate');
  process.exit(1);
}

console.log('Contrato TypeScript sincronizado com openapi/sgc-api.json.');
