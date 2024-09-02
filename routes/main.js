import express from 'express';
import path from 'path';

const router = express.Router();


router.get('/', (req, res) => {
    const htmlPath = path.resolve('index/views/index.html');
    res.sendFile(htmlPath);
});

export default router;
