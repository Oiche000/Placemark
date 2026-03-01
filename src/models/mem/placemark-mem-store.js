import { v4 } from "uuid";
import { trackMemStore } from "./track-mem-store.js";

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
    list.tracks = await trackMemStore.getPlacemarkTracks(list._id);
    return list;
  },

  /* need to make sure that tracks are parts of placemarks */

  async deletePlacemarkById(id) {
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) {
    placemarks.splice(index, 1);
    }
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  },

  async getUserPlacemarks(userid) {
    return placemarks.filter((placemark) => placemark.userid === userid);
  },

  async updatePlacemarks(placemarkId, updatedPlacemark) {
    const index = placemarks.findIndex((placemark) => placemark._id === placemarkId);
    if (index !== -1) {
      placemarks[index] = { ...placemarks[index], ...updatedPlacemark };
    }
    return placemarks[index];  // need to return the updated placemark? ?? 
  },
};
