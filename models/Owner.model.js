const { Schema, model } = require("mongoose");

const OwnerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  imgUrl: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYSprYSGY7wv-OyUUMHyEYhPtVO1juHDCtVg&usqp=CAU'
  },
  venues: Array,
  type: { type: String, default: 'owner' }
})


const Owner = model("Owner", OwnerSchema);

module.exports = Owner;