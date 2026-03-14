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
        userId: loggedInUser._id, 
        name: request.payload.name,
        description: request.payload.description,
        category: request.payload.category,
        lat: Number(request.payload.lat),
        lng: Number(request.payload.lng),
        image: request.payload.image || "",
        timeRequired: request.payload.timeRequired || "",
        // // amenities: request.payload.// amenities || "",
      };
      console.log("adding new placemark: ", newPlacemark);
      await db.placemarkStore.addPlacemark(loggedInUser._id, newPlacemark);
      return h.redirect("/dashboard");
    },
  },

  deletePlacemark: {
    handler: async function(request, h) {
      /* const loggedInUser = request.auth.credentials; */

      const placemarkId = request.params.id;
      await db.placemarkStore.deletePlacemarkById(placemarkId);
      /* await db.placemarkStore.deletePlacemarkById(request.params.id); */
      /* console.log(`Deleted placemark with ID: ${request.params.id} for user: ${loggedInUser._id}`); */
      return h.redirect("/dashboard");
    },
  },

  updatePlacemark: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const placemarkId = request.params.id;
        const originalPlacemark = await db.placemarkStore.getPlacemarkById(placemarkId);
        return h.view("edit-placemark-view", {
          title: "Update Error", 
          errors: error.details,
          placemark: originalPlacemark
        }).takeover().code(400);
      },
    },
    handler: async function(request, h) {
      const placemarkId = request.params.id;

      const updatedPlacemarkData = {
        name: request.payload.name,
        description: request.payload.description,
        lat: Number(request.payload.lat),
        lng: Number(request.payload.lng),
        image: request.payload.image,
        category: request.payload.category,
        timeRequired: request.payload.timeRequired,
        // amenities: request.payload.// amenities,
      };
      console.log("updating placemark with id: ", placemarkId, "with data: ", updatedPlacemarkData);
      await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemarkData);
      return h.redirect(`/placemark/${placemarkId}`);
    },
  },

  editPlacemark: {
    handler: async function(request, h) {
      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      const viewData = {
        title: `Edit ${placemark.name} Placemark`,
        placemark: placemark,
        categories: availableCategories,
      };

      return h.view("edit-placemark-view", viewData);
    },        // or partials/edit-placemark
  },

  categoryView: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const categoryName = request.params.category;
      // const all placemarks = await db.placemarkStore.getUserPlacemarks(loggedInUser._id);
      // const categoryPlacemarks = all placemarks.filter(p => p.category === categoryName);
      const placemarks = await db.placemarkStore.getPlacemarksByCategory(category);
      const viewData = {
        title: `${category} Locations`,
        user: loggedInUser,
        placemarks: placemarks, // categoryPlacemarks
        categories: availableCategories,   // categoryName
      };
      return h.view("category-view", viewData);
    },
  },

};
