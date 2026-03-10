import Mongoose from "mongoose";
import Boom from "@hapi/boom";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  name: String,
  description: String,
  category: String,
  lat: Number,
  lng: Number,
  image: String,
  timeRequired: String,
  amenities: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);