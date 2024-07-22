
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Config/firebase";
import products from "../data/Products.json";

export const uploadData = async () => {
    try {
      const promises = products.map(async (product) => {
        await addDoc(collection(db, 'products'), product);
      });
      await Promise.all(promises);
      console.log('Data uploaded successfully');
    } catch (error) {
      console.error('Error uploading data: ', error);
    }
  };


