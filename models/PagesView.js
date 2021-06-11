const mongoose = require("mongoose");

const PagesViewSchema = new mongoose.Schema({
  path: { type: String },
  date: { type: Date },
  userAgent: { type: String },
  view: { type: Number }

});

module.exports = mongoose.model("PagesView", PagesViewSchema);
