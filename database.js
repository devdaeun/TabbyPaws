const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost:3306',      // MySQL 서버 호스트
    user: 'root',  // MySQL 사용자 이름
    password: '1234', // MySQL 비밀번호
    database: 'tabby_paws' // 사용할 데이터베이스
});