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

router.get('/detail/:shop_id', (req,res)=>{
    const isAuthenticated = req.session.user ? true : false;
    const shopId = req.params.shop_id;
    const sql = "select * from shop where shop_id = ?"
    connection.query(sql, [shopId], (err, results)=>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        const imgSql = "select * from shop_img where shop_id = ?"
        connection.query(imgSql, [shopId], (err, imgResults)=>{
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }
            res.render('shop/shop_detail', {
                isAuthenticated,
                user: req.session.user, 
                shop: results,
                shopImg: imgResults
            })
        });
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
    const { title, price, content, age, ingredient, allergies} = req.body;
    const { user_id } = req.session.user;

    // shop 테이블에 정보 저장
    const sqlShop = 'INSERT INTO shop(user_id, title, price, content, age, ingredient, allergies) VALUES(?, ?, ?, ?, ?, ?)';
    connection.query(sqlShop, [user_id, title, price, content, age, ingredient, allergies], (err, results) => {
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

//수정 폼 이동
router.get('/modify/:shop_id', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    const shopId = req.params.shop_id;
    const sql = 'select * from shop where shop_id = ?';

    connection.query(sql, [shopId], (err,results)=>{
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        res.render('shop/shop_modify', {
            isAuthenticated,
            user: req.session.user, 
            shop: results[0]
        })
    });
});

//수정사항 갱신
router.post('/update/:shop_id', upload.array('image_name'), (req, res) => {
    const shopId = req.params.shop_id;
    const { title, price, content, age, ingredient, allergies } = req.body;
    const { user_id } = req.session.user;

    // 상품 정보를 업데이트
    const sql = 'UPDATE shop SET title = ?, price = ? content = ?, age = ?, ingredient = ?, allergies = ?, updated_at = now() WHERE shop_id = ? AND user_id = ?';
    
    connection.query(sql, [title, price, content, age, ingredient, allergies, shopId, user_id], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            return res.status(500).send('서버 오류');
        }

        // 기존 이미지를 삭제
        const delImg = 'DELETE FROM shop_img WHERE shop_id = ?';
        connection.query(delImg, [shopId], (err, resultImg) => {
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                return res.status(500).send('서버 오류');
            }

            // 이미지 추가 프로미스 생성
            const insertImagePromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const sqlImg = 'INSERT INTO shop_img (shop_id, img_name) VALUES (?, ?)';
                    connection.query(sqlImg, [shopId, file.originalname], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            // 이미지 추가 프로미스 실행
            Promise.all(insertImagePromises)
                .then(() => {
                    const shopDir = path.join(__dirname, '../uploads/', shopId.toString());

                    // 폴더가 존재하면 파일 삭제
                    if (fs.existsSync(shopDir)) {
                        return fs.promises.readdir(shopDir)
                            .then(files => {
                                const unlinkPromises = files.map(file => {
                                    const filePath = path.join(shopDir, file);
                                    return fs.promises.unlink(filePath)
                                        .then(() => console.log(`${file} has been deleted.`));
                                });
                                return Promise.all(unlinkPromises);
                            })
                            .then(() => {
                                // 파일 이동
                                const movePromises = req.files.map(file => {
                                    const tempPath = path.join(__dirname, '../uploads/temp', file.originalname);
                                    const finalPath = path.join(shopDir, file.originalname);
                                    return fs.promises.rename(tempPath, finalPath)
                                        .then(() => console.log(`${file.originalname} has been moved to ${shopDir}.`));
                                });
                                return Promise.all(movePromises);
                            });
                    } else {
                        return Promise.resolve(); // 폴더가 없으면 바로 해결
                    }
                })
                .then(() => {
                    res.redirect(`/shop/${shopId}`);
                })
                .catch(err => {
                    console.error('파일 삭제 또는 이동 오류: ' + err.stack);
                    res.status(500).send('파일 처리 오류');
                });
        });
    });
});



router.post('/delete/:shop_id', (req, res) => {
    const shopId = req.params.shop_id;
    const sql = 'DELETE FROM shop WHERE shop_id = ?';

    connection.query(sql, [shopId], (err, results) => {
        if (err) {
            console.error('쿼리 오류: ' + err.stack);
            res.status(500).send('서버 오류');
            return;
        }
        const sqlImg = 'delete from shop_img where shop_id = ?';
        connection.query(sqlImg, [shopId], (err, resultImg)=> {
            if (err) {
                console.error('쿼리 오류: ' + err.stack);
                res.status(500).send('서버 오류');
                return;
            }
        });

        const shopDir = path.join(__dirname, '../uploads/', shopId.toString());

        // shopId와 동일한 폴더만 삭제
        if (fs.existsSync(shopDir)) {
            fs.readdir(shopDir, (err, files) => {
                if (err) throw err;

                const unlinkPromises = files.map(file => {
                    const filePath = path.join(shopDir, file);
                    return new Promise((resolve, reject) => {
                        fs.unlink(filePath, err => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log(`${file} has been deleted.`);
                                resolve();
                            }
                        });
                    });
                });

                // 모든 파일 삭제 후 폴더 삭제
                Promise.all(unlinkPromises)
                    .then(() => {
                        fs.rmdir(shopDir, err => {
                            if (err) throw err;
                            console.log(`${shopDir} has been removed.`);
                            res.redirect('/shop'); // 삭제 후 공지 목록 페이지로 리다이렉션
                        });
                    })
                    .catch(err => {
                        console.error('파일 삭제 오류: ' + err.stack);
                        res.status(500).send('파일 삭제 오류');
                    });
            });
        } else {
            res.redirect('/shop'); // 폴더가 없으면 바로 리다이렉션
        }
    });
});

//검색창(카테고리 포함)

router.get('/search', (req, res) => {
    const isAuthenticated = req.session.user ? true : false;
    const { searchValue, allergies, age, minPrice, maxPrice } = req.query;
    const params = [];
    let sql = 'SELECT * FROM shop WHERE 1=1';

    // searchValue가 있을 경우
    if (searchValue) {
        sql += ' AND title LIKE ?';
        params.push(`%${searchValue}%`);
    }

    // allergies가 있을 경우
    if (allergies) {
        const allergiesArray = Array.isArray(allergies) ? allergies : [allergies];
    
        if (allergiesArray.length === 1) {
            sql += ' AND FIND_IN_SET(?, allergies)';
            params.push(allergiesArray[0]);
        } else {
            const likeConditions = allergiesArray.map(allergy => `FIND_IN_SET(?, allergies)`).join(' OR ');
            sql += ` AND (${likeConditions})`;
            params.push(...allergiesArray);
        }
    }
    
    
    // age가 있을 경우
    if (age) {
        sql += ' AND age = ?';
        params.push(age);
    }

    // minPrice가 있을 경우
    if (minPrice) {
        sql += ' AND price >= ?';
        params.push(minPrice);
    }

    // maxPrice가 있을 경우
    if (maxPrice) {
        sql += ' AND price <= ?';
        params.push(maxPrice);
    }

    // 쿼리 실행
    connection.query(sql, params, (err, results) => {
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
            res.render('shop/shop_search', { 
                isAuthenticated,
                user: req.session.user, 
                shop: shopWithImages
            });
        });
    });
});


export default router;