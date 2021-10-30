var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ManufacturerSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

//virtual for manufacturer URL
ManufacturerSchema.virtual("url").get(function () {
  return "/manufacturer/" + this._id;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
