import axios from "axios";
import {db } from "../models/db.js";
import { PlacemarkSpec, availableCategories } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";
import { getCategoryDesign } from "./utils.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      /* add placemark variable here to pass to the view */
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      placemark.design = getCategoryDesign(placemark.category);

      let currentWeather = null;
      let forecast = null;

      try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${placemark.lat}&lon=${placemark.lng}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const currentResponse = await axios.get(currentUrl);
        
        currentWeather = {
          temp: Math.round(currentResponse.data.main.temp),
          feelsLike: Math.round(currentResponse.data.main.feels_like),
          clouds: currentResponse.data.weather[0].description,
          windSpeed: currentResponse.data.wind.speed,
          icon: currentResponse.data.weather[0].icon,
        };
        
        console.log("Current Weather:", currentWeather);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${placemark.lat}&lon=${placemark.lng}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
        const forecastResponse = await axios.get(forecastUrl);
        const dayForecast = forecastResponse.data.list.slice(0, 8); // Get the next 8 forecast entries (24 hours)
        const forecastQuarters = dayForecast.filter((item, index) => index % 2 === 1); // Get every 2nd entry for 4 chunks of 6 hours
        const weatherForecast = forecastQuarters.map(timeslot => ({
            time: timeslot.dt_txt.split(" ")[1].substring(0, 5),  // split by space to get the time, and substring to drop the seconds.
            temp: Math.round(timeslot.main.temp),
            description: timeslot.weather[0].description,
            icon: timeslot.weather[0].icon,
        }));
        forecast = weatherForecast;

        console.log("Weather Forecast:", forecast);
       
      } catch (err) {
        console.error("Weather API Error:", err);
      }
   
      const viewData = {
        title: "Placemark",
        placemark: placemark,
        currentWeather: currentWeather,
        forecast: forecast,
        user: loggedInUser,
      };
      return h.view("placemark-view", viewData);
    },
  },

  updatePlacemark: {
      validate: {
        payload: PlacemarkSpec,
        options: { abortEarly: false },
        failAction: async function (request, h, error) {
          const placemarkId = request.params.id;
          const originalPlacemark = await db.placemarkStore.getPlacemarkById(placemarkId);
          return h.view("edit-placemark-view", {
            title: "Update Placemark error", 
            errors: error.details,
            placemark: originalPlacemark,
            categories: availableCategories,
          }).takeover().code(400);
        },
      },
      handler: async function(request, h) {
        const placemarkId = request.params.id;
  
        const updatedPlacemarkData = {
          name: request.payload.name,
          description: request.payload.description,
          lat: Number(request.payload.lat),
          lng: Number(request.payload.lng),
          image: request.payload.image || DEFAULT_IMAGE,
          category: request.payload.category,
          timeRequired: request.payload.timeRequired,
          // amenities: request.payload.// amenities,
        };
        console.log("updating placemark with id: ", placemarkId, "with data: ", updatedPlacemarkData);
        await db.placemarkStore.updatePlacemark(placemarkId, updatedPlacemarkData);
        return h.redirect(`/placemark/${placemarkId}`);
      },
    },
  
    editPlacemark: {
      handler: async function(request, h) {
        const placemarkId = request.params.id;
        const placemark = await db.placemarkStore.getPlacemarkById(placemarkId);
        const viewData = {
          title: `Edit ${placemark.name} Placemark`,
          placemark: placemark,
          categories: availableCategories,
          isEditing: true, // Add this flag to indicate in editing mode for playlist view
        };
  
        return h.view("placemark-view", viewData);
      },        // or partials/edit-placemark
    },

    uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.image = url;
          await db.placemarkStore.updatePlacemark(placemark._id, placemark);
        }
        return h.redirect(`/placemark/${placemark._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/placemark/${request.params.id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  updateImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        // Delete old image from Cloudinary before uploading new one
        if (placemark.image) {
          await imageStore.deleteImage(placemark.image);
        }
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(file);
          placemark.image = url;
          await db.placemarkStore.updatePlacemark(placemark._id, placemark);
        }
        return h.redirect(`/placemark/${placemark._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/placemark/${request.params.id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 20971520,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
      await imageStore.deleteImage(placemark.image);
      placemark.image = "";
      await db.placemarkStore.updatePlacemark(placemark._id, placemark);
      return h.redirect(`/placemark/${placemark._id}`);
    },
  },

};