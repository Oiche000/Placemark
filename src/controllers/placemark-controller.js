import {db } from "../models/db.js";

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

};