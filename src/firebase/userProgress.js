import { db } from "./firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  arrayUnion, 
  Timestamp 
} from "firebase/firestore";

// Initialize user progress document
export const initUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, "userProgress", userId);
    const progressDoc = await getDoc(progressRef);
    
    // Create progress doc if it doesn't exist
    if (!progressDoc.exists()) {
      await setDoc(progressRef, {
        modules: {},
        lastUpdated: Timestamp.now()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error initializing user progress:", error);
    return { success: false, message: error.message };
  }
};

// Get user progress for all modules
export const getUserProgress = async (userId) => {
  try {
    const progressRef = doc(db, "userProgress", userId);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      await initUserProgress(userId);
      return { success: true, data: { modules: {} } };
    }
    
    return { success: true, data: progressDoc.data() };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return { success: false, message: error.message };
  }
};

// Get user progress for a specific module
export const getModuleProgress = async (userId, moduleId) => {
  try {
    const progressRef = doc(db, "userProgress", userId);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      await initUserProgress(userId);
      return { success: true, data: null };
    }
    
    const data = progressDoc.data();
    const moduleProgress = data.modules?.[moduleId] || null;
    
    return { success: true, data: moduleProgress };
  } catch (error) {
    console.error("Error getting module progress:", error);
    return { success: false, message: error.message };
  }
};

// Mark a video as completed
export const markVideoComplete = async (userId, moduleId, videoId) => {
  try {
    const progressRef = doc(db, "userProgress", userId);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      await initUserProgress(userId);
    }
    
    await updateDoc(progressRef, {
      [`modules.${moduleId}.completedVideos`]: arrayUnion(videoId),
      [`modules.${moduleId}.lastUpdated`]: Timestamp.now(),
      lastUpdated: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error marking video as complete:", error);
    return { success: false, message: error.message };
  }
};

// Calculate module completion percentage
export const calculateModuleCompletion = (completedVideos, totalVideos) => {
  if (!completedVideos || !totalVideos || totalVideos === 0) {
    return 0;
  }
  
  return Math.round((completedVideos.length / totalVideos) * 100);
};