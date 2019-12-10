var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var session = require('express-session')
var cassandra = require('cassandra-driver')
var query = require('./query')
var cors = require('cors')
var bcrypt = require('bcryptjs')
var middleware = require('./middleware')
var jwt = require('jsonwebtoken')
var config = require('./config')
var db = require('./db.js')
var moment = require('moment');

app.use(bodyParser.json());
app.use(cors())

var authProvider = new cassandra.auth.PlainTextAuthProvider('kennen', 'minhlovehuong01')
var client = new cassandra.Client({contactPoints: ['127.0.0.1'], authProvider: authProvider, keyspace:'chat_app', localDataCenter: 'datacenter1'})
//helper 
function randomAvatar() {
    return `./avatar${Math.floor(Math.random() * 10)}.jpg`
}
// db.parseUserSearch(client, [1575230349727, 1575229337088, 1575229244466], 1575230588393)
// console.log(query.addMessage(1574961923557, Date.now(), 1574706573633, 'adhjjkhk'))
// client.execute(query.addMessage(1574961923557, Date.now(), 1574706573633, 'adhjjkhk'))

// io connect
var server = require("http").Server(app);
var io = require("socket.io")(server);
io.on('connection', socket => {
    console.log('New client connected')
    socket.on('request', (data) => {
        console.log(`request ${data.receiver.id}`)
        switch (data.status) {
            case 'request': 
                db.requestUser(client, data.sender.id, data.receiver.id)
                io.sockets.emit(`request ${data.receiver.id}`, data.sender.id)
                break
            case 'accept':
                db.acceptRequest(client, data.sender.id, data.receiver.id)
                io.sockets.emit(`accept ${data.sender.id}`, data.receiver.id)
                break    
            case 'deline':
                db.delineRequest(client, data.sender.id, data.receiver.id)       
                io.sockets.emit(`deline ${data.sender.id}`, data.receiver.id)  
                break
        } 
    })

    socket.on('client send message', function(data) {
        console.log(`send message ${data.roomid}`)
        db.addMessage(client,data)
        io.sockets.emit(`send message`, {
            message: data
        });
        io.sockets.emit(`new message ${data.roomid}`, {
            message: data
        });
    });

    socket.on('new group', function(roomid, members){
        console.log(members)
        members.forEach(member => {
            io.sockets.emit(`new group ${member}`)
        })
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

app.post('/api/register', function(req, res) {
    var name=req.body.name;
    var address=req.body.address;
    var password=bcrypt.hashSync(req.body.password, 8);
    var email = req.body.email;
    var avatar='./room.jpg'
    // Check user if exist 
    client.execute(query.checkUser(email), [], function(err, result) {
        if (err) {
            res.send("Error")
        } else {
            if (result.rows.length > 0) {
                        res.json({
                            success: false,
                            message: "email is exist"
                        })
                    } else {
                        client.execute(query.addUser(email, name, address, password, avatar), [], function(err, result) {
                            if (err) {
                                res.status(500)
                            } else {
                                res.json({
                                    success: true,
                                })     
                            }
                        })
                    }
                }
        })
})

app.post('/api/login', function(req, res) {
    var email = req.body.email
    var password = req.body.password
    client.execute(query.checkUser(email), [], function(err, result) {
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
                var passwordIsValid = bcrypt.compareSync(password, data.password);
                if (passwordIsValid) {
                    var token = jwt.sign({ id: data.id }, config.secret);
                    res.json({
                        success: true,
                        token: token,
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

app.get('/api/me', [middleware.verifyToken], function(req, res) {
    userid = req.userid
    db.getProfile(client, userid)
        .then(function(result){
            res.send(result.rows[0])
        })
        .catch(function(err){
            res.status(500).send("Database error")
        })
})

app.get('/api/contacts', [middleware.verifyToken], function(req, res) {
    user = req.userid
    client.execute(query.getContact(user), function(err, result) {
        if (err) {
            res.status(500).send(err)
        } else {
            if (result.rowLength > 0) {
                contacts = result.rows[0].contacts
                if (contacts) {
                    client.execute(query.getUsers(result.rows[0].contacts), function(err, result) {
                        if (result.rowLength > 0) {
                            res.send(result.rows)
                        }
                    }) 
                } else {
                    res.send([])
                }
            } else {
                res.send([])
            }
        }
    })
})

app.get('/api/requests/sent', [middleware.verifyToken], function(req, res){
    user = req.userid
    client.execute(query.getAcceptRequest(user), function(err, result) {
        if (err) {
            res.status(500)
        } else {
            if (result.rowLength > 0){
                users = result.rows.map(row => row.receiver_id)
                client.execute(query.getUsers(users), function(err, result) {
                    if (result.rowLength > 0) {
                        res.send(result.rows)
                    }
                })
            } else {
                res.send([])
            }
        }
    })
}) 

app.get('/api/requests/imcoming',[middleware.verifyToken],  function(req, res){
    user = req.userid
    client.execute(query.getIncomingRequest(user), [], function(err, result) {
        if (err) {
            res.status(500)
        } else {
            if (result.rowLength > 0){
                users = result.rows.map(row => row.sender_id)
                client.execute(query.getUsers(users), function(err, result) {
                    if (result.rowLength > 0) {
                        res.send(result.rows)
                    }
                })
            } else {
                res.send([])
            }
        }
    })
}) 


app.get('/api/users/search', [middleware.verifyToken],function(req, res) {
    var q = req.query.q
    var userid = req.userid
    client.execute(query.searchUser(q), [], function(err, result) {
        if (err) {
            res.status(500)
        } else {           
            db.parseUserSearch(client, result.rows, userid).then(function(result){res.send(result)})
        }
    })
})

app.post('/api/room', [middleware.verifyToken], function(req, res) {
    console.log(req.body)
    var {name, description, members} = req.body
    var roomid = Date.now()
    client.execute(query.addRoom(roomid, name, './room.jpg', members, description, false), function(err, result){
        if (err){
            res.status(500).send(err)
            console.log(err)
        } 
        else {
            client.execute(query.addRoomToUser(roomid, members), function(err, result) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send({success: true, id:roomid, members})
                }
            })
        }
    })
    }
)

app.get('/api/rooms', [middleware.verifyToken],function(req, res) {
    var userid = req.userid
    client.execute(query.getRoomsByUser(userid), function(err, result) {
        if (err) console.log(err)
        else {
            if (result.rowLength > 0) {
                roomids = result.rows[0].rooms
                if (roomids){
                    client.execute(query.getRoomsByID(roomids), function(err, result) {
                        if (!err) {
                            db.parseRoom(client, userid, result.rows)
                                .then(result => {
                                    res.send(result)
                                })
                        }    
                    })
                } else {
                    res.send([])
                }
            }
        }
    })
})

app.get('/api/room/messages', [middleware.verifyToken], function(req, res) {
    var userid = req.userid
    var roomid = req.query.roomid
    client.execute(query.getMessage(roomid), function(err, result) {
        if (err) {
            res.status(500).send(err)
        } else {
            if (result.rowLength > 0){
                db.parseMessage(client, result.rows.reverse())
                .then(result => res.send(result))
                .catch(err => res.status(500))
            }
            else {
                res.send([])
            }
        }
    })
})

app.get('/api/room/read', [middleware.verifyToken], function(req, res) {
    var userid = req.userid
    var roomid = req.query.roomid
    client.execute(query.readMessage(roomid, userid), function(err, result) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send({
                success: true
            })
        }
    })
}) 
server.listen(5000)