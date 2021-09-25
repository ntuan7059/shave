const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
	//get token from header
	const token = req.header("auth-token");

	if (!token) {
		res.status(401).send("access denied");
	}
	try {
		const decoded = jwt.verify(token, config.get("JWT_SECRET"));
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).send("the token not correct");
	}
};
