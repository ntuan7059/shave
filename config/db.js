const mongoose = require("mongoose");

const config = require("config");

const db = config.get("MONGODB_URL");

const mgconnect = async () => {
	try {
		await mongoose.connect(process.env.PORT || db);
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = mgconnect;
