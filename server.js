const con = require("./sql.js")
const http = require('http');
const bodyParser = require('body-parser')
const fs = require('fs');
const express = require('express');
const axios = require('axios');
const { connect } = require("http2");
const { strictEqual } = require("assert");
const { type } = require("os");
const app = express();
const bcrypt = require("bcryptjs");
const path = require('path')

const host = '142.93.164.123'
const port = 80;


const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

let soc;
var user_data;



app.get('/', (req, res) => {
  const x = __dirname + "/loginpage/login.html";
  res.sendFile(x);
});

function addDataBase(data, response){
  var id = data['id']
  var username = data['login'];
  var full_name = data['usual_full_name'];
  var mail = data['email'];
  var coalition = 'slitherin';
  var level = data['cursus_users'][1]['level'];
  sql = `INSERT IGNORE INTO users(id, fullname , username, coalition, level, email, password)values(${id}, \'${full_name}\', \'${username}\',\'${coalition}\',  ${level}, \'${mail}\', ${id})`
  con.connection.query(sql, function(err, result){})
}

app.get('/authorize', (request, res) =>{
  axios.post('https://api.intra.42.fr/oauth/token', {
      grant_type: 'authorization_code',
      client_id: 'u-s4t2ud-c34dad11eca764242d4a19e36c91d974e939b96742eb23eff24a238ee8cae461',
      client_secret: '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',
      code: request.query.code,
      redirect_uri: 'http://142.93.164.123/authorize'
  })
  .then(function(response){
    axios.get("https://api.intra.42.fr/v2/me", {
      headers: { Authorization: `Bearer ${response.data.access_token}` }
      })
      .then(function(data){
            addDataBase(data.data,response);
            user_data = data.data;
            var username = data.data['login'];
            axios.post("http://142.93.164.123:4000/message", {username}, {
              headers: {nickname: username}
            })
            res.redirect("http://142.93.164.123:4000/message")
          })
      })
    .then(function(err){
      if (err) console.log( "hata: " + err);
    })
  });


server.listen(port, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
