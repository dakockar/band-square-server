const { Schema, model } = require("mongoose");

const MusicianSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  imgUrl: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYSprYSGY7wv-OyUUMHyEYhPtVO1juHDCtVg&usqp=CAU'
  },
  location: String,
  instrument: Array,
  bandName: String,
  refUrl: String,
  genre: Array,
  aboutMe: String,
  type: String
})

const Musician = model("Musician", MusicianSchema);

module.exports = Musician;
