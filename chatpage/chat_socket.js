const bcrypt = require("bcryptjs");
const con = require("../sql.js");
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const { waitForDebugger } = require("inspector");
const io = new Server(server)

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())


const host = '142.93.164.123'
const port = 4000;
var username;
app.get('/message', (req, res) => {
    const x = __dirname + "/message.html";
    res.sendFile(x);
  });

app.post('/message', (req, res) => {
    username = req.body.username;
    console.log(username);
    const x = __dirname + "/message.html";
    res.sendFile(x);
});

server.listen(port, () => {
    //con.connection.connect((err) => {
      //  if (err) console.log(err);
        //console.log("connection established")
      //}),
    console.log(`Server is running on http://${host}:${port}`);
});

io.on('connection', (socket) => {
    var clientIp = socket.conn.remoteAddress;
    const ip = clientIp.split(':')[3];
    var flag = 0;
    soc = socket;
    const soc_ips = {};
    if (flag == 0){
        soc_ips[ip] = username;
        flag = 1;
    }
    socket.on('chat message', (msg) => {
        io.emit('chat message', soc_ips[ip] + ": "+ msg);
    })
    socket.on('private', () => {
        io.emit('private');
    })
});
