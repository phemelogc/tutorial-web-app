import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ModuleVideoCard from "../components/ModuleVideoCard";
import NavBar from "../components/EmployeeNav";
import "../styles/moduleView.css";

export default function ModuleView() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadModuleData = useCallback(async (userId) => {
    try {
      const moduleRef = doc(db, "users", userId, "enrolledModules", moduleId);
      const moduleSnap = await getDoc(moduleRef);

      if (!moduleSnap.exists()) {
        alert("Module not found!");
        navigate("/enrolledModules", { replace: true });
        return;
      }

      const moduleData = moduleSnap.data();
      setModule(moduleData);

      const videoList = Array.isArray(moduleData.videoUrls)
        ? moduleData.videoUrls.map((url, index) => ({
            id: `video-${index}`,
            videoUrl: url,
          }))
        : [];

      setVideos(videoList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading module data:", error);
      alert("Error loading module data. Please try again.");
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

  const handleUnenroll = async () => {
    const confirmUnenroll = window.confirm("Are you sure you want to unenroll?");
    if (!confirmUnenroll) return;

    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "enrolledModules", moduleId));
      navigate("/enrolledModules");
    } catch (error) {
      console.error("Error unenrolling:", error);
      alert("Couldn't unenroll. Try again later.");
    }
  };

  return (
    <div className="module-view-container">
      <NavBar />

      {loading ? (
        <div className="section-spinner-wrapper">
          <div className="section-spinner"></div>
        </div>
      ) : (
        <div className="module-view">
          <div className="module-header">
            <h1>{module?.title}</h1>
            <p className="module-department">{module?.department}</p>
          </div>

          <div className="module-description">
            <p>{module?.description}</p>
          </div>

          <h2>Module Content</h2>

          {videos.length === 0 ? (
            <div className="no-videos">No videos available for this module yet.</div>
          ) : (
            <div className="videos-grid">
              {videos.map((video) => (
                <ModuleVideoCard
                  key={video.id}
                  video={video}
                  isCompleted={false}
                  onComplete={() => {}}
                />
              ))}
            </div>
          )}

          <div className="bottom-btns">
            <button
              className="take-quiz-btn"
              onClick={() => navigate(`/quiz-attempt/${moduleId}`)}
            >
              Take Quiz
            </button>

            <button className="unenroll-btn" onClick={handleUnenroll}>
              Unenroll
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
