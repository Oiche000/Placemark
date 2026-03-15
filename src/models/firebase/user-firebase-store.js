import { getFirestore } from "./fb-connect.js";

// users getter 
export const users = () => getFirestore().collection("users");

export const userFirebaseStore = {

  async getAllUsers() {
    const snapshot = await users().get();
    return snapshot.docs.map((doc) => ({ 
      _id: doc.id, 
      ...doc.data() 
    }));
  },

  async getUserById(id) {
    if (!id) return null;
    const doc = await users().doc(id).get();
    if (!doc.exists) return null;
    return { 
      _id: doc.id, 
      ...doc.data() 
    };
  },

  // firestore returns a list (query snapshot) so get first item [0]
  async getUserByEmail(email) {
    const snapshot = await users().where("email", "==", email).get();
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { 
      _id: doc.id, 
      ...doc.data() 
    };
  },

  async addUser(user) {

    // make a copy of new user
    const cleanUser = { ...user };

    // delete id if already exists 
    delete cleanUser._id;

    // firestore will generate a new ID on clean object
    const userRef = await users().add(cleanUser);

    // attach the new firestore id to object
    cleanUser._id = userRef.id;
     
    return cleanUser;
  },

  async deleteUserById(id) {
    if (!id) return;
    await users().doc(id).delete();
  },

  async deleteAll() {
    const snapshot = await users().get();
    if (snapshot.empty) {
      return;
    };
    // add Promise.all so code will wait for deletes to finish
    await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
  },

  async updateUser(userId, updatedUser) {

    if (!userId) return null;

    const userRef = users().doc(userId);
    const doc = await userRef.get();
    
    // If the user doc doesn't exist, stop here
    if (!doc.exists) return null;

    // Remove any 'undefined' fields so firestore doesn't crash
    const cleanData = JSON.parse(JSON.stringify(updatedUser));
    
    // Prevent accidentally overwriting the _id if the test passed it in
    delete cleanData._id; 

    await userRef.update(cleanData);
    
    return {
      _id: userId,
      ...doc.data(),
      ...cleanData
    };
  },
};