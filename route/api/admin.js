const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	try {
		res.send("tadadad");
	} catch (error) {
		console.log(error);
	}
});
module.exports = router;
