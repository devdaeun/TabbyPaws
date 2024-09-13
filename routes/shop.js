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

router.get('/', (req,res)=>{
    const sql = 'select * from shop';
    const isAuthenticated = req.session.user ? true : false;
    connection.query(sql, (err,results)=>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        const shop_image = "SELECT shop_id, MIN(img_name) AS img_name FROM shop_img GROUP BY shop_id";
        connection.query(shop_image,(err,img_results)=>{
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }
            // shop_id를 기준으로 이미지 맵핑
            const imageMap = img_results.reduce((acc, img) => {
                acc[img.shop_id] = img.img_name;
                return acc;
            }, {});

            // shop 데이터에 이미지 URL 추가
            const shopWithImages = results.map(shop => ({
                ...shop,
                img_name: imageMap[shop.shop_id] ? `/uploads/${shop.shop_id}/${imageMap[shop.shop_id]}` : null
            }));
            res.render('shop/shop', { 
                isAuthenticated,
                user: req.session.user, 
                shop: shopWithImages
            });
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

// Multer 설정: 파일 저장 위치와 파일 이름 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/temp');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.array('image_name'), (req,res)=>{
    const { title, content, age, ingredient, allergies} = req.body;
    const { user_id } = req.session.user;

    // shop 테이블에 정보 저장
    const sqlShop = 'INSERT INTO shop(user_id, title, content, age, ingredient, allergies) VALUES(?, ?, ?, ?, ?, ?)';
    connection.query(sqlShop, [user_id, title, content, age, ingredient, allergies], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }

        const shopId = results.insertId; // 방금 삽입한 shop의 ID

        // shop_img 테이블에 이미지 정보 저장
        const sqlImg = 'INSERT INTO shop_img (shop_id, img_name) VALUES (?, ?)';
        req.files.forEach(file => {
            connection.query(sqlImg, [shopId, file.originalname], (err, imgResults) => {
                if (err) {
                    console.error('이미지 쿼리 오류: ' + err.stack);
                    res.status(500).send('서버 오류');
                    return;
                }
            });
        });

        // 업로드된 파일을 `shopId` 번호 별 폴더로 이동
        req.files.forEach(file => {
            const tempPath = path.join(__dirname, '../uploads/temp', file.originalname);
            const shopDir = path.join(__dirname, '../uploads/', shopId.toString());
            
            if (!fs.existsSync(shopDir)) {
                fs.mkdirSync(shopDir, { recursive: true });
            }
            
            const finalPath = path.join(shopDir, file.originalname);
            fs.rename(tempPath, finalPath, err => {
                if (err) throw err;
                console.log(`${file.originalname} has been moved to ${shopDir}.`);
            });
        });

        res.redirect('/shop');
    });
});

export default router;