import {db } from "../models/db.js";
import { PlacemarkSpec, availableCategories } from "../models/joi-schemas.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      /* add placemark variable here to pass to the view */
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
   
      const viewData = {
        title: "Placemark",
        placemark: placemark,
      };
      return h.view("placemark-view", viewData);
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
        const viewData = {
          title: `Edit ${placemark.name} Placemark`,
          placemark: placemark,
          categories: availableCategories,
        };
  
        return h.view("edit-placemark-view", viewData);
      },        // or partials/edit-placemark
    },

};