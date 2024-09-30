import express from 'express';
import connection  from '../database.js';
import { fileURLToPath } from 'url';
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import multer from 'multer';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req,res)=> {
    const isAuthenticated = req.session.user ? true : false;
    res.render('survey/food_survey',{
        isAuthenticated,
        user: req.session.user
    });
});

router.post('/result', (req, res) => {
    const { age, texture, allergies, special } = req.body;

    // 기본 쿼리와 조건 배열 초기화
    let sql = 'SELECT shop_id, title FROM shop WHERE';
    const conditions = [];
    const params = [];

    // 각 조건을 확인하고 추가
    if (age !== null) {
        conditions.push('age = ?');
        params.push(age);
    }

    if (texture !== null) {
        conditions.push('texture = ?');
        params.push(texture);
    }

    if (allergies !== null) {
        conditions.push('allergies = ?');
        params.push(allergies);
    }

    if (special !== null) {
        conditions.push('special = ?');
        params.push(special);
    } else {
        conditions.push('special IS NULL');
    }

    // 최종 쿼리 조합
    sql += ' ' + conditions.join(' AND ');

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        if (results.length > 0) {
            const recommendations = results.map(result => result.title); // 원하는 컬럼
            res.json({ recommendations });
        } else {
            res.json({ recommendations: ['추천 결과가 없습니다.'] });
        }
    });
});


export default router;