let mysql = require('mysql');
let connection = mysql.createConnection({
    host: '142.93.164.123',
    user: 'xxxxxxx',
    password: 'xxxxxxx',
    database: 'server_one'
});


exports.connection = connection;
