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
  Timestamp 
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
    // 1. Ambil Data Anak (Untuk Gender & Tgl Lahir)
    const childRef = doc(db, "children", data.childId);
    const childSnap = await getDoc(childRef);
    if (!childSnap.exists()) throw new Error("Data anak tidak ditemukan");
    
    const child = childSnap.data() as Child;
    const childDob = child.dob instanceof Timestamp ? child.dob.toDate() : new Date(child.dob);
    const currentMeasDate = new Date(data.date);

    // 2. Ambil Data Pengukuran TERAKHIR (Sebelum tanggal ini)
    // Query ini butuh Index: childId (Asc) + date (Desc)
    const q = query(
      collection(db, COLLECTION_NAME),
      where("childId", "==", data.childId),
      where("date", "<", new Date(data.date)), // Hanya ambil yg lampau
      orderBy("date", "desc"),
      limit(1)
    );
    
    const prevSnap = await getDocs(q);
    
    // 3. Tentukan Titik Pembanding (Baseline)
    let prevDate: Date;
    let prevWeight: number;
    let prevHeight: number;

    if (!prevSnap.empty) {
      // Skenario A: Ada pengukuran sebelumnya
      const prevData = prevSnap.docs[0].data() as Measurement;
      prevDate = prevData.date instanceof Timestamp ? prevData.date.toDate() : new Date(prevData.date);
      prevWeight = prevData.weight;
      prevHeight = prevData.height;
    } else {
      // Skenario B: Belum pernah diukur -> Pakai Data Lahir
      prevDate = childDob;
      prevWeight = child.initialWeight;
      prevHeight = child.initialHeight;
    }

    // 4. Jalankan WHO Engine
    // Hitung status Berat Badan
    const weightAnalysis = calculateGrowthStatus(
      child.gender, childDob, prevDate, currentMeasDate,
      prevWeight, data.weight, "weight"
    );

    // Hitung status Panjang Badan
    const lengthAnalysis = calculateGrowthStatus(
      child.gender, childDob, prevDate, currentMeasDate,
      prevHeight, data.height, "length"
    );

    // Gabungkan pesan catatan
    const combinedNotes = `BB: ${weightAnalysis.message} | TB: ${lengthAnalysis.message}`;

    // 5. Simpan ke Database
    const docData: Omit<Measurement, "id"> = {
      childId: data.childId,
      posyanduId: data.posyanduId,
      date: Timestamp.fromDate(currentMeasDate),
      ageInMonths: differenceInMonths(currentMeasDate, childDob),
      weight: data.weight,
      height: data.height,
      headCircumference: data.headCircumference || 0,
      
      weightStatus: weightAnalysis.status,
      lengthStatus: lengthAnalysis.status,
      weightIncrement: weightAnalysis.actualIncrement, // dalam gram
      lengthIncrement: lengthAnalysis.actualIncrement, // dalam cm
      
      notes: combinedNotes,
      createdAt: serverTimestamp() as any,
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
    // Butuh Index: childId + date
    const q = query(
      collection(db, COLLECTION_NAME),
      where("childId", "==", childId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(), // Konversi Timestamp ke Date JS
    } as Measurement));
  } catch (error) {
    console.error("Error fetching measurements:", error);
    throw error;
  }
};