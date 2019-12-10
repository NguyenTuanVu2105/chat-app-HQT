var query = require('./query')

function requestUser(client, sender, receiver) {
    client.execute(query.checkRequest(sender, receiver), [], function(err, result) {
        if (!err) { 
            if (result.rowLength === 0)
                client.execute(query.addRequest(sender, receiver, false), [], function(err, result) {})
        } 
    })
} 

function getUserByID(client, userid ,callback) {
    client.execute(query.getUsers([userid]), function(err, result) {
        callback(result.rows)
    }) 
}

async function parseMessage(client, messages) {
    const users = (await client.execute(query.getAllUser())).rows
    return messages.map(message => {
       return({
        id: message.message_id,
        roomid: message.room_id,
        author: users.find(x => {
            return JSON.stringify(x.id) === JSON.stringify(message.author_id)
        }),
        content: message.content,
        update_at: message.update_at
       })
    })
}
async function parseRoom(client, userID, rooms) {
    const users = (await client.execute(query.getAllUser())).rows
    return rooms.map(room => {
        var read_members = room.members_read
        // var read = read_members ? read_members. : 
        var read = read_members ? read_members.find(member => JSON.stringify(member) === JSON.stringify(userID)) : null
        if (room.is_private) {
            const nameID = room.members.find(x => {
                return x != userID
            })
            const user = users.find(x => {
                return JSON.stringify(x.id) === JSON.stringify(nameID)
            })
            // var read = room.member_read_last_message.find(member => JSON.stringify(member) === JSON.stringify(userID))
            return {
                id: room.id,
                name: user.name,
                avatar: user.avatar,
                members: room.members,
                description: room.description,
                update_at: room.update_at,
                read: read ? true : false,
            }
        } else {
            return {
                id: room.id,
                name: room.name,
                avatar: room.avatar,
                members: room.members,
                description: room.description,
                update_at: room.update_at,
                read: read ? true: false
            }
        }
    })
}

async function acceptRequest(client, sender, receiver) {
    await client.execute(query.acceptRequest(sender, receiver))
    await client.execute(query.addContact(sender, receiver))
    await client.execute(query.addContact(receiver, sender))
    var roomId = Date.now()
    await client.execute(query.addRoom(roomId, '', '',[sender, receiver], '', true))
    await client.execute(query.addRoomToUser(roomId, [sender, receiver]))
    console.log("Success")
} 

async function delineRequest(client, sender, receiver) {
    try {
        await client.execute(query.delineRequest(sender, receiver))
    } catch {
        console.log("Deline Error")
    }
}

async function getGroup(client, user) {
    var groups = await client.execute(query.getContact(user))
}

async function getProfile(client, userid) {
    return await client.execute(query.getProfile(userid)) 
}

async function addRooms(client, name, avatar, members, description) {
    var res = true
    var roomid = Date.now()
    client.execute(query.addRoom(roomid, name, avatar, members, description, false), function(err, result){
        if (err){
            res = false
            console.log(err)
        } 
        else {
            client.execute(query.addRoomToUser(roomid, members), function(err, result) {
                if (err) {
                    res = false
                    console.log(err)
                }
            })
        }
    })
    return res
}

async function addMessage(client, {roomid, message, userid}) {
    await client.execute(query.addMessage(roomid, Date.now(), userid, message))
    await client.execute(query.updateRoom(roomid))
    await client.execute(query.readMessage(roomid, userid))
}

async function readMessage(client, roomid, userid) {
    await client.execute(query.readMessage(roomid, userid))
}

async function parseUserSearch(client, users, userid) {
    const contacts = (await client.execute(query.getContact(userid))).rows[0].contacts
    const incomings = (await client.execute(query.getIncomingRequest(userid))).rows.map(x => x.sender_id)
    const requests = (await client.execute(query.getAcceptRequest(userid))).rows.map(x => x.receiver_id)
    var x = users.filter(user => {
        const contact_check =  contacts ? contacts.find(contact => {return JSON.stringify(contact) === JSON.stringify(user.id)}) : false
        const incoming_check = incomings ? incomings.find(incoming => {return JSON.stringify(incoming) === JSON.stringify(user.id)}) : false
        const request_check = requests ? requests.find(request => {return JSON.stringify(request) === JSON.stringify(user.id)}) : false
        const my_check = JSON.stringify(userid) === JSON.stringify(user.id)
        return !(contact_check || incoming_check || request_check || my_check)
    })
    console.log(x)
    return x
}

module.exports = {
    requestUser: requestUser,
    acceptRequest: acceptRequest,
    getGroup: getGroup,
    getProfile: getProfile,
    addRooms: addRooms,
    delineRequest: delineRequest,
    getUserByID: getUserByID,
    parseRoom: parseRoom,
    parseMessage: parseMessage,
    addMessage: addMessage,
    parseUserSearch: parseUserSearch
}