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

        // 최신 상품 4개 조회
        const shopSql = "SELECT * FROM shop ORDER BY created_at DESC LIMIT 4";
        connection.query(shopSql, (err, shopResults) => {
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }

            // 각 상품의 이미지 가져오기
            const shopIds = shopResults.map(shop => shop.shop_id);
            const shopImgSql = "SELECT shop_id, img_name FROM shop_img WHERE shop_id IN (?)";

            connection.query(shopImgSql, [shopIds], (err, imgResults) => {
                if (err) {
                    console.error('쿼리 오류: ' + err.stack);
                    res.status(500).send('서버 오류');
                    return;
                }

                // 이미지 매핑
                const shopImages = {};
                imgResults.forEach(img => {
                    if (!shopImages[img.shop_id]) {
                        shopImages[img.shop_id] = [];
                    }
                    shopImages[img.shop_id].push(img.img_name);
                });

                // 이미지 URL 추가
                const goodsWithImages = shopResults.map(shop => ({
                    ...shop,
                    img_name: shopImages[shop.shop_id] ? `/uploads/${shop.shop_id}/${shopImages[shop.shop_id][0]}` : null
                }));

                res.render('index', {
                    isAuthenticated,
                    user: req.session.user,
                    notices: results,
                    goods: goodsWithImages,
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
