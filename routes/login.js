import express from 'express';
import connection  from '../database.js';
import moment from 'moment';

const router = express.Router();

//로그인 폼으로 이동
router.get("/login", (req, res)=>{
    res.render("login/login")
});

router.get("/join", (req, res)=>{
    res.render("login/join")
});

export default router;