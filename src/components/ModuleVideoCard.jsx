import { useState } from "react";
import "../styles/moduleVideoCard.css";

export default function ModuleVideoCard({ video, isCompleted, onComplete }) {
  const [showVideo, setShowVideo] = useState(false);
  const [setWatchTime] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  // Track video progress when it's playing
  const handleTimeUpdate = (e) => {
    const currentTime = Math.floor(e.target.currentTime);
    setWatchTime(currentTime);
    
    // Automatically mark as complete if they've watched most of it
    const duration = e.target.duration;
    if (currentTime > duration * 0.9 && !isCompleted && !videoEnded) {
      setVideoEnded(true);
      onComplete();
    }
  };

  const handleVideoEnd = () => {
    if (!isCompleted) {
      setVideoEnded(true);
      onComplete();
    }
  };

  return (
    <div className={`video-card ${isCompleted ? "completed" : ""}`}>
      <div className="video-thumbnail" onClick={() => setShowVideo(!showVideo)}>
        {!showVideo && (
          <>
            <img 
              src={video.thumbnailUrl || "/api/placeholder/320/180"} 
              alt={video.title} 
              className="thumbnail-img"
            />
            <div className="play-button">▶️</div>
            {isCompleted && <div className="completed-badge">✓</div>}
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
            
            {!isCompleted && !videoEnded && (
              <button onClick={onComplete} className="mark-complete">
                Mark as Complete
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="video-info">
        <h3>{video.title}</h3>
        <p className="video-duration">{video.duration || "3:45"}</p>
        {isCompleted ? (
          <p className="status-completed">Completed ✓</p>
        ) : (
          <p className="status-pending">Not completed</p>
        )}
      </div>
    </div>
  );
}