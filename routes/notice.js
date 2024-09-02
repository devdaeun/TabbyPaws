import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();


router.get('/notice', (req, res) => {
    const noticePath = path.resolve('index/view/notice/notice.html');
    res.sendFile(noticePath);
});

export default router;
