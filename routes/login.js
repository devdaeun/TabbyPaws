import express from 'express';
import connection  from '../database.js';

const router = express.Router();


//로그인 폼으로 이동
router.get("/login", (req, res)=>{
    res.render("login/login")
});

//로그인 진행
router.post("/login/enter", (req, res)=>{
    const {id, password} = req.body;
    const sql = "select * from user where id=? and password=?";

    connection.query(sql, [id, password], (err, results) =>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        
        if (results.length > 0) {
            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = { user_id: results[0].user_id, name:results[0].name, role: results[0].role };

            // 세션 저장 후 리다이렉트
            req.session.save((err) => {
                if (err) {
                    console.error('세션 저장 오류: ' + err.stack);
                    res.status(500).send('서버 오류');
                    return;
                }
                res.redirect('/'); // 로그인 성공 후 홈 페이지로 리다이렉트
            });
        } else {
            res.status(401).send('로그인 실패'); // 로그인 실패 시 에러 메시지
        }
    });
});

//로그아웃
router.get('/logout', (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        // 세션 삭제 후 홈 페이지로 리다이렉트
        res.redirect('/');
    });
});

//회원가입 폼으로 이동
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