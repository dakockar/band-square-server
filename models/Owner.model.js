const { Schema, model } = require("mongoose");

const OwnerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  imgUrl: String,
  venues: Array
})


const Owner = model("Owner", OwnerSchema);

module.exports = Owner;