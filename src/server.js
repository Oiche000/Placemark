import dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import Cookie from "@hapi/cookie";
import Joi from "joi";
import Inert from "@hapi/inert";
import HapiSwagger from "hapi-swagger";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
/* import { apiRoutes } from "./api-routes.js";
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}
const swaggerOptions = {
    info: {
      title: "Playtime API",
      version: "0.1",
    },
  };


async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    
  });

  
  
await server.register(Cookie); /*  vision is for Hapi to render HTML, uses JSON only otherwise */
await server.register(jwt);
await server.register([
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
]);
/*  await server.register(Cookie); /* cookie is used for user login, await to stall until they are loaded in */
/*   await server.register(Inert);  */

server.validator(Joi);  /* add joi as the validator for hapi */
  
server.views({
  engines: {
    hbs: Handlebars,
  },
  relativeTo: __dirname,                /* look for files in same folder */
  path: "./views",                      /* main views folder */  
  layoutPath: "./views/layouts",        /* layouts folder */
  partialsPath: "./views/partials",     /* partials folder */
  layout: true,                    /* use layout file */    
  isCached: false,               /* reload file on refresh */
});

server.auth.strategy("session", "cookie", {
  cookie: {
    name: process.env.cookie_name,
    password: process.env.cookie_password,
    isSecure: false,
  },
  
  redirectTo: "/",
  validate: accountsController.validate
});

server.auth.strategy("jwt", "jwt", {
  key: process.env.cookie_password,
  validate: validate,
  verifyOptions: { algorithms: ["HS256"] },
});

server.auth.default("session");

/*  means that auth is required for all routes, and so can only be activated
    if the user is logged in i.e. the cookie is active and validate method
    returns true from accountsController.validate function.
    server.auth.strategy: This creates a security rule named "session".

    name: "playtime": The name of the cookie stored in the browser.

    password: A long secret string used to encrypt the cookie so hackers can't fake a login.

    isSecure: false: Allows the cookie to work over HTTP (localhost). If true, it requires HTTPS.

    redirectTo: "/": "If a user tries to visit a protected page but isn't logged in, kick them back to the home page."

    validate: "Every time the user clicks a link, run this function (accountsController.validate) to make sure they still exist in our database."

    server.auth.default("session"): "Apply this security rule to every route by default, unless I say otherwise." 
*/

db.init("mongo");
server.route(webRoutes);
server.route(apiRoutes);
await server.start();
console.log("Server running on %s", server.info.uri);
}
  /* db.init(): Starts your database (loads the JSON or connects to MongoDB).

      server.route(webRoutes): Loads your map of URLs (Routes).

      server.start(): Actually turns the server on.

      console.log: Prints the success message to your terminal.
  */

process.on("unhandledRejection", (err) => {
console.log(err);
process.exit(1);
});

init();
