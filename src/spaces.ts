import { collection, doc, setDoc } from "firebase/firestore";
import { firebaseDB, firebaseStorage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const storageSpacesRef = (uid: string) =>
  ref(firebaseStorage, `images/space.jpg`);

async function ImageUploader(uid: string, imageName: string, uri: string) {
  try {
    const imagePath = `images/${uid}/${imageName}`;
    const imageRef = ref(firebaseStorage, imagePath);
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    await uploadBytes(imageRef, blob);
    // blob.close();
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export { storageSpacesRef, ImageUploader };
