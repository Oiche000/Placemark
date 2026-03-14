import {db } from "../models/db.js";
import { PlacemarkSpec, availableCategories } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

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
        failAction: async function (request, h, error) {
          const placemarkId = request.params.id;
          const originalPlacemark = await db.placemarkStore.getPlacemarkById(placemarkId);
          return h.view("edit-placemark-view", {
            title: "Update Placemark error", 
            errors: error.details,
            placemark: originalPlacemark,
            categories: availableCategories,
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
          isEditing: true, // Add this flag to indicate in editing mode
        };
  
        return h.view("placemark-view", viewData);
      },        // or partials/edit-placemark
    },

    uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.image = url;
          await db.placemarkStore.updateplacemark(placemark);
        }
        return h.redirect(`/placemark/${placemark._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/placemark/${placemark._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

};