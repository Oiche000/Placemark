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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1); // comemented out for render
}
const swaggerOptions = {
  info: {
    title: "Placemark API",
    version: "5.0",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

async function init() {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",  // added for AWS
});

await server.register(Cookie); 
await server.register(jwt);

await server.register([
  Inert,
  Vision,
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
]);

server.validator(Joi);  
  
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

db.init("mongo");
server.route(webRoutes);
server.route(apiRoutes);
await server.start();
console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
console.log(err);
process.exit(1);
});

init();
