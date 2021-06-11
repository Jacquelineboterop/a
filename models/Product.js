const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number }
});
ProductSchema.methods.truncateBody = function() {
  if (this.body && this.body.length > 75) {
    return this.body.substring(0, 70) + " ...";
  }
  return this.body;
};
module.exports = mongoose.model("Product", ProductSchema);
