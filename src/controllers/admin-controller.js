import { emitWarning } from "process";
import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const adminController = {

  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if ( !loggedInUser ||  !loggedInUser.isAdmin) {
       
        return h.redirect("/login");
      }

      const users = await db.userStore.getAllUsers();
      for (let i = 0; i < users.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const placemarks = await db.placemarkStore.getUserPlacemarks(users[i]._id);
        users[i].placemarkCount = placemarks.length;
      }

      const allPlacemarks = await db.placemarkStore.getAllPlacemarks();


      return h.view("admin-view", {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
        totalPlacemarks: allPlacemarks.length,
      });
    },
  },

  showAnalytics: {

    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const allUsers = await db.userStore.getAllUsers();
      const allPlacemarks = await db.placemarkStore.getAllPlacemarks();

        const viewData = {
          title: "Admin Dashboard",
          user: loggedInUser,
          users: allUsers,
          analytics: {
            totalUsers: allUsers.length,
            totalPlacemarks: allPlacemarks.length,
          }
        };
      const stats = {
        userCount: await User.countDocuments(),
        placemarkCount: await Placemark.countDocuments(),
        
        // Advanced query: Counts per category
        categoryBreakdown: await Placemark.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } }
        ])
      };
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser || !loggedInUser.isAdmin) {
        return h.redirect("/login");
      }

      // cascade delete placemarks associated with the user is handled in the user store's deleteUserById method

      const userId = request.params.id;

      if (userId === loggedInUser._id) {
        emitWarning("Admin users cannot delete their own account.");
        console.log("Admin users cannot delete their own account.");  
        return h.redirect("/admin", {
          title: "Admin Dashboard",
          user: loggedInUser,
          users: await db.userStore.getAllUsers(),
          errors: "Admin users cannot delete their own account."
        }).takeover().code(400);
      }
      
      const usersPlacemarks = await db.placemarkStore.getUserPlacemarks(userId);
      for (let i =0; i < usersPlacemarks.length; i+=1) {
        // eslint-disable-next-line no-await-in-loop
        await db.placemarkStore.deletePlacemarkById(usersPlacemarks[i]._id);
        console.log(`Deleted placemark with ID: ${usersPlacemarks[i]._id} for user: ${userId}`);
      }
      await db.userStore.deleteUserById(userId);
      console.log(`Deleted user ${request.auth.credentials.firstName} with ID: ${userId}`);

      return h.redirect("/admin");
    },
  },

};  