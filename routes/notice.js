import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();

const ITEMS_LINIT_PAGE = 10; //글 수가 10개이상이되면 페이징

router.get('/', (req, res) => {
    // 페이지값 있으면 가져오고 없으면 기본값 1입니다.
    const page = parseInt(req.query.page) || 1;
    // 페이징을 위한 쿼리 작성
    const offset = (page - 1) * ITEMS_LINIT_PAGE; 
    // 해당페이지의 10번째 항목부터 가져와야해서 10을 곱한다

    const countSql = 'SELECT COUNT(*) AS count FROM notice'; 
    //공지사항 테이블의 전체 공지 수를 센다

    connection.query(countSql, (err, countResults) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        
        // 전체 항목 수가 있으면 그 값을 items에 저장
        const totalItems = countResults[0].count; //항목수를 숫자로 가져옴
        
        // 전체 페이지 수
        const totalPages = Math.ceil(totalItems / ITEMS_LINIT_PAGE); //전체에서 10개로 나누깅

        // 데이터 가져오기 쿼리
        const sql = `SELECT * FROM notice LIMIT ${offset}, ${ITEMS_LINIT_PAGE}`;
        const isAuthenticated = req.session.user ? true : false;
        
        connection.query(sql, (err, results) => {
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }
            
            results.forEach(notice => {
                notice.created_at = moment(notice.created_at).format('YYYY-MM-DD');
            });

            // 페이지 관련 정보를 템플릿에 전달
            res.render('notice/notice', {
                isAuthenticated,
                user: req.session.user,
                notices: results,
                currentPage: page,
                totalPages: totalPages
            });
        });
    });
});

// 공지 등록 폼 페이지
router.get('/form',(req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    res.render('notice/notice_form',{
        isAuthenticated,
        user: req.session.user
    });
});

// 등록 폼 저장
router.post('/add', (req, res) => {
    const { user_id } = req.session.user;
    const { title, content } = req.body; //form으로 가져오는건 body를 통으로 가꼬와야함
    const sql = "insert into notice (user_id, title, content) values (?, ?, ?)";

    connection.query(sql, [user_id, title,content],(err,results)=> {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        res.redirect('/notice');
    });
});

// 공지 상세보기 페이지
router.get('/:notice_id', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
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
            res.render('notice/notice_detail', { 
                isAuthenticated,
                user: req.session.user, 
                notice: results[0] 
            });
        } else {
            res.status(404).send('공지사항을 찾을 수 없습니다.');
        }
    });
});

//공지 수정
router.post('/update/:notice_id', (req,res) =>{
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
router.post('/delete/:notice_id', (req, res) => {
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
