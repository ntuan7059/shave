const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	Product: [
		{
			title: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			location: {
				type: String,
				required: true,
			},
			rate: {
				type: Number,
				default: 5,
			},
			category: {
				type: String,
				required: True,
			},
			tag: {
				type: [String],
				required: true,
			},
		},
	],
});
module.exports = Product = mongoose.model("product", UserSchema);
