import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();


router.get('/', (req, res) => {
    const htmlPath = path.resolve('index/view/index.html');
    res.sendFile(htmlPath);
});

export default router;
