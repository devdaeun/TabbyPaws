import express from 'express';
import connection  from '../database.js';

const router = express.Router();

router.get('/notice', (req, res) => {
    const sql = 'SELECT * FROM notice';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.render('notice/notice', { notices: results });
    });
});

// 공지 등록 폼 페이지
router.get('/notice/form',(req, res) => {
    res.render('notice/notice_form');
});

// 등록 폼 저장
router.post('/notice/add', (req, res) => {
    const { title, content } = req.body; //form으로 가져오는건 body를 통으로 가꼬와야함
    const sql = "insert into notice (user_id, title, content, created_date) values (1, ?, ?,now())";

    connection.query(sql, [title,content],(err,results)=> {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/notice');
    });
});

// 공지 상세보기 페이지
router.get('/notice/:notice_id', (req, res) => {
    const noticeId = req.params.notice_id;
    const sql = 'SELECT * FROM notice WHERE notice_id = ?';

    connection.query(sql, [noticeId], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        // 상세보기 페이지 렌더링
        if (results.length > 0) {
            res.render('notice/notice_detail', { notice: results[0] });
        } else {
            res.status(404).send('공지사항을 찾을 수 없습니다.');
        }
    });
});

//공지 수정
router.post('/notice/update/:notice_id', (req,res) =>{
    const noticeId = req.params.notice_id;
    const sql = 'update notice set title=?, content=? where notice_id =?';

    const { title, content } = req.body;

    connection.query(sql, [title,content,noticeId], (err,results)=> {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/notice/' + noticeId);
    });
});

// 공지 삭제
router.post('/notice/delete/:notice_id', (req, res) => {
    const noticeId = req.params.notice_id;
    const sql = 'DELETE FROM notice WHERE notice_id = ?';

    connection.query(sql, [noticeId], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/notice'); // 삭제 후 공지 목록 페이지로 리다이렉션
    });
});

export default router;
