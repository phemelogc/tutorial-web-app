import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // make sure this points to your actual firebase.js

export const enrollUserInModule = async (userId, moduleData) => {
  try {
    const moduleRef = doc(db, "users", userId, "enrolledModules", moduleData.id);

    const existing = await getDoc(moduleRef);
    if (existing.exists()) {
      throw new Error("Already enrolled in this module.");
    }

    await setDoc(moduleRef, {
      ...moduleData,
      enrolledAt: new Date()
    });

    return { success: true };
  } catch (err) {
    console.error("Enrollment failed:", err);
    return { success: false, message: err.message };
  }
};
