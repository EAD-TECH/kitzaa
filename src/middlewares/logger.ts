'use strict';

import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customLog =
  'TIME=":date[clf]" - URL=":url" - Method=":method" - IP=":remote-addr" - Ref=":referrer" - Status=":status" - Sing=":user-agent" - (:response-time[digits] ms)';

// v3

const accessLogStream = createStream('access.log', {
  interval: '1d', // rotate daily // 1m // 1w // 1m
  path: path.join(__dirname, '../../logs'),
});

export default morgan(customLog, { stream: accessLogStream });
