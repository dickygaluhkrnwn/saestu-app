import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, // Kita import lagi
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Child } from "@/types/schema";

const COLLECTION_NAME = "children";

// Input Form Data Anak
export interface CreateChildInput {
  name: string;
  nik: string;
  gender: "L" | "P";
  pob: string;
  dob: string; 
  parentName: string;
  parentId?: string;
  posyanduId: string;
  initialWeight: number;
  initialHeight: number;
}

export const addChild = async (data: CreateChildInput) => {
  try {
    const docData = {
      ...data,
      dob: Timestamp.fromDate(new Date(data.dob)),
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding child:", error);
    throw error;
  }
};

export const getChildrenByPosyandu = async (posyanduId: string): Promise<Child[]> => {
  try {
    // SOLUSI JANGKA PANJANG (SCALABLE):
    // Kita gunakan orderBy di level database.
    // Syarat: Wajib membuat Composite Index di Firebase Console (Klik link di error log).
    // Kelebihan: Cepat walau data ribuan, mendukung pagination.
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("posyanduId", "==", posyanduId),
      orderBy("name", "asc") 
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dob: data.dob?.toDate ? data.dob.toDate() : new Date(data.dob),
      } as Child;
    });

  } catch (error) {
    console.error("Error fetching children:", error);
    // Jika index belum jadi, error akan tertangkap di sini
    throw error;
  }
};

export const deleteChild = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting child:", error);
    throw error;
  }
};