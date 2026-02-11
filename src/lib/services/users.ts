import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/schema";
import { createAccountForOthers } from "@/lib/auth-helper";

const COLLECTION_NAME = "users";

// Tipe data input form - UPDATE: Menambahkan 'parent' dan 'master' ke union type role
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: "puskesmas" | "kader" | "parent" | "master";
  posyanduId?: string; // Wajib jika role = kader atau parent
}

export const createUser = async (data: CreateUserInput) => {
  try {
    // 1. Buat Akun Auth (Email/Pass)
    const uid = await createAccountForOthers(data.email, data.password);

    // 2. Simpan Profil di Firestore
    const userData: UserProfile = {
      uid: uid,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: serverTimestamp() as any,
      ...(data.posyanduId && { posyanduId: data.posyanduId })
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

// Hapus user dari database (Note: Auth account tidak terhapus dari sini tanpa Cloud Functions, 
// tapi user tidak akan bisa login karena cek role di AuthContext akan gagal)
export const deleteUserFirestore = async (uid: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, uid));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};