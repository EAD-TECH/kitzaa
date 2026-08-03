import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import { swaggerDocument } from '../configs/swagger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// glob (swagger-jsdoc'un apis desenlerini eslestirmek icin kullandigi paket)
// Windows'ta path.join'in urettigi ters slash'i (\) escape karakteri sayar ve
// hicbir dosyayi eslestiremez; glob desenleri her zaman "/" beklerdir.
const toGlobPath = (...segments: string[]) => join(...segments).split(path.sep).join('/');

// swagger.json'daki info/host/basePath/securityDefinitions temel alinir,
// paths + definitions ise schemas/ ve paths/ altindaki @swagger JSDoc bloklarindan
// swagger-jsdoc tarafindan taranip birlestirilir.
// {ts,js} glob'u hem `npm run dev` (tsx, .ts okur) hem `npm run build` (dist/, .js okur) icin gecerli.
const options: swaggerJsdoc.Options = {
  definition: swaggerDocument,
  apis: [
    toGlobPath(__dirname, 'schemas', '*.{ts,js}'),
    toGlobPath(__dirname, 'paths', '*.{ts,js}'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
