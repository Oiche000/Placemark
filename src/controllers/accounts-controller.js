import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

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
        return h.view("signup-view", {title: "sign up error", error: error.details }).takeover().code(400);
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
        return h.view("login-view", {title: "Login error", error: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {

    /*   // --- DEBUGGING START ---
      console.log("------------------------------------------------");
      console.log("What tools are on this request?");
      console.log(Object.keys(request)); // prints: ['params', 'auth', 'cookieAuth', etc...]
      
      console.log("Is cookieAuth real?", request.cookieAuth); // Check if the plugin worked
      console.log("------------------------------------------------");
      // --- DEBUGGING END --- */
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
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
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false }, 
      failAction: function (request, h, error) {
        const userId = request.params.id;
        const originalUser = db.userStore.getUserById(userId);
        return h.view("profile-view", {
          title: "Update Profile error", 
          error: error.details,
          user: originalUser
        }).takeover().code(400);
      },
    },
    handler: async function(request, h) {
      const userId = request.params.id;
      const updatedUser = request.payload;
      await db.userStore.updateUser(userId, updatedUser);
      return h.redirect("/dashboard");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
