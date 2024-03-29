const { Schema, model } = require("mongoose");

const VenueSchema = new Schema(
  {
    title: String,
    imgUrl: Array,
    location: String,
    size: Number,
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner" },
    rating: Array,
  }
)

const Venue = model("Venue", VenueSchema);

module.exports = Venue;