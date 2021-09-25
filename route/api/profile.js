const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Profile = require("../../model/Profile");
const router = express();

router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });
		if (!profile) {
			res.status(400).send("no profile");
		}
		res.json(profile);
	} catch (error) {
		res.status(500).send("Server error");
	}
	res.send("em la Tuan");
});

router.post(
	"/",
	[
		auth,
		[
			check("company", "company is required"),
			check("domain", "domain is required"),
			check("description", "description is required"),
		],
	],
	async (req, res) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send("pls fill in all blank space");
		}
		const { user, company, domain, description } = req.body;
		const profileField = {};
		profileField.user = req.user.id;
		profileField.company = company;
		profileField.domain = domain;
		profileField.description = description;

		//check if profile existed
		try {
			let profile = await Profile.findOne({ user: req.user.id });
			if (profile) {
				//update
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileField },
					{ new: true }
				);
				return res.json(profile);
			}
			//create
			profile = new Profile(profileField);
			await profile.save();
			res.json(profile);
		} catch (error) {
			res.status(400).send("check again profile find");
			console.log(error);
		}
	}
);

//delete all

router.delete("/", auth, async (req, res) => {
	try {
		//remove product
		await Product.findOneAndRemove({ user: req.user.id });
		//remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		//remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json("đã xoa người dùng");
	} catch (error) {
		res.status(401).send("check lại 3 cái");
	}
});

module.exports = router;
