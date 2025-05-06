import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ModuleVideoCard from "../components/ModuleVideoCard";
import NavBar from "../components/EmployeeNav";
import "../styles/moduleView.css";

export default function ModuleView() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  
  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState(() => []);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const loadModuleData = useCallback(async (userId) => {
    try {

      const moduleRef = doc(db, "users", userId, "enrolledModules", moduleId);
      const moduleSnap = await getDoc(moduleRef);
      
      if (!moduleSnap.exists()) {
        alert("Module not found!");
        navigate("/enrolledModules", { replace: true });
        return;
      }
  
      setModule(moduleSnap.data());
  
      const moduleData = moduleSnap.data();
      setModule(moduleData);

      const videoList = Array.isArray(moduleData.videoUrls)
        ? moduleData.videoUrls.map((url, index) => ({
        id: `video-${index}`,
        url,
      }))
      : [];

      setVideos(videoList);

      console.log("Videos pulled for module:", videoList);

      setVideos(videoList);
      
      const progressRef = doc(db, "userProgress", userId);
      const progressSnap = await getDoc(progressRef);
  
      if (progressSnap.exists()) {
        const userData = progressSnap.data();
        const moduleProgress = userData.modules?.[moduleId] || {};
        setCompletedVideos(moduleProgress.completedVideos || []);
  
        const completionPercentage = videoList.length > 0 
          ? (moduleProgress.completedVideos?.length || 0) / videoList.length * 100
          : 0;
        setProgress(Math.round(completionPercentage));
      }
  
      setLoading(false);
    } catch (error) {
      console.error("error loading module data:", error);
      alert("error loading module data. please try again.");
      setLoading(false);
    }
  }, [moduleId, navigate]);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      loadModuleData(user.uid);
    });

    return () => unsubscribe();
  }, [loadModuleData, navigate, auth]);
  

  const markVideoComplete = async (videoId) => {
    try {
      const userId = auth.currentUser.uid;
      if (!userId) return;
      
      // Add videoId to completedVideos array if not already there
      if (!completedVideos.includes(videoId)) {
        const updatedCompletedVideos = [...completedVideos, videoId];
        setCompletedVideos(updatedCompletedVideos);
        
        // Calculate new progress
        const newProgress = videos.length > 0 
          ? Math.round((updatedCompletedVideos.length / videos.length) * 100)
          : 0;
        setProgress(newProgress);
        
        // Update in Firestore
        const progressRef = doc(db, "userProgress", userId);
        await updateDoc(progressRef, {
          [`modules.${moduleId}.completedVideos`]: arrayUnion(videoId),
          [`modules.${moduleId}.lastUpdated`]: new Date()
        });
      }
    } catch (error) {
      console.error("Error marking video as complete:", error);
      alert("Failed to update progress. Please try again.");
    }
  };

  const handleUnenroll = async () => {
    const confirmUnenroll = window.confirm("are you sure you wanna unenroll from this module? 👀");

    if (!confirmUnenroll) return;

    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "enrolledModules", moduleId));
      
      navigate("/enrolledModules");
    } catch (error) {
      console.error("error unenrolling:", error);
      alert("couldn’t unenroll. try again later.");
    }
  };


  return (
    <div className="module-view-container">
        <NavBar/>
    
        {loading ? (
            <div className="section-spinner-wrapper">
                <div className="section-spinner"></div>
            </div>
        ) : (
            <div className="module-view">
                <div className="module-header">
                    <h1>{module?.title}</h1>
                    <p className="module-department">{module?.department}</p>
                    <div className="progress-container">
                        <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{progress}% Complete</span>
                </div>
            </div>
      
            <div className="module-description">
                <p>{module?.description}</p>
            </div>
      
            <h2>Module Content</h2>
      
            {videos.length === 0 ? (
                <div className="no-videos">
                    No videos available for this module yet.
                </div>
                ) : (
                <div className="videos-grid">
                    {videos.map(video => (
                        <ModuleVideoCard
                            key={video.id}
                            video={video}
                            isCompleted={completedVideos.includes(video.id)}
                            onComplete={() => markVideoComplete(video.id)}
                />
            ))}
            </div>
            )}
      
            {progress === 100 && (
                <div className="module-completed">
                    <h3>🎉 Module Completed! 🎉</h3>
                    <p>You've watched all videos in this module.</p>
                    <button 
                        className="take-quiz-btn"
                        onClick={() => navigate(`/quiz/${moduleId}`)}
                    >
                    Take Quiz
                    </button>
                </div>
            )}
            
            
            </div> 
            
        )}
        <div className="unenroll-container">
          <button className="unenroll-btn" onClick={handleUnenroll}>
            Unenroll
          </button>
        </div>
      </div>
    );
}