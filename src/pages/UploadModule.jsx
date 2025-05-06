import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/upload.css";
import AdminNav from "../components/AdminNav";

export default function UploadModule() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [videoFiles, setVideoFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !department) return alert("All fields required");

    setLoading(true);
    try {
      let videoUrls = [];

      if (videoFiles.length > 0) {
        for (const file of videoFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "mech_connect");

          const res = await fetch("https://api.cloudinary.com/v1_1/mech-connect/video/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error("Cloudinary upload failed:", errText);
            throw new Error("Cloudinary upload failed");
          }

          const data = await res.json();
          videoUrls.push(data.secure_url);
        }
      }

      await addDoc(collection(db, "modules"), {
        title,
        description,
        department,
        videoUrls: videoUrls.length > 0 ? videoUrls : [],
        createdAt: serverTimestamp(),
      });

      alert("Module uploaded successfully!");
      setTitle("");
      setDescription("");
      setDepartment("");
      setVideoFiles([]);
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

          <label className="choose-btn">
            Choose Video
            <input
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={(e) => setVideoFiles([...e.target.files])}
            />
          </label>

          <button className="upload-btn" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Module"}
          </button>
        </form>
      </div>
    </div>
  );
}
