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
    res.render('survey/car_food_survey',{
        isAuthenticated,
        user: req.session.user
    })
});

router.get('/survey/results', (req,res)=> {
    const isAuthenticated = req.session.user ? true : false;
    res.render('survey/food_survey_result',{
        isAuthenticated,
        user: req.session.user
    })
});

export default router;