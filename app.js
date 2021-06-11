const express = require("express");
const mongoose = require("mongoose");
const Note = require("./models/Note");
const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/notes', { useNewUrlParser: true });

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
 const notes = await Note.find();
 res.json(notes);
});



app.listen(3000, () => console.log("Listening on port 3000 ..."));
