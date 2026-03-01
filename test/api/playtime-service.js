import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  async createPlacemark(placemark) {
    const res = await axios.post(`${this.placemarkUrl}/api/placemark`, placemark);
    return res.data;
  },

  async getPlacemark(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/placemark/${id}`);
    return res.data;
  },

  async getAllPlacemarks() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemark`);
    return res.data;
  },

  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemark`);
    return res.data;
  },

  async deletePlacemarkById(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemark/${id}`);
    return res;
  },
  /* want for deletebyID to return the whole response as there is no data so returns res.data gives undefined
   */

  async createTrack(id, track) {
    console.log(`URL: ${this.placemarkUrl}/api/placemark/${id}/tracks`);
    const res = await axios.post(`${this.placemarkUrl}/api/placemark/${id}/tracks`, track);
    return res.data;
  },

  async getAllTracks() {
    const res = await axios.get(`${this.placemarkUrl}/api/tracks`);
    return res.data;
  },

  async getTracksById(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/tracks/${id}`);
    return res.data;
  },

  async deleteAllTracks() {
    const res = await axios.delete(`${this.placemarkUrl}/api/tracks`);
    return res.data;
  },

  async deleteTrackById(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/tracks/${id}`);
    return res;
  },

  async authenticate(user) {
    const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },
};
