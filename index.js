import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// ES 모듈에서 __filename과 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    const htmlPath = path.resolve(__dirname, './view/index.html');
    res.sendFile(htmlPath);
});


// 포트번호 , 실행되면 콜백할 내용
app.listen(3000, () => console.log('server started'));