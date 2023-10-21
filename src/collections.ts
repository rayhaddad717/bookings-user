import { collection, doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "../firebase";

const userRef = collection(firebaseDB, "users");
const restaurantsRef = collection(firebaseDB, "restaurants");
const companyRestaurantsRef = (uid: string) =>
  collection(firebaseDB, "companies", uid, "restaurants");
export { userRef, restaurantsRef, companyRestaurantsRef };
