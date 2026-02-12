import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, // Tambah where
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/schema";
import { createAccountForOthers } from "@/lib/auth-helper";

const COLLECTION_NAME = "users";

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: "puskesmas" | "kader" | "parent" | "master";
  posyanduId?: string;   
  puskesmasId?: string;  // PENTING: Kader juga harus punya puskesmasId agar terlacak
}

export const createUser = async (data: CreateUserInput) => {
  try {
    const uid = await createAccountForOthers(data.email, data.password);

    const userData: UserProfile = {
      uid: uid,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: serverTimestamp() as any,
      ...(data.posyanduId && { posyanduId: data.posyanduId }),
      ...(data.puskesmasId && { puskesmasId: data.puskesmasId })
    };

    await setDoc(doc(db, COLLECTION_NAME, uid), userData);
    return uid;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<UserProfile[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// --- [BARU] Ambil Kader berdasarkan wilayah Puskesmas ---
export const getKadersByPuskesmas = async (puskesmasId: string): Promise<UserProfile[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("puskesmasId", "==", puskesmasId),
      where("role", "==", "kader"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error fetching regional kaders:", error);
    throw error;
  }
};

export const deleteUserFirestore = async (uid: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, uid));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};