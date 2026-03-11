import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlacemarks() {
    return placemarks;
  },

  async addPlacemark(placemark) {
    placemark._id = v4();
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarkById(id) {
    const list = placemarks.find((placemark) => placemark._id === id);
    if (!list) {
      return null;
    }
    return list;
  },

  async deletePlacemarkById(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) placemarks.splice(index, 1);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },

  async getUserPlacemarks(userid) {
    return placemarks.filter((placemark) => placemark.userId === userid);
  },

  async getPlacemarksByCategory(userid, category) {
    const userPlacemarks = await this.getUserPlacemarks(userid);
    return userPlacemarks.filter((p) => p.category === category);
  },

  async updatePlacemarks(placemarkId, updatedPlacemark) {
    const placemark = placemarks.find((p) => p._id === placemarkId);
    if (!placemark) return null;
    placemark.name = updatedPlacemark.name;
    placemark.description = updatedPlacemark.description;
    placemark.lat = updatedPlacemark.lat;
    placemark.lng = updatedPlacemark.lng;
    placemark.image = updatedPlacemark.image;
    placemark.timeRequired = updatedPlacemark.timeRequired;
    placemark.amenities = updatedPlacemark.amenities; 
    placemark.category = updatedPlacemark.category; 
    return placemark;
  },
};
