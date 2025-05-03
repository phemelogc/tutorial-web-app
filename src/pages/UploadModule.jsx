import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/upload.css";
import AdminNav from "../components/AdminNav";

export default function UploadModule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(""); // ⬅️ new state
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !department) return alert("All fields required");
  
    setLoading(true);
    try {
      let videoUrl = ""; // Default value for videoUrl in case no file is uploaded
  
      if (videoFile) {
        // 🔥 Upload video to Cloudinary if a video is provided
        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("upload_preset", "mech_connect");
  
        const res = await fetch("https://api.cloudinary.com/v1_1/mech-connect/video/upload", {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        console.log("Cloudinary response status", res.status);
  
        if (!res.ok) {
          const errData = await res.text(); // grab raw response
          console.error("Cloudinary error:", errData);
          throw new Error("Cloudinary upload failed");
        }
  
        videoUrl = data.secure_url; // If video is uploaded, store the URL
      }
  
      // 🧠 Save module info to Firestore
      await addDoc(collection(db, "modules"), {
        title,
        description,
        department,
        videoUrl, // Will be an empty string if no video is uploaded
        createdAt: serverTimestamp()
      });
  
      alert("Module uploaded successfully!");
      setTitle(""); setDescription(""); setDepartment(""); setVideoFile(null);
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="upload-page">
      <AdminNav />
      <div className="upload-header">
        <h1 className="header">Upload Training Module</h1>
      </div>
      <div className="upload-form-wrapper">
        <form className="upload-form" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Module Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="Engineering">Inventory</option>
            <option value="Marketing">Procurement</option>
            <option value="HR">Quality Assurance</option>
            <option value="Sales">Sales</option>
            <option value="Support">Marketing</option>
            <option value="Support">Logistics</option>
          </select>

          <textarea
            placeholder="Module Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          <input
            className="choose-btn"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Module"}
          </button>
        </form>
      </div>
    </div>
  );
}
