import { 
  collection, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  writeBatch,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MasterFood } from "@/types/schema";

const COLLECTION_NAME = "master_foods";

// 1. Simpan Banyak Data Sekaligus (Batch Write)
export const addMasterFoods = async (foods: Omit<MasterFood, "id" | "createdAt" | "puskesmasId">[], puskesmasId: string) => {
  try {
    const batch = writeBatch(db);
    
    foods.forEach((food) => {
      const docRef = doc(collection(db, COLLECTION_NAME)); // Generate auto-ID
      batch.set(docRef, {
        ...food,
        puskesmasId,
        createdAt: serverTimestamp()
      });
    });

    await batch.commit(); // Eksekusi penyimpanan massal
    return true;
  } catch (error) {
    console.error("Error adding master foods:", error);
    throw error;
  }
};

// 2. Ambil Semua Data Makanan milik Puskesmas tersebut
export const getMasterFoods = async (puskesmasId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("puskesmasId", "==", puskesmasId),
      orderBy("name", "asc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MasterFood[];
  } catch (error) {
    console.error("Error fetching master foods:", error);
    throw error;
  }
};

// 3. Hapus 1 Item Makanan
export const deleteMasterFood = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting master food:", error);
    throw error;
  }
};

// 4. Ambil Semua Data Makanan (Untuk dikonsumsi AI di Halaman Parent)
export const getAllMasterFoods = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MasterFood[];
  } catch (error) {
    console.error("Error fetching all master foods:", error);
    return [];
  }
};