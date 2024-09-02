import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import main from './routes/main.js';
import notice from './routes/notice.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'index/views'));

// URL 인코딩된 데이터 처리 (form 데이터)
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'index')));

app.use('/', main);
app.use('/', notice);

app.listen(3000, () => console.log('Server started on port 3000'));
