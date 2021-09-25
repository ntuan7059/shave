const express = require("express");
const Product = require("../../model/Product");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();

// add + create product
router.post(
	"/",
	[
		auth,
		[
			check("title", "title is required"),
			check("price", "price is required"),
			check("location", "location is required"),
			check("image", "image is required"),
			check("rate", "rate is required"),
			check("category", "category is required"),
			check("tag", "tag is required"),
		],
	],
	async (req, res) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send("pls fill in all info");
		}

		const { title, price, location, image, rate, category, tag } = req.body;
		const productTada = {};
		productTada.title = title;
		productTada.price = price;
		productTada.location = location;
		productTada.image = image;
		productTada.rate = rate;
		productTada.category = category;
		productTada.tag = tag;
		const newProduct = {};
		newProduct.user = req.user.id;
		newProduct.eachProduct = [productTada];

		try {
			let product = await Product.findOne({ user: req.user.id });
			if (!product) {
				product = new Product(newProduct);
				await product.save();
				res.json(product);
			} else {
				await product.eachProduct.unshift(productTada);
				await product.save();
				res.json(product);
			}
		} catch (error) {
			res.status(400).send("check error pls");
			console.log(error);
		}
	}
);

//update

router.put(
	"/:userId/:id",
	[
		auth,
		[
			check("title", "title is required"),
			check("price", "price is required"),
			check("location", "location is required"),
			check("image", "image is required"),
			check("rate", "rate is required"),
			check("category", "category is required"),
			check("tag", "tag is required"),
		],
	],
	async (req, res) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send("pls fill in all blank");
		}
		const { title, price, location, image, rate, category } = req.body;
		const productTada = {};
		productTada.title = title;
		productTada.price = price;
		productTada.location = location;
		productTada.image = image;
		productTada.rate = rate;
		productTada.category = category;

		try {
			const product = await Product.findOne({ user: req.params.userId });
			//find index
			{
				/*const removeIndex = product.eachProduct
				.map((item) => item._id)
			.indexOf(req.params.id);*/
			}
			let changeIndex = product.eachProduct
				.map((product) => product.id)
				.indexOf(req.params.id);
			product.eachProduct[changeIndex] = productTada;
			await product.save();
			res.json(product);
		} catch (error) {
			res.status(400).send("check error pls");
			console.log(error);
		}
	}
);

//delete

router.delete("/:userId/:id", auth, async (req, res) => {
	try {
		const product = await Product.findOne({ user: req.params.userId });
		//find index
		let changeIndex = product.eachProduct
			.map((product) => product.id)
			.indexOf(req.params.id);
		product.eachProduct.splice(changeIndex, 1);
		await product.save();
		res.json(product);
	} catch (error) {
		res.status(400).send("check error pls");
		console.log(error);
	}
});

// all product

router.get("/", async (req, res) => {
	try {
		const product = await Product.find();
		res.json(product);
	} catch (error) {
		res.status(400).send("check console");
		console.log(error);
	}
});

// get product by user

router.get("/:userId", async (req, res) => {
	try {
		const product = await Product.find({ user: req.params.userId });
		res.json(product);
	} catch (error) {
		res.status(400).send("check console");
		console.log(error);
	}
});

module.exports = router;
