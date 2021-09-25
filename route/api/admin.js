const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");

// @ login
// http//:localhost:5000/api/admin
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
					jwt.sign(payload, config.get("JWT_SECRET"), (error, token) => {
						if (error) console.log(error);
						res.json({ token });
					});
				}
			} catch (error) {
				console.log(error.message);
			}
		}
	}
);

// @ update seller
// http//:localhost:5000/api/seller
router.put("/seller", auth, async (req, res) => {
	const { name, email } = req.body;
	try {
		//check if user existed?
		let seller = await User.findOneAndUpdate(
			{ email: email, name: name },
			{ $set: { isSeller: true } },
			{ new: true }
		);
		if (!seller) {
			res.status(400).send("no user");
		}
		await seller.save();
		res.json(seller);
	} catch (error) {
		res.status(404).send("check console pls");
		console.log(error.message);
	}
});
// @ update admin
// http//:localhost:5000/api/admin
router.put("/admin", auth, async (req, res) => {
	const { name, email } = req.body;
	try {
		//check if user existed?
		let admin = await User.findOneAndUpdate(
			{ email: email, name: name },
			{ $set: { isAdmin: true } },
			{ new: true }
		);
		if (!admin) {
			res.status(400).send("no user");
		} else {
			await admin.save();
			res.json(admin);
		}
	} catch (error) {
		res.status(404).send("check console pls");
		console.log(error.message);
	}
});
// @ remove seller
// http//:localhost:5000/api/seller
router.put("/seller/remove", auth, async (req, res) => {
	const { name, email } = req.body;
	try {
		//check if user existed?
		let seller = await User.findOneAndUpdate(
			{ email: email, name: name },
			{ $set: { isSeller: false } },
			{ new: true }
		);
		if (!seller) {
			res.status(400).send("no user");
		}
		await seller.save();
		res.json(seller);
	} catch (error) {
		res.status(404).send("check console pls");
		console.log(error.message);
	}
});
// @ remove admin
// http//:localhost:5000/api/admin
router.put("/admin/remove", auth, async (req, res) => {
	const { name, email } = req.body;
	try {
		//check if user existed?
		let admin = await User.findOneAndUpdate(
			{ email: email, name: name },
			{ $set: { isAdmin: false } },
			{ new: true }
		);
		if (!admin) {
			res.status(400).send("no user");
		} else {
			await admin.save();
			res.json(admin);
		}
	} catch (error) {
		res.status(404).send("check console pls");
		console.log(error.message);
	}
});
module.exports = router;
