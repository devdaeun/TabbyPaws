import mysql from 'mysql2';

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'tabby_paws'
});

// 데이터베이스 연결 함수
export const init = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'tabby_paws'
    });
};

export const connect = (conn) => {
    conn.connect((err) => {
        if (err) console.error("mysql connection error : " + err);
        else console.log("mysql is connected successfully!");
    });
};


export default connection;
