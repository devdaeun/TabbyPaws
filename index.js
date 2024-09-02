import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import main from './routes/main.js';
import notice from './routes/notice.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'index')));

app.use('/', main);
app.use('/', notice);

app.listen(3000, () => console.log('Server started on port 3000'));
