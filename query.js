module.exports = {
    checkUser: username => `select * from user where username = '${username}'`,
    addUser: (uName, fName, pwd, ava) => `insert into user(username, fullname, password, avatar) values ('${uName}', '${fName}', '${pwd}', '${ava}')`,
    checkEmail: email => `select * from user where email = '${email}'`,
    searchUser: query => `select * from user where fullname like '%${query}%';`
}