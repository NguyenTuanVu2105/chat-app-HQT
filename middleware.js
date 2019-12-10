var jwt = require('jsonwebtoken')
var config = require('./config')

verifyToken = (req, res, next) => {
	let token = req.headers['x-access-token'];
  
	if (!token){
		return res.status(403).send({ 
			message: 'No token provided.' 
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err){
			return res.status(403).send({ 
					error: false, 
					message: 'Fail to Authentication. Error -> ' + err 
				});
		}
		req.userid = decoded.id;
		next();
	});
}

module.exports = {
	verifyToken: verifyToken
}