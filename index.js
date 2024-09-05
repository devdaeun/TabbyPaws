import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import main from './routes/main.js';
import notice from './routes/notice.js';
import login from './routes/login.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'index/views'));

// CORS 설정
app.use(cors());

// URL 인코딩된 데이터 처리 (form 데이터)
app.use(express.urlencoded({ extended: true }));

// JSON 본문 파싱
app.use(express.json());

app.use(express.static(path.join(__dirname, 'index')));

app.use('/', main);
app.use('/', notice);
app.use('/', login);

app.listen(3000, () => console.log('Server started on port 3000'));
