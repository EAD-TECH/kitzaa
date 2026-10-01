import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, 'swagger.json'), 'utf-8')
);
