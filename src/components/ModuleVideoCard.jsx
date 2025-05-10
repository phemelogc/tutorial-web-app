import { useState } from "react";
import "../styles/moduleVideoCard.css";

export default function ModuleVideoCard({ 
  video, 
  isCompleted = false, 
  onComplete = () => {}, 
  role = "employee",
  onRemove
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // Track video progress when it's playing (only for employees)
  const handleTimeUpdate = (e) => {
    // Skip progress tracking for admins
    if (role === "admin") return;
    
    const currentTime = Math.floor(e.target.currentTime);
    
    // Automatically mark as complete if they've watched most of it
    const duration = e.target.duration;
    if (currentTime > duration * 0.9 && !isCompleted && !videoEnded) {
      setVideoEnded(true);
      onComplete();
    }
  };

  const handleVideoEnd = () => {
    // Skip completion tracking for admins
    if (role === "admin") return;
    
    if (!isCompleted) {
      setVideoEnded(true);
      onComplete();
    }
  };

  return (
    <div className={`video-card ${isCompleted ? "completed" : ""} ${role === "admin" ? "admin-card" : ""}`}>
      <div className="video-thumbnail" onClick={() => setShowVideo(!showVideo)}>
        {!showVideo && (
          <>
            <img 
              src={video.thumbnailUrl || "/api/placeholder/320/180"} 
              alt={video.title} 
              className="thumbnail-img"
            />
            <div className="play-button">▶️</div>
            {role === "employee" && isCompleted && <div className="completed-badge">✓</div>}
          </>
        )}
      </div>
      
      {showVideo && (
        <div className="video-player">
          <video
            controls
            autoPlay
            src={video.videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnd}
          />
          
          <div className="video-controls">
            <button onClick={() => setShowVideo(false)} className="close-video">
              Close Video
            </button>
          </div>
        </div>
      )}
      
      {/* Remove button only for admins */}
      {role === "admin" && onRemove && (
        <button 
          type="button" 
          className="remove-video-btn"
          onClick={onRemove}
        >
          Remove Video
        </button>
      )}
    </div>
  );
}