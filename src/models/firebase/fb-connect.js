import admin from "firebase-admin";
import * as dotenv from "dotenv"; 
import { readFileSync } from "fs";

dotenv.config();

export function connectFirebase() {

  const serviceAccount= JSON.parse(readFileSync(process.env.firebase_key_path, "utf-8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  };

  console.log("Connected to Firebase");
  
};

export const getFirestore = () => admin.firestore();

/* https://firebase.google.com/docs/admin/setup 
   used for all firebase setup and queries:
   https://firebase.google.com/docs/firestore
   https://firebase.google.com/docs/firestore/manage-data/add-data
   https://firebase.google.com/docs/firestore/query-data/get-data
   https://firebase.google.com/docs/firestore/manage-data/delete-data

*/