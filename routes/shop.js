import express from 'express';
import connection  from '../database.js';
import moment from 'moment';


const router = express.Router();

router.get('/', (req,res)=>{
    const sql = 'select * from shop';
    const isAuthenticated = req.session.user ? true : false;
    connection.query(sql, (err,results)=>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        res.render('shop/shop', { 
            isAuthenticated,
            user: req.session.user, 
            shop: results 
        });
    });
});

router.get('/form', (req,res)=>{
    const isAuthenticated = req.session.user ? true : false;
    res.render('shop/shop_form',{
        isAuthenticated,
        user: req.session.user
    });
});

export default router;