import Mongoose from "mongoose";
import { availableCategories } from "../joi-schemas.js";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  name: String,
  description: String,
  category: { 
    type: String, 
    enum: availableCategories 
  },
  lat: Number,
  lng: Number,
  image: String,
  timeRequired: String,
  // amenities: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    // required: true, // This makes it mandatory
  },
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);