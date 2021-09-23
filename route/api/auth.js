const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

router.post(
	"/",
	[
		check("name", "name required").not().isEmpty(),
		check("password", "too short").isLength({ min: 6 }),
	],
	async (req, res) => {
		if (!validationResult(req).isEmpty()) {
			console.log("validation fail");
		} else {
			const { name, email, password } = req.body;
			try {
				//check if user existed?
				let user = await User.findOne({ email });
				if (user) {
					res.status(400).send("user existed");
				} else {
					user = new User({
						name,
						email,
						password,
					});
					//bcrypt password
					user.password = await bcrypt.hash(password, 10);
					await user.save();
					//send back token
					const payload = {
						user: {
							id: user.id,
						},
					};
				}
				jwt.sign(
					{
						user: {
							id: user.id,
						},
					},
					config.get("JWT_SECRET"),
					(error, token) => {
						if (error) console.log(error);
						res.json({ token });
					}
				);
			} catch (error) {
				console.log(error.message);
			}
		}
	}
);
module.exports = router;
