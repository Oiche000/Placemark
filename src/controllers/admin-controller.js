import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const adminController = {

  index: {
    auth: false,
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      if (!loggedInUser || !loggedInUser.isAdmin) {
        return h.response("Access denied").code(403);
      }

      const users = await db.userStore.getAllUsers();
      return h.view("admin-view", {
        title: "Admin Dashboard",
        user: loggedInUser,
        users: users,
      });
    }
  }

};  