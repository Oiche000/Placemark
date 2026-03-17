import { db } from "../models/db.js";
import { PlacemarkSpec, availableCategories } from "../models/joi-schemas.js";
import { getCategoryDesign } from "./utils.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      console.log("Logged in user:", loggedInUser);

      // use url params to filter categories
      const filter = request.query.filter || "my";
      const categoryFilter = request.query.category;
      const allUsers = await db.userStore.getAllUsers();

      let placemarksToDisplay = [];

      // Get correct data based on the filter
      if (categoryFilter) {
        // only a specific category
        placemarksToDisplay = await db.placemarkStore.getPlacemarkByCategory(categoryFilter);
      } else if (filter === "all") {
        // everything
        placemarksToDisplay = await db.placemarkStore.getAllPlacemarks();
      } else {
        // only the logged-in user's placemarks
        placemarksToDisplay = await db.placemarkStore.getUserPlacemarks(loggedInUser._id);
      }

      // update placemarks to add icons and creator
      if (placemarksToDisplay) {
        placemarksToDisplay.forEach((pm) => {
          
          // Add the design
          pm.design = getCategoryDesign(pm.category);
          
          // get the matching user from  users list
          // wrap the IDs in String()  in case they are Mongo ObjectIds
          const creator = allUsers.find((user) => String(user._id) === String(pm.userId));
          
          // Attach the name
          pm.creatorName = creator ? `${creator.firstName} ${creator.lastName}` : "Unknown Explorer";
        });
      }
    
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        placemarks: placemarksToDisplay,
        categories: availableCategories,
        /* allPlacemarks: allPlacemarks,  REMOVE ! */
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addPlacemark: {
    validate: {
          payload: PlacemarkSpec,
          options: { abortEarly: false }, 
          failAction: async function (request, h, error) {
            console.log("Joi Validation Failed:", error.details);
            const loggedInUser = request.auth.credentials;
            const placemarks = await db.placemarkStore.getUserPlacemarks(loggedInUser._id);
            
            return h.view("dashboard-view", {
              title: "Add Placemark error", 
              errors: error.details,
              user: loggedInUser,
              placemarks: placemarks,
              categories: availableCategories,

            }).takeover().code(400);
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
        image: /* request.payload.image || */ "",
        timeRequired: request.payload.timeRequired || "",
        // // amenities: request.payload.// amenities || "",
      };
      console.log("adding new placemark: ", newPlacemark);
      const addedPlacemark = await db.placemarkStore.addPlacemark(loggedInUser._id, newPlacemark);
      return h.redirect(`/placemark/${addedPlacemark._id}`);
    },
  },

  deletePlacemark: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;

      const placemarkId = request.params.id;
      const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
      if (placemark.image) {
      // cascade delete: clean up cloud storage when deleting local data
      await imageStore.deleteImage(placemark.image);
    }
      await db.placemarkStore.deletePlacemarkById(placemarkId);
      console.log(`Deleted placemark with ID: ${request.params.id} for user: ${loggedInUser._id}`);
      return h.redirect("/dashboard");
    },
  },
};
