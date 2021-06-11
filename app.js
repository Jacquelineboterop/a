const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/notes', { useNewUrlParser: true });

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
 const products = await Product.find();
 res.json(products);
});



app.listen(3000, () => console.log("Listening on port 3000 ..."));
