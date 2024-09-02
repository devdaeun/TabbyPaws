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

export default router;
