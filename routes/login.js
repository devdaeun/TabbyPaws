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

//회원가입 진행
router.post("/join/member", (req, res)=>{
    const {id, name, password, email} = req.body;
    const sql = "insert into user(id,name,password,email) values(?, ?, ?, ?)";

    connection.query(sql, [id,name,password,email], (err,results)=> {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        
        res.redirect('/login');
    });
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

// 이메일 중복 체크
router.post("/check-email", (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        console.log('유효하지 않은 닉네임:', email);
        return res.status(400).json({ error: '유효하지 않은 닉네임' });
    }

    const sql = 'SELECT COUNT(*) AS count FROM user WHERE email = ?';
    connection.query(sql, [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error: '서버 에러' });
        }
        const exists = results[0].count > 0;
        res.json({ exists });
    });
});

export default router;