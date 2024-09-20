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

        results.forEach(notice => {
            notice.created_at = moment(notice.created_at).format('YYYY-MM-DD');
        });

        const kittenNew = "SELECT * FROM shop WHERE age='키튼' ORDER BY created_at DESC LIMIT 1";
        const adultNew = "SELECT * FROM shop WHERE age='성묘' ORDER BY created_at DESC LIMIT 1";
        const seniorNew = "SELECT * FROM shop WHERE age='노묘' ORDER BY created_at DESC LIMIT 1";

        // 각 나이별 신상품 쿼리 실행
        connection.query(kittenNew, (err, kittenResults) => {
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }
            connection.query(adultNew, (err, adultResults) => {
                if (err) {
                    console.error('쿼리 오류: ' + err.stack);
                    res.status(500).send('서버 오류');
                    return;
                }
                connection.query(seniorNew, (err, seniorResults) => {
                    if (err) {
                        console.error('쿼리 오류: ' + err.stack);
                        res.status(500).send('서버 오류');
                        return;
                    }

                    // 이미지 쿼리 추가
                    const kittenImgQuery = "SELECT shop_id, img_name FROM shop_img WHERE shop_id = ? LIMIT 1";
                    const adultImgQuery = "SELECT shop_id, img_name FROM shop_img WHERE shop_id = ? LIMIT 1";
                    const seniorImgQuery = "SELECT shop_id, img_name FROM shop_img WHERE shop_id = ? LIMIT 1";

                    connection.query(kittenImgQuery, [kittenResults[0].shop_id], (err, kittenImgResults) => {
                        if (err) return handleQueryError(err, res);
                        connection.query(adultImgQuery, [adultResults[0].shop_id], (err, adultImgResults) => {
                            if (err) return handleQueryError(err, res);
                            connection.query(seniorImgQuery, [seniorResults[0].shop_id], (err, seniorImgResults) => {
                                if (err) return handleQueryError(err, res);

                                // 이미지 URL 추가
                                const kittenImage = kittenImgResults[0] ? `/uploads/${kittenResults[0].shop_id}/${kittenImgResults[0].img_name}` : null;
                                const adultImage = adultImgResults[0] ? `/uploads/${adultResults[0].shop_id}/${adultImgResults[0].img_name}` : null;
                                const seniorImage = seniorImgResults[0] ? `/uploads/${seniorResults[0].shop_id}/${seniorImgResults[0].img_name}` : null;

                                res.render('index', {
                                    isAuthenticated,
                                    user: req.session.user,
                                    notices: results,
                                    kittenNew: { ...kittenResults[0], img_name: kittenImage },
                                    adultNew: { ...adultResults[0], img_name: adultImage },
                                    seniorNew: { ...seniorResults[0], img_name: seniorImage }
                                });
                            });
                        });
                    });
                });
            });
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
