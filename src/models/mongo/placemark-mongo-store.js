import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemarks = await Placemark.find().lean();
    return placemarks;
  },

  async getPlacemarkById(id) {
    if (Mongoose.isValidObjectId(id)) {
      const placemark = await Placemark.findOne({ _id: id }).lean();
      return placemark;
    }
    return null;
  },

  async addPlacemark(placemark) {
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },

  async getUserPlacemarks(id) {
    const placemark = await Placemark.find({ userId: id }).lean();
    return placemark;
  },

  async getPlacemarksByCategory(category) {
    const placemark = await Placemark.find({ category: category }).lean();
    return placemark;
  },

  async deletePlacemarkById(id) {
    try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id for placemark deletion", error);
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemark(placemarkId, updatedPlacemark) {
    const placemark = await Placemark.findById(placemarkId);
    if (!placemark) return null;
    placemark.name = updatedPlacemark.name;
    placemark.description = updatedPlacemark.description;
    placemark.lat = updatedPlacemark.lat;
    placemark.lng = updatedPlacemark.lng;
    placemark.image = updatedPlacemark.image;
    placemark.timeRequired = updatedPlacemark.timeRequired;
    // placemark.amenities = updatedPlacemark. amenities;
    placemark.category = updatedPlacemark.category;
    await placemark.save();
    return placemark.toObject();
  },
};
