import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/upload.css";
import AdminNav from "../components/AdminNav";

export default function UploadModule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(""); // ⬅️ new state
  // const [videoFile, setVideoFile] = useState(null); // ⬅️ commenting this out
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !department) return alert("All fields required");

    setLoading(true);
    try {
      // // 🔥 Upload video to Cloudinary
      // const formData = new FormData();
      // formData.append("file", videoFile);
      // formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

      // const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      // const data = await res.json();
      // const videoUrl = data.secure_url;

      // 🧠 Save module info to Firestore
      await addDoc(collection(db, "modules"), {
        title,
        description,
        department,
        videoUrl: "",
        createdAt: serverTimestamp()
      });

      alert("Module uploaded successfully!");
      setTitle(""); setDescription(""); setDepartment(""); // setVideoFile(null);
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
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
          </select>

          <textarea
            placeholder="Module Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          {/* <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          /> */}
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Module"}
          </button>
        </form>
      </div>
    </div>
  );
}
