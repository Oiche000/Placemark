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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752838/Carrauntoohil_2016_qedgye.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752869/2019-07-31-Lough_Hyne-0828_miq52r.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752889/Guiness_Storehouse__161318901_hcd0sx.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752901/Ladies_View_in_summer__Ring_of_Kerry__Killarney_National_Park_m3hmkp.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752919/Wicklow_Mountains_National_Park_Glendalough_Valley_cejprw.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752931/Newgrange_-_geograph.org.uk_-_14526_wspaj0.jpg",
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
        image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752946/Cliffs_of_Moher_seen_from_water_ua2yl7.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752410/Cashel_-_Rock_of_Cashel_-_20120615001238_rvr2ri.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752387/Forty_foot_pic_sjts1j.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752251/Stalactites_2C_Aillwee_Cave_-_geograph.org.uk_-_6755731_ckjx5b.jpg",
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
      image: "https://res.cloudinary.com/dsrrlkzpj/image/upload/v1773752176/McCarthy_s_Castle__Ballinskelligs_in_the_Kerry_Dark_Sky_Reserve_q3idpz.jpg",
      timeRequired: "Overnight",
      // amenities: ["Information Boards", "Observation Point"],
      userId: "->users.marge"
    },
  },
}