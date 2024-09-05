import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();

//로그인 폼으로 이동
router.get("/login", (req, res)=>{
    res.render("login/login")
});

router.get("/join", (req, res)=>{
    res.render("login/join")
});

// 아이디 중복 체크
router.post("/check-id", (req, res) => {
    const { id } = req.body;

    if (!id || typeof id !== 'string') {
        console.log('유효하지 않은 아이디:', id);
        return res.status(400).json({ error: '유효하지 않은 아이디' });
    }

    const sql = 'SELECT COUNT(*) AS count FROM user WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: '서버 에러' });
        }
        const exists = results[0].count > 0;
        res.json({ exists });
    });
});

// 닉네임 중복 체크
router.post("/check-name", (req, res) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        console.log('유효하지 않은 닉네임:', name);
        return res.status(400).json({ error: '유효하지 않은 닉네임' });
    }

    const sql = 'SELECT COUNT(*) AS count FROM user WHERE name = ?';
    connection.query(sql, [name], (error, results) => {
        if (error) {
            return res.status(500).json({ error: '서버 에러' });
        }
        const exists = results[0].count > 0;
        res.json({ exists });
    });
});

export default router;