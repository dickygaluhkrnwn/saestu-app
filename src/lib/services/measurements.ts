import { 
  collection, 
  addDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  FieldValue
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Measurement, Child } from "@/types/schema";
import { calculateGrowthStatus } from "@/lib/who-standards";
import { differenceInMonths } from "date-fns";

const COLLECTION_NAME = "measurements";

// Input Form
export interface CreateMeasurementInput {
  childId: string;
  posyanduId: string;
  date: string; // YYYY-MM-DD
  weight: number;
  height: number;
  headCircumference?: number;
  kaderId: string;
}

export const addMeasurement = async (data: CreateMeasurementInput) => {
  try {
    // 1. Ambil Data Anak
    const childRef = doc(db, "children", data.childId);
    const childSnap = await getDoc(childRef);
    if (!childSnap.exists()) throw new Error("Data anak tidak ditemukan");
    
    const child = childSnap.data() as Child;
    // Fix: Pastikan konversi Timestamp aman
    const childDob = child.dob instanceof Timestamp ? child.dob.toDate() : new Date(child.dob);
    
    // Fix: Parsing string date YYYY-MM-DD agar konsisten
    const currentMeasDate = new Date(data.date); 

    // 2. Ambil Data Pengukuran TERAKHIR
    const q = query(
      collection(db, COLLECTION_NAME),
      where("childId", "==", data.childId),
      where("date", "<", Timestamp.fromDate(currentMeasDate)), // Gunakan Timestamp untuk query
      orderBy("date", "desc"),
      limit(1)
    );
    
    const prevSnap = await getDocs(q);
    
    // 3. Tentukan Baseline
    let prevDate: Date;
    let prevWeight: number;
    let prevHeight: number;

    if (!prevSnap.empty) {
      const prevData = prevSnap.docs[0].data() as Measurement;
      prevDate = prevData.date instanceof Timestamp ? prevData.date.toDate() : new Date(prevData.date);
      prevWeight = prevData.weight;
      prevHeight = prevData.height;
    } else {
      // Skenario: Belum ada pengukuran sebelumnya -> Pakai Data Lahir
      prevDate = childDob;
      prevWeight = child.initialWeight;
      prevHeight = child.initialHeight;
    }

    // 4. Jalankan WHO Engine (Sekarang lebih robust)
    const weightAnalysis = calculateGrowthStatus(
      child.gender, childDob, prevDate, currentMeasDate,
      prevWeight, data.weight, "weight"
    );

    const lengthAnalysis = calculateGrowthStatus(
      child.gender, childDob, prevDate, currentMeasDate,
      prevHeight, data.height, "length"
    );

    const combinedNotes = `[AUTO] BB: ${weightAnalysis.message} | TB: ${lengthAnalysis.message}`;

    // 5. Simpan ke Database
    // Fix: Gunakan interface yang fleksibel untuk field Firestore
    const docData: Record<string, any> = {
      childId: data.childId,
      posyanduId: data.posyanduId,
      date: Timestamp.fromDate(currentMeasDate),
      ageInMonths: differenceInMonths(currentMeasDate, childDob),
      weight: data.weight,
      height: data.height,
      headCircumference: data.headCircumference || 0,
      
      weightStatus: weightAnalysis.status,
      lengthStatus: lengthAnalysis.status,
      
      // Simpan data detail analisis untuk keperluan debugging/AI nanti
      weightIncrement: weightAnalysis.actualIncrement,
      lengthIncrement: lengthAnalysis.actualIncrement,
      
      notes: combinedNotes,
      createdAt: serverTimestamp(), // Sekarang aman
      createdBy: data.kaderId
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), docData);
    return docRef.id;

  } catch (error) {
    console.error("Error adding measurement:", error);
    throw error;
  }
};

export const getMeasurementsByChild = async (childId: string): Promise<Measurement[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("childId", "==", childId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: (data.date as Timestamp).toDate(),
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()
      } as Measurement;
    });
  } catch (error) {
    console.error("Error fetching measurements:", error);
    throw error;
  }
};