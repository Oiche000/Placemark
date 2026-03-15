import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  // ---- User API ----
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

  async updateUser(id, user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users/${id}`, user);
    return res.data;
  },

  // ---- Placemark API ----
  async createPlacemark(placemark) {
    const res = await axios.post(`${this.placemarkUrl}/api/placemarks`, placemark);
    return res.data;
  },

  async getPlacemark(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res.data;
  },

  async getAllPlacemarks() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },

  async updatePlacemark(id, placemark) {
    const res = await axios.post(`${this.placemarkUrl}/api/placemarks/${id}`, placemark);
    return res.data;
  },

  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },

  async deletePlacemarkById(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res;
  },  // want for deletebyID to return the whole response as there is no data so returns res.data gives undefined

  async authenticate(user) {
    const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  async getAdminData() {
    const res = await axios.get(`${this.placemarkUrl}/api/admin`);
    return res.data;
  },


  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },
};
