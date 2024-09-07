import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();

//faq 리스트
router.get('/faq', (req, res) => {
    const sql = 'SELECT * FROM faq';
    const isAuthenticated = req.session.user ? true : false;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        results.forEach(faq =>{
            faq.created_date = moment(faq.created_at).format('YYYY-MM-DD');
        })

        res.render('faq/faq', { 
            isAuthenticated,
            user: req.session.user, 
            faqs: results 
        });
    });
});

//faq 작성
router.get('/faq/form', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    res.render('faq/faq_form',{
        isAuthenticated,
        user: req.session.user
    })
});

//faq 등록
router.post('/faq/add',(req, res) => {
    const { user_id } = req.session.user;
    const { title, content } = req.body;
    const sql = 'insert into faq(user_id, title, content) values(?, ?, ?)';
    connection.query(sql, [user_id, title, content], (err,results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/faq');
    });
});

//faq 수정
router.post('/faq/update/:faq_id', (req,res) =>{
    const faqId = req.params.faq_id;
    const sql = 'update faq set title=?, content=? where faq_id =?';

    const { title, content } = req.body;

    connection.query(sql, [title,content,faqId], (err,results)=> {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/faq');
    });
});

//faq 삭제
router.post('/faq/delete/:faq_id', (req, res) => {
    const faqId = req.params.faq_id;
    const sql = 'DELETE FROM faq WHERE faq_id = ?';

    connection.query(sql, [faqId], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/faq'); // 삭제 후 공지 목록 페이지로 리다이렉션
    });
});

export default router;
