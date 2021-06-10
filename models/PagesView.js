const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema({
  path:  String ,
  date: Date ,
  userAgent: String ,
  view: Number
});

module.exports = mongoose.model("PageView", pageViewSchema);
