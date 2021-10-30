var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BikeSchema = new Schema({
  model: { type: String, required: true },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "manufacturer",
    required: true,
  },
  description: { type: String, required: true },
  type: { type: Schema.Types.ObjectId, ref: "type", required: true },
  size: { type: String, enum: ["xs", "s", "m", "l", "xl"], required: true },
  price: { type: Number, required: true },
});

//virtual for bike URL
BikeSchema.virtual("url").get(function () {
  return "/bike/" + this._id;
});

module.exports = mongoose.model("Bike", BikeSchema);
