import { emitWarning } from "process";
import { db } from "../models/db.js";
import { analyticsUtils } from "../models/analytics.js";
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
      const stats = analyticsUtils.generateStats(allPlacemarks, users);

      return h.view("admin-view", {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
        totalPlacemarks: allPlacemarks.length,
        stats: stats,
      });
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser || !loggedInUser.isAdmin) {
        return h.redirect("/login");
      }

      const userId = request.params.id;
      if (userId === loggedInUser._id) {
        console.log("Admin users cannot delete their own account.");  
        return h.redirect("/admin-view", {
          title: "Admin Dashboard",
          user: loggedInUser,
          users: await db.userStore.getAllUsers(),
          errors: [{message: "Admin users cannot delete their own account."}],
        }).code(400);
      }
      
      // cascade delete placemarks associated with the user is handled in the user store's deleteUserById method
      const usersPlacemarks = await db.placemarkStore.getUserPlacemarks(userId);
      for (let i =0; i < usersPlacemarks.length; i+=1) {
        // eslint-disable-next-line no-await-in-loop
        await db.placemarkStore.deletePlacemarkById(usersPlacemarks[i]._id);
        console.log(`Deleted placemark with ID: ${usersPlacemarks[i]._id} for user: ${userId}`);
      }
      const userToDelete = await db.userStore.getUserById(userId);
      await db.userStore.deleteUserById(userId);
      console.log(`Deleted user ${userToDelete.firstName} with ID: ${userId}`);

      return h.redirect("/admin");
    },
  },

};  