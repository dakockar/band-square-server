const { Schema, model } = require("mongoose");

const MusicianSchema = new Schema({
  email: { type: string, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  imgUrl: String,
  location: String,
  instrument: String,
  bandName: String,
  refUrl: String
})

const Musician = model("Musician", MusicianSchema);

module.exports = Musician;
