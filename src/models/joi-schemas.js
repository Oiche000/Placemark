import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

const availableCategories = ["Deep Water", "Cliff Jumping", "Scenic Views", "Family Friendly", "Hidden Gems"];

export const PlacemarkSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("The Forty Foot"),
    description: Joi.string().required().example("Famous deep-water swimming spot."),
    category: Joi.string().required().valid(...availableCategories).example("Deep Water"),
    lat: Joi.number().required().example(53.289),
    lng: Joi.number().required().example(-6.115),
    // Optional Extended Field
    amenities: Joi.array().items(Joi.string()).optional().example(["Changing Rooms", "Ladders"]),
  }).label("PlacemarkDetails");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkDetailsPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");