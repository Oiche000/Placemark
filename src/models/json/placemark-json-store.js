import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const placemarkJsonStore = {
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  async addPlacemark(userId, placemark) {
    await db.read();
    placemark._id = v4();
    placemark.userId = userId;
    db.data.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  async getPlacemarkById(id) {
    await db.read();
    let p = db.data.placemarks.find((placemark) => placemark._id === id);
    if (!p) p = null;
    return p;
  },

  async getUserPlacemarks(userid) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.userId === userid);
  },

  async getPlacemarkByCategory(category) {
    await db.read();
    return db.data.placemarks.filter((placemark) => placemark.category === category);
  },

  async deletePlacemarkById(id) {
    await db.read();
    const index = db.data.placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) db.data.placemarks.splice(index, 1);
    await db.write();
  },

  async deleteAllPlacemarks() {
    db.data.placemarks = [];
    await db.write();
  },

  async updatePlacemark(placemarkID, updatedPlacemark) {
    await db.read();
    const placemark = db.data.placemarks.find((p) => p._id === placemarkID);
    if (!placemark) return null;
    placemark.name = updatedPlacemark.name;
    placemark.description = updatedPlacemark.description;
    placemark.lat = updatedPlacemark.lat;
    placemark.lng = updatedPlacemark.lng;
    placemark.image = updatedPlacemark.image;
    placemark.timeRequired = updatedPlacemark.timeRequired;
    placemark.// amenities = updatedPlacemark.// amenities;
    placemark.category = updatedPlacemark.category;
    await db.write();
    return placemark;
  },
};