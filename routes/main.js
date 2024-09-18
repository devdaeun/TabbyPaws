import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();


router.get('/', (req, res) => {
    const sql = 'SELECT * FROM notice LIMIT 10';
    const isAuthenticated = req.session.user ? true : false;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        results.forEach(notice =>{
            notice.created_at = moment(notice.created_at).format('YYYY-MM-DD');
        })

        res.render('index', {
            isAuthenticated,
            user: req.session.user, 
            notices: results 
        });
    });
});

router.get('/introduce', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;

    res.render('introduce/introduce', { 
        isAuthenticated,
        user: req.session.user
    });
});

export default router;
