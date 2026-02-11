import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Posyandu } from "@/types/schema";

const COLLECTION_NAME = "posyandus";

export const addPosyandu = async (data: Omit<Posyandu, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding posyandu:", error);
    throw error;
  }
};

export const getPosyandus = async (): Promise<Posyandu[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Posyandu));
  } catch (error) {
    console.error("Error fetching posyandus:", error);
    throw error;
  }
};

export const deletePosyandu = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting posyandu:", error);
    throw error;
  }
};