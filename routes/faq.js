import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();

const PAGE_LIMIT = 10;
//faq 리스트
router.get('/', (req, res) => {
    const page = req.query.page || 1;

    const startPage = (page -1) * PAGE_LIMIT;

    const Countsql = "select count(*) as count from faq"; //전체 수 가져오기

    connection.query(Countsql, (err,resultCount)=>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        const Allfaq = resultCount[0].count;

        const TotPages = Math.ceil(Allfaq / PAGE_LIMIT); //페이지 개수(반올림해서 넉넉하게)
        
        const sql = `SELECT * FROM faq LIMIT ${startPage}, ${PAGE_LIMIT}`;
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
                faqs: results,
                currentPage: page,
                totPages : TotPages 
            });
        });
    });

});

//faq 작성
router.get('/form', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    res.render('faq/faq_form',{
        isAuthenticated,
        user: req.session.user
    })
});

//faq 등록
router.post('/add',(req, res) => {
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
router.post('/update/:faq_id', (req,res) =>{
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
router.post('/delete/:faq_id', (req, res) => {
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
