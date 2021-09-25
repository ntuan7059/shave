const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	eachProduct: [
		{
			title: {
				type: String,
				required: true,
			},
			price: {
				type: String,
				required: true,
			},
			location: {
				type: String,
				required: true,
			},
			image: {
				type: String,
				required: true,
			},
			rate: {
				type: String,
				default: 5,
			},
			category: {
				type: String,
				required: true,
			},
			tag: {
				type: [String],
				required: true,
			},
		},
	],
});
module.exports = Product = mongoose.model("product", ProductSchema);
