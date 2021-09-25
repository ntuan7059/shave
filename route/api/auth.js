const express = require("express");
const User = require("../../model/Admin");
const auth = require("../../middleware/auth");
const config = require("config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const router = express.Router();

router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (error) {
		res.status(400).send("no user match");
	}
});

//@get all user
router.get("/all", auth, async (req, res) => {
	try {
		const user = await User.find();
		res.json(user);
	} catch (error) {
		res.status(400).send("no user match");
	}
});

router.post(
	"/",
	[
		check("email", "not valid email").isEmail(),
		check("password", "password is required").exists(),
	],
	async (req, res) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send("something wrong with typing");
		}
		const { email, password } = req.body;
		try {
			const user = await User.findOne({ email });
			if (!user) {
				res.status.send("email not valid");
			}
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				res.status(400).send("password not correct");
			}
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(payload, config.get("JWT_SECRET"), (error, token) => {
				res.json({ token });
			});
		} catch (error) {
			res.status(400).send("something wrong");
		}
	}
);
module.exports = router;
