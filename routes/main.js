import express from 'express';

const router = express.Router();


router.get('/', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    res.render('index', { 
        isAuthenticated,
        user: req.session.user // 세션 정보를 템플릿에 전달
    });
});

export default router;
