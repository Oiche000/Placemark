export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret"
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret"
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret"
    },
    lisa: { 
      firstName: "Lisa", 
      lastName: "Simpson", 
      email: "lisa@simpson.com", 
      password: "secret", 
      isAdmin: true 
    },
  },

  placemarks: {
    _model: "Placemark",
    
    carrauntoohil: {
      name: "Carrauntoohil",
      description: "The highest peak in Ireland, part of the MacGillycuddy's Reeks.",
      category: "Hiking",
      lat: 52.0000,
      lng: -9.7424,
      image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Carrauntoohil_2016.JPG",
      timeRequired: "Full day",
      // amenities: ["Parking", "Trail Markers"],
      userId: "->users.marge"
    },
    
    loughHyne: {
      name: "Lough Hyne",
      description: "Europe's first marine nature reserve.",
      category: "Kayaking",
      lat: 51.5008,
      lng: -9.2986,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/2019-07-31-Lough_Hyne-0828.jpg/640px-2019-07-31-Lough_Hyne-0828.jpg",
      timeRequired: "Half day",
      // amenities: ["Pier", "Information Boards"],
      userId: "->users.marge"
    },
    guinness: {
      name: "Guinness Storehouse",
      description: "One of the best places in the world to view the Milky Way.",
      category: "Heritage",
      lat: 53.3418,
      lng: -6.2867,
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Guinness_sign_on_Guinness_Storehouse%2C_Market_Street_South%2C_Dublin_-_geograph.org.uk_-_2581936.jpg",
      timeRequired: "2 hours",
      // amenities: ["Guiness Tasting", "Gift Shop"],
      userId: "->users.marge"
    },
    killarney: {
      name: "Killarney National Park",
      description: "First national park in Ireland, features lakes and mountains.",
      category: "Hiking",
      lat: 52.0174,
      lng: -9.5167,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Lakes_of_Killarney.JPG/1280px-Lakes_of_Killarney.JPG",
      timeRequired: "Half Day",
      // amenities: ["Information Signs", "Cafe"],
      userId: "->users.lisa"    
    },
    glendalough: {
      name: "Glendalough Valley",
      description: "Glacial valley and 6th-century monastic settlement.",
      category: "Hiking",
      lat: 53.0113,
      lng: -6.3298,
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Wicklow_Mountains_National_Park_Glendalough_Valley_08.JPG",
      timeRequired: "Half Day",
      // amenities: ["Hiking Trails"],
      userId: "->users.lisa"
    },
    newgrange: {
      name: "Newgrange",
      description: "Ancient passage tomb built during the Neolithic period.",
      category: "Heritage",
      lat: 53.6947,
      lng: -6.4463,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Newgrange_-_geograph.org.uk_-_14526.jpg/640px-Newgrange_-_geograph.org.uk_-_14526.jpg",
      timeRequired: "Half Day",
      // amenities: ["Guided Tours", "Cafe"],
      userId: "->users.marge"
    },
    cliffs: {
        name: "Cliffs of Moher",
        description: "Spectacular sea cliffs on the Atlantic coast trail.",
        category: "Hiking",
        lat: 52.9719,
        lng: -9.4265,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/CliffsofMoher_001.jpg/500px-CliffsofMoher_001.jpg",
        timeRequired: "2 hours",
        // amenities: ["Parking", "Visitor Centre", "Pathways"],
        userId: "->users.marge"
      },
    cashel: {
      name: "Rock of Cashel",
      description: "Iconic ecclesiastical site and medieval fortress.",
      category: "Heritage",
      lat: 52.5204,
      lng: -7.8906,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/13/Rock_of_Cashel_%2849163525453%29.jpg",
      timeRequired: "2 hours",
      // amenities: ["Guided Tour", "Toilets", "Parking"],
      userId: "->users.homer"
    },
    fortyFoot: {
      name: "The Forty Foot",
      description: "Famous deep-water sea-swimming spot in Sandycove.",
      category: "Swimming",
      lat: 53.2891,
      lng: -6.1162,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Steps_at_the_Forty_Foot_Bathing_Place_-_geograph.org.uk_-_6312431.jpg/640px-Steps_at_the_Forty_Foot_Bathing_Place_-_geograph.org.uk_-_6312431.jpg",
      timeRequired: "1 hour",
      // amenities: ["Changing Rooms", "Ladders", "Handrails"],
      userId: "->users.lisa"
    },
    ailwee: {
      name: "Aillwee Caves",
      description: "Dramatic caves beneath the karst landscape of the Burren.",
      category: "Caving",
      lat: 53.0898,
      lng: -9.1466,
      image: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Stalactites%2C_Aillwee_Cave_-_geograph.org.uk_-_6755731.jpg",
      timeRequired: "2 hours",
      // amenities: ["Gift Shop", "Cafe", "Guided Tour"],
      userId: "->users.homer"
    },
    kerryDarkSky: {
      name: "Kerry Dark Sky Reserve",
      description: "One of the best places in the world to view the Milky Way.",
      category: "Stargazing",
      lat: 51.8413,
      lng: -10.2796,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/McCarthy%27s_Castle%2C_Ballinskelligs_in_the_Kerry_Dark_Sky_Reserve.jpg/960px-McCarthy%27s_Castle%2C_Ballinskelligs_in_the_Kerry_Dark_Sky_Reserve.jpg",
      timeRequired: "Overnight",
      // amenities: ["Information Boards", "Observation Point"],
      userId: "->users.marge"
    },
  },
}