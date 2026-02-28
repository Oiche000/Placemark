import { userMemStore } from "./mem/user-mem-store.js";

import { userJsonStore } from "./json/user-json-store.js";

import { userMongoStore } from "./mongo/user-mongo-store.js";

import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        
    }
  }
};