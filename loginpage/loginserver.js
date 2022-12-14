const bcrypt = require("bcryptjs");
const alert = require('alert');
const con = require("../sql.js");
const url = require('url');
const http = require('http');
const express = require('express');
var bodyParser = require('body-parser')
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require("axios");
const io = new Server(server);

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

let ss;

function create_id(username) {
  var res = 0;
  for (var i = 0; i < username.length; i++){
    var rand = Math.random() * (500 - 0) + 0;
    res += (username.charCodeAt(i) * rand);
  }
  return res;
}

const host = '142.93.164.123'
const port = 3000;

app.get('/login', (req, res) => {
    const x = __dirname + "/login.html";
    res.sendFile(x);
  });
  
app.post('/login', (req, res) => {
    const { username, password } = req.body
    con.connection.query(`SELECT * FROM users`, function(err, rows, fields) {
        //for now
        if (err) res.redirect("http://142.93.164.123:4000/message"); return;
        ss = "default";
        for(var i = 0; i < rows.length; i++){
          if (rows[i].username == username){
            if (rows[i].password == password)
              break;
          }
        }
        if(i == rows.length){
          res.redirect("http://142.93.164.123:3000/login");
        }
        else{
            axios.post("http://142.93.164.123:4000/message", {username}, {
              headers: {nickname: username}
            })
            res.redirect("http://142.93.164.123:4000/message");
        }
      })
    });

app.post("/signup", urlencodedParser, (request, response) => {
    const { first_name, last_name, username, password, email, coalition} = request.body;
    let fullname = first_name + " " + last_name;
    var id = create_id(username)
    sql = `INSERT INTO users(id, fullname , username, coalition, level, email, password)values(${id}, \'${fullname}\', \'${username}\', \'${coalition}\',  0.5, \'${email}\', \"${password}\")`
    con.connection.query(sql, function(err, result){
      if (err){
          console.log("error: " + err);
          response.status(401);
          //for now
          //response.redirect("http://142.93.164.123:3000/signup");
          response.redirect("http://142.93.164.123:4000/message");
      }
      else{

        console.log(username + " Added succesfuly!")
        axios.post("http://142.93.164.123:4000/message", {username}, {
          headers: {nickname: username}
        })
        response.redirect("http://142.93.164.123:4000/message");
      }
    })
  })



app.get('/signup', (req,response) =>{
    const x = __dirname + "/signup.html";
    response.sendFile(x);
  })
server.listen(port, () => {
  //for now
    //con.connection.connect((err) => {
      //  if (err) console.log(err);
        //else
          //console.log("connection established")
      //}),
    console.log(`Server is running on http://${host}:${port}`);
});
