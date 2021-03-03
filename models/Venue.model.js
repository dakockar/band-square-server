const { Schema, model } = require("mongoose");

const VenueSchema = new Schema({
  title: String,
  imgUrl: String,
  location: String,
  size: Number,
  owner: { type: Schema.Types.ObjectId, ref: "Owner" }
})

const Venue = model("Venue", VenueSchema);

module.exports = Venue;