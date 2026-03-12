import Boom from "@hapi/boom";
import { PlacemarkArraySpec, IdSpec, PlacemarkSpec, PlacemarkSpecPlus } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";

export const placemarkApi = {
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const placemark = await db.placemarkStore.addPlacemark(request.payload);
        if (placemark) {
          return h.response(placemark).code(201);
        }
        return Boom.badImplementation("error creating placemark");
      } catch (err) {
        console.error("Placemark Create Error:", err);
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "Create a Placemark",
    notes: "Returns the newly created placemark",
    validate: { payload: PlacemarkSpec, failAction: validationError },
    response: { schema: PlacemarkSpecPlus, failAction: validationError },
    
  },

  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const placemarks = await db.placemarkStore.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "get all placemarkApi",
    notes: "returns details of all placemarkApi",
    response: { schema: PlacemarkArraySpec, failAction: validationError }
  },

  findOne: {
    auth: {
      strategy: "jwt",
    }, 
    handler: async function(request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);

        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        return placemark;
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id")
      }
    },
    tags: ["api"],
    description: "Get a specific placemark",
    notes: "Returns a placemark details",
    response: { schema: PlacemarkSpecPlus, failAction: validationError },
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request,h) {
      try {
        await db.placemarkStore.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        console.error("Placemark DeleteAll Error:", err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all placemarkApi",
    notes: "All placemarkApi removed from Playtime",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request,h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        await db.placemarkStore.deletePlacemarkById(placemark._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id");
      }
    },
    tags: ["api"],
    description: "Delete a placemarkApi",
    notes: "A placemark removed from Playtime",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        const placemark = await db.placemarkStore.updatePlacemarks(request.params.id, request.payload);
        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        return h.response(placemark).code(200);
      } catch (err) {
        console.error("Placemark Update Error:", err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Update a Placemark",
    notes: "Updates a placemark's details",
    validate: { payload: UserCredentialsSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError },
  },

  authenticate: {
    auth: false,
    handler: {

    },

  },

};