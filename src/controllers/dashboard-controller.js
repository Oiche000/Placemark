import { db } from "../models/db.js";
import { PlacemarkSpec, availableCategories } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      console.log("Logged in user:", loggedInUser);
      const placemarks = await db.placemarkStore.getUserPlacemarks(loggedInUser._id);
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        placemarks: placemarks,
        categories: availableCategories,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlacemark: {
    validate: {
          payload: PlacemarkSpec,
          options: { abortEarly: false }, 
          failAction: function (request, h, error) {
            console.log("Joi Validation Failed:", error.details);
            return h.view("dashboard-view", {title: "Add Placemark error", error: error.details }).takeover().code(400);
          },
        },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newPlacemark = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.placemarkStore.addPlacemark(newPlacemark);
      return h.redirect("/dashboard");
    },
  },

  deletePlacemark: {
    handler: async function(request, h) {
      /* const loggedInUser = request.auth.credentials; */
      const placemark = await db.placemarkStore.deletePlacemarkById(request.params.id);
      /* await db.placemarkStore.deletePlacemarkById(request.params.id); */
      /* console.log(`Deleted placemark with ID: ${request.params.id} for user: ${loggedInUser._id}`); */
      return h.redirect("/dashboard");
    },
  },

  updatePlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        const placemarkId = request.params.id;
        const originalPlacemark = db.placemarkStore.getPlacemarkById(placemarkId);
        return h.view("dashboard-view", {
          title: "Update Placemark error", 
          error: error.details,
          placemark: originalPlacemark
        }).takeover().code(400);
      },
    },
    handler: async function(request, h) {
      const placemarkId = request.params.id;

      const updatedPlacemarkData = {
        name: request.payload.name,
        description: request.payload.description,
        lat: request.payload.lat,
        lng: request.payload.lng,
        image: request.payload.image,
        category: request.payload.category,
        timeRequired: request.payload.timeRequired,
        amenities: request.payload.amenities,
      };
      await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemarkData);
      return h.redirect("/dashboard");
    },
  },

  editPlacemark: {
    handler: async function(request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      return h.view("edit-placemark-view", { title: "Edit Placemark", placemark: placemark });
    },        // or partials/edit-placemark
  },

};
