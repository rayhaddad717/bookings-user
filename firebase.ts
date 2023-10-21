import { FirebaseOptions, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAd4rw5hX7-R8-RxEoVf1XQiKrEmkx2h2w",
  authDomain: "bookings-345b6.firebaseapp.com",
  projectId: "bookings-345b6",
  storageBucket: "gs://bookings-345b6.appspot.com",
  messagingSenderId: "807564020720",
  appId: "1:807564020720:web:aad94ebefc5a41e6792b35",
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const firebaseStorage = getStorage(firebaseApp);
const firebaseDB = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);

const backendFunctions = {
  pong: httpsCallable<
    { documentUID: string },
    { status: number; message: string; success: boolean }
  >(functions, "pong"),
  reverseGeoCode: httpsCallable<
    { latitude: number; longitude: number },
    { statusCode: number; message: string; data: { completeAddress: string } }
  >(functions, "reverseGeoCode"),
};
export { firebaseAuth, firebaseDB, firebaseStorage, backendFunctions };
