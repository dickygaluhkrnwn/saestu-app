import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types/schema";
import { createUser, CreateUserInput } from "@/lib/services/users";

const COLLECTION_NAME = "users";

// Ambil daftar Orang Tua khusus di Posyandu tertentu
export const getParentsByPosyandu = async (posyanduId: string): Promise<UserProfile[]> => {
  try {
    // Query: Cari user yang role-nya 'parent' DAN posyanduId-nya cocok
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("role", "==", "parent"),
      where("posyanduId", "==", posyanduId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error fetching parents:", error);
    throw error;
  }
};

// Wrapper untuk membuat akun Parent (memastikan role otomatis 'parent')
export const createParentAccount = async (
  kaderPosyanduId: string, 
  data: Pick<CreateUserInput, "email" | "password" | "name">
) => {
  return createUser({
    ...data,
    role: "parent",
    posyanduId: kaderPosyanduId // Otomatis ikut Posyandu si Kader
  });
};