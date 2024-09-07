import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import session from 'express-session';
import main from './routes/main.js';
import notice from './routes/notice.js';
import login from './routes/login.js';
import faq from './routes/faq.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'index/views'));

app.use(session({
    secret: 'tabby-cretse-key', // 보안 키
    resave: false, // 세션이 변경되지 않아도 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
    cookie: { secure: false } // HTTPS를 사용하는 경우 true로 설정
}));

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
app.use('/', faq);

app.listen(3000, () => console.log('Server started on port 3000'));
