export const maggie = {
  firstName: "Maggie",
  lastName: "Simpson",
  email: "maggie@simpson.com",
  password: "secret",
};

export const maggieCredentials = {
  email: "maggie@simpson.com",
  password: "secret"
};

export const adminUser = {
  firstName: "admin",
  lastName: "Simpson",
  email: "admin@simpson.com",
  password: "secret",
  isAdmin: true,
};

export const adminCredentials = {
  email: "admin@simpson.com",
  password: "secret",
};

export const freshUser = {
  firstName: "Ned",
  lastName: "Flanders",
  email: "ned@flanders.com",
  password: "secretpassword"
};

export const freshUser2 = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@mail.com",
  password: "secretpassword"
};

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret",
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret",
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret",
  },
];


export const testPlacemark = {
  name: "The Forty Foot",
  description: "Historic sea-swimming inlet.",
  category: "Swimming",
  lat: 53.2891,
  lng: -6.1162,
  timeRequired: "1 hour",
  // amenities: ["Changing Rooms", "Ladders"]
};

export const testPlacemarks = [
  { 
    name: "Carrauntoohil", 
    description: "Highest peak.", 
    category: "Hiking", 
    lat: 52.0000, 
    lng: -9.7000, 
    timeRequired: "Full day", 
    // amenities: ["Parking"] 
  },
  { 
    name: "Aillwee Caves", 
    description: "Show cave.", 
    category: "Caving", 
    lat: 53.0800, 
    lng: -9.1400, 
    timeRequired: "2 hours", 
    // amenities: ["Cafe", "Toilets"] 
  },
  { 
    name: "Lough Hyne", 
    description: "Marine reserve.", 
    category: "Kayaking", 
    lat: 51.5000, 
    lng: -9.2900, 
    timeRequired: "Half day", 
    // amenities: ["Pier"] 
  }
];

export const testPlacemarks2 = [
  {
    name: "Newgrange",
    description: "Ancient passage tomb built during the Neolithic period.",
    category: "Heritage",
    lat: 53.6947,
    lng: -6.4463,
    image: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    timeRequired: "Half Day",
    // amenities: ["Guided Tours", "Cafe"],
    userId: "->users.marge"
  },
  {
    name: "Cliffs of Moher",
    description: "Spectacular sea cliffs on the Atlantic coast trail.",
    category: "Hiking",
    lat: 52.9719,
    lng: -9.4265,
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Forty_Foot_Dublin.jpg",
    timeRequired: "2 hours",
    // amenities: ["Parking", "Visitor Centre", "Pathways"],
    userId: "->users.marge"
  },
  {
    name: "Rock of Cashel",
    description: "Iconic ecclesiastical site and medieval fortress.",
    category: "Heritage",
    lat: 52.5204,
    lng: -7.8906,
    image: "https://www.aillweeburrenexperience.ie/wp-content/uploads/2021/03/Caves-1.jpg",
    timeRequired: "2 hours",
    // amenities: ["Guided Tour", "Toilets", "Parking"],
    userId: "->users.homer"
  },
]
export const serviceUrl = "http://localhost:3000";