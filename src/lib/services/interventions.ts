import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InterventionLog } from "@/types/schema";

const COLLECTION_NAME = "interventions";

export const addIntervention = async (data: Omit<InterventionLog, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      date: Timestamp.fromDate(new Date(data.date as any)),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding intervention:", error);
    throw error;
  }
};

export const getInterventionsByChild = async (childId: string): Promise<InterventionLog[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("childId", "==", childId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    } as InterventionLog));
  } catch (error) {
    console.error("Error fetching interventions:", error);
    throw error;
  }
};

export const getInterventionsByPuskesmas = async (puskesmasId: string): Promise<InterventionLog[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("puskesmasId", "==", puskesmasId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    } as InterventionLog));
  } catch (error) {
    console.error("Error fetching regional interventions:", error);
    throw error;
  }
};