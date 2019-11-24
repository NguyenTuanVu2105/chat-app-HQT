var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var session = require('express-session')
var cassandra = require('cassandra-driver')
var query = require('./query')
var cors = require('cors')

app.use(bodyParser.json());
app.use(cors())
var server = require("http").Server(app);
var io = require("socket.io")(server);
io.on('connection', socket => {
    console.log('User connected')


    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })
var authProvider = new cassandra.auth.PlainTextAuthProvider('kennen', 'minhlovehuong01')
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], authProvider: authProvider, keyspace:'chat_app', localDataCenter: 'datacenter1'})

app.post('/api/register', function(req, res) {
    var fName=req.body.fullname;
    var uName=req.body.username;
    var psw=req.body.password;
    var email = req.body.email;
    var avatar=`./avatar${Math.floor(Math.random() * 10)}.jpg`
    console.log(avatar)
    // Check user if exist 
    client.execute(query.checkUser(uName), [], function(err, result) {
        if (err) {
            res.send("Error")
        } else {
            if (result.rows.length > 0) {
                res.json({
                    success: false,
                    message: "username is exist"
                })
            } else {
                client.execute(query.checkEmail(email), [], function(err, result) {
                    if (result.rows.length > 0) {
                        res.json({
                            success: false,
                            message: "email is exist"
                        })
                    } else {
                        client.execute(query.addUser(uName, fName, psw, avatar), [], function(err, result) {
                            if (err) {
                                res.status(500)
                            } else {
                                res.json({
                                    success: true,
                                })     
                            }
                        })
                    }
                })
            }
        }
    }) 
})

app.post('/api/login', function(req, res) {
    var uName = req.body.username
    var psw = req.body.password
    client.execute(query.checkUser(uName), [], function(err, result) {
        if (err) {
            res.status(500)
        } else {
            if (result.rowLength === 0) {
                res.json({
                    success: false,
                    message: "Username is not exist"
                })
            } else {
                data = result.rows[0]
                console.log(data)
                console.log(psw)
                if (psw === data.password) {
                    res.json({
                        success: true,
                        ...data
                    })
                } else {
                    res.json({
                        success: false,
                        message: "password is incorrect"
                    })
                }
            }
        }
    })
})

app.post('/api/users/search', function(req, res) {
    var q = req.body.query
    console.log(req.body)
    client.execute(query.searchUser(q), [], function(err, result) {
        if (err) {
            res.status(500)
        } else {
            res.send(result.rows)
        }
    })
})
server.listen(5000)