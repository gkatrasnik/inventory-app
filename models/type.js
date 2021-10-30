var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

//virtual for type URL
TypeSchema.virtual("url").get(function () {
  return "/type/" + this._id;
});

module.exports = mongoose.model("Type", TypeSchema);
