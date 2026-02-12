import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Puskesmas } from "@/types/schema";

const COLLECTION_NAME = "puskesmas_entities";

// Menambah data fisik/entitas Puskesmas
export const addPuskesmas = async (data: Omit<Puskesmas, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding puskesmas entity:", error);
    throw error;
  }
};

// Mengambil semua daftar Puskesmas
export const getPuskesmasEntities = async (): Promise<Puskesmas[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Puskesmas));
  } catch (error) {
    console.error("Error fetching puskesmas entities:", error);
    throw error;
  }
};

// Mengambil detail satu Puskesmas
export const getPuskesmasById = async (id: string): Promise<Puskesmas | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Puskesmas;
      }
      return null;
    } catch (error) {
      console.error("Error fetching puskesmas detail:", error);
      throw error;
    }
  };

export const deletePuskesmas = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting puskesmas:", error);
    throw error;
  }
};