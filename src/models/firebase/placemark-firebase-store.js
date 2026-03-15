import { v4 } from "uuid";
import { getFirestore } from "./fb-connect.js";

// add placemarks getter
const placemarks = () => getFirestore().collection("placemarks");

export const placemarkFirebaseStore = {
  
  async getAllPlacemarks() {
    const snapshot = await placemarks().get();
    // map over the snapshot to return an array of placemarks with their IDs
    return snapshot.docs.map((doc) => ({ 
      _id: doc.id,                // ADD ID to the returned object
      ...doc.data()               // .data() with spread to extract the placemark data from the document 
    }));
  },

  async getPlacemarkById(id) {
    if (!id) return null;
    const doc = await placemarks().doc(id).get();
    if (!doc.exists) return null;
    return { 
      _id: doc.id, 
      ...doc.data() 
    };
  },

  // need to construct the object to return
  async addPlacemark(userId, placemark) {
    const newPlacemark = {
      ...placemark,
      userId: userId
    };

    const docRef = await placemarks().add(newPlacemark);
    
    newPlacemark._id = docRef.id;

    return newPlacemark;
  },

  async getUserPlacemarks(userId) {
    const snapshot = await placemarks().where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({
      _id: doc.id, 
      ...doc.data() 
    }));
  },

  async deletePlacemarkById(id) {
    if (!id) return;
    await placemarks().doc(id).delete();
  },

  async getPlacemarkByCategory(category) {
    const snapshot = await placemarks().where("category", "==", category).get();
    return snapshot.docs.map((doc) => ({ 
      _id: doc.id, 
      ...doc.data() 
    }));
  },

  async deleteAllPlacemarks() {
    // Firestore doesn't have a built-in method to delete all documents in a collection, so we need to get all documents and delete them one by one
    const snapshot = await placemarks().get();

    if (snapshot.empty) {
      return;
    };
   // add Promise.all so code will wait for deletes to finish // add Promise.all so code will wait for deletes to finish
    await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
  },

  async updatePlacemark(placemarkID, updatedPlacemark) {

    if (!placemarkID) return null;

    // first check if document exists and get it from firestore
    const placemarkRef = placemarks().doc(placemarkID);
    const doc = await placemarkRef.get();
    
    // handle placemarks document not existing (for bad ids)
    if (!doc.exists) return null;

    // remove any 'undefined' fields so Firestore doesn't crash
    const cleanData = JSON.parse(JSON.stringify(updatedPlacemark));

    // update firebase with cleaned data
    await placemarkRef.update(cleanData);

    // construct object to send back, cleanData will override doc.data
    return {
      _id: placemarkID,
      ...doc.data(),          // add the original document
      ...updatedPlacemark     // add clean data ontop to override any updated fields
    };

  },
};