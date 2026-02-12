import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where,
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Posyandu } from "@/types/schema";

const COLLECTION_NAME = "posyandus";

// Menambah Posyandu (Sekarang wajib menyertakan puskesmasId dari input)
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

// Ambil Posyandu berdasarkan wilayah Puskesmas (Fungsi krusial untuk Dashboard Puskesmas)
export const getPosyandusByPuskesmas = async (puskesmasId: string): Promise<Posyandu[]> => {
  try {
    const q = query(
        collection(db, COLLECTION_NAME), 
        where("puskesmasId", "==", puskesmasId),
        orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Posyandu));
  } catch (error) {
    console.error("Error fetching regional posyandus:", error);
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

export const getPosyanduById = async (id: string): Promise<Posyandu | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Posyandu;
    }
    return null;
  } catch (error) {
    console.error("Error fetching posyandu detail:", error);
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