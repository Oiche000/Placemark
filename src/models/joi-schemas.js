import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().lowercase().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
  isAdmin: Joi.boolean().default(false),

}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
  
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const UserUpdateSpec = UserSpec.keys({

  password: Joi.string().allow("").optional(),          // allow empty so can leave blank for unchanged in views
  isAdmin: Joi.boolean().truthy("on").default(false),   // truthy allows extra values to be considered boolean
}).label("UserUpdateDetails");

export const availableCategories = ["Swimming", "Hiking", "Kayaking", "Heritage", "Caving", "Camping", "Surfing", "Stargazing"];

export const PlacemarkSpec = Joi.object()
  .keys({
    name: Joi.string().required().example("The Forty Foot"),
    description: Joi.string().required().example("Famous deep-water swimming spot.").max(200),
    category: Joi.string().required().valid(...availableCategories).example("Swimming"),
    lat: Joi.number().required().example(53.289).min(-90).max(90),
    lng: Joi.number().required().example(-6.115).min(-180).max(180),
    image: Joi.string().optional().example("https://example.com/image.jpg"),
    timeRequired: Joi.string().optional().valid("1 hour", "2 hours", "Half day", "Full day", "Overnight").example("2 hours"),
    // amenities: Joi.array().items(Joi.string()).optional().example(["Changing Rooms", "Ladders"]),
    
  }).label("PlacemarkDetails");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
  userId: IdSpec.description("ID of the user who created the placemark"),
}).label("PlacemarkDetailsPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");

export const CategorySpec = Joi.string().valid(...availableCategories).required().example("Deep Water").label("Category");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");

