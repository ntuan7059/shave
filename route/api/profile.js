const express = require("express");

const router = express();

router.get("/", (req, res) => {
	res.send("em la Tuan");
});

module.exports = router;
