import { db } from "../models/db.js";
import { UserSpec, UserUpdateSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth:  false,  /* no auth needed to view main page, otherwise couldnt get to login form */            
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth:  false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth:  false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false }, 
      failAction: function (request, h, error) {
        console.log("Joi Validation Failed:", error.details);
        return h.view("signup-view", {title: "sign up error", errors: error.details }).takeover().code(400);
      },
    },
    /* Check the "payload" (the form data) against "UserSpec"
    // "takeover()" means: STOP! Do not run the handler function below.
        // Instead, show the signup view again and send a 400 (Bad Request) error code. 
        // see all errors, we can set an abortEarly option to false: 
        */
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth:  false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },

  login: {
    auth:  false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false }, 
      failAction: function (request, h, error) {
        console.log("Joi Validation Failed:", error.details);
        return h.view("login-view", { 
          title: "Login error", 
          errors: error.details }).takeover().code(401);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      if (user.isAdmin) {
        console.log(`Admin user ${user.firstName} logged in with ID: ${user._id}`);
        return h.redirect("/admin");
      }
      console.log(`User ${user.firstName} logged in with ID: ${user._id}`);
      return h.redirect("/dashboard");
    },
  },

  logout: {
    auth: false,
   
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  updateUser: {
    auth: "session",
    validate: {
      payload: UserUpdateSpec,        // change so that will handle empty password
      options: { abortEarly: false }, 
      failAction: async function (request, h, error) {
        const userId = request.params.id;  
        const originalUser = await db.userStore.getUserById(userId);

        return h.view("settings-view", {
          title: "Update Profile error", 
          errors: error.details,
          user: originalUser,
          loggedInUser: request.auth.credentials,
        }).takeover().code(400);
      },
    },
    handler: async function(request, h) {
      try{
        const userId = request.params.id;   // user to edit        
        const loggedInUser = request.auth.credentials;
        const newData = request.payload;

        const user = await db.userStore.getUserById(userId);
        user.firstName = newData.firstName;
        user.lastName = newData.lastName;
        user.email = newData.email;

        // Handle Password 
        if (newData.password && newData.password !== "") {
          user.password = newData.password;
        }

        // Handle Admin Privileges 
        if (loggedInUser.isAdmin) {
          // if admin, keep admin true
          if (loggedInUser._id.toString() === userId.toString()) {
            user.isAdmin = true;
          } else {
          // Only an admin can change the isAdmin status (on for tick box in view)
          user.isAdmin = newData.isAdmin ;
          }
        } 
        await db.userStore.updateUser(userId, user);

        // if admin edited someone else, return to admin dashboard
        if (loggedInUser.isAdmin && loggedInUser._id.toString() !== userId.toString()) {
          return h.redirect("/admin")
        }
        // otherwise redirect to dashboard
        return h.redirect("/dashboard");
      } catch (err) {
        console.error("Update user error:", err);
        return h.redirect("/");
      }
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },

  deleteAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;

      await db.userStore.deleteUserById(loggedInUser._id);

      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  showSettings: {
    handler: async function (request, h) {
      // Get the currently logged-in user
      const loggedInUser = request.auth.credentials;
      let userToEdit = loggedInUser;

      // if it is admin (because they are editing a user with id in URL), they are editing someone else
      if (request.params.id) {
        userToEdit = await db.userStore.getUserById(request.params.id);
      }
      // boolean for if admin edits self
      isSelf = loggedInUser._id.toString() === userToEdit._id.toString();
      
      return h.view("settings-view", { 
        title: "Settings", 
        user: userToEdit, 
        loggedInUser: loggedInUser,
        isSelf: isSelf,
      });
    },
  },
};
