import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/upload.css";
import NavBar from "../components/AdminNav";
import ModuleVideoCard from "../components/ModuleVideoCard";

interface ModuleForm {
  title: string;
  department: string;
  description: string;
  videoUrls?: string[]; 
}

export default function EditModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ModuleForm>({
    title: "",
    department: "",
    description: "",
  });
  const [videoFiles, setVideoFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModule = async () => {
      if (!moduleId || typeof moduleId !== "string") {
        alert("Module ID is missing or invalid.");
        return;
      }

      try {
        const docRef = doc(db, "modules", moduleId);
        const snap = await getDoc(docRef);

        if (!snap.exists()) throw new Error("Module not found");

        const data = snap.data() as ModuleForm;
        setForm(data);
      } catch (err: any) {
        alert("Error loading module: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setVideoFiles(prev => (prev ? [...prev, ...Array.from(files)] : Array.from(files)));
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mech_connect"); // from Cloudinary
    formData.append("cloud_name", "mech-connect");
  
    const res = await fetch("https://api.cloudinary.com/v1_1/mech-connect/video/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    return data.secure_url;
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!moduleId) {
      alert("Missing module ID");
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "modules", moduleId);
      const existingDocSnap = await getDoc(docRef);

      if (!existingDocSnap.exists()) {
        throw new Error("Module not found");
      }

      const existingDoc = existingDocSnap.data();

      let videoUrls: string[] = [];
      
      if (videoFiles && videoFiles.length > 0) {
        for (const file of videoFiles) {
          const url = await uploadToCloudinary(file);
          videoUrls.push(url);
        }
      }
      
      await updateDoc(docRef, {
        title: form.title,
        department: form.department,
        description: form.description,
        videoUrls: videoUrls.length ? videoUrls : existingDoc.videoUrlss,
      });
      
      
      alert("Module updated successfully!");
      navigate("/adminDash");
    } catch (err: any) {
      alert("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!moduleId) return alert("module ID missing.");

    const confirmed = window.confirm(
      `are you sure you want to delete "${form.title}"? this can't be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "modules", moduleId));
      alert("module deleted successfully!");
      navigate("/adminDash")
    } catch (err) {
      console.error("delete failed:", err);
      alert("error deleting module: " + err.message);
    }
  };

  return (
    <div className="upload-page">
      <NavBar />
      
      <div className="upload-header">
        <h1 className="header">Edit Module</h1>
      </div>

      {loading ? (
        <div className="module-loader">
          <div className="spinner">
          </div>
        </div>
      ) : (
        <div className="upload-form-wrapper">
          <form onSubmit={handleSubmit} className="upload-form">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Module Title"
            required
            type="text"
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="Inventory">Inventory</option>
            <option value="Procurement">Procurement</option>
            <option value="Quality Assurance">Quality Assurance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Logistics">Logistics</option>
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />

          <label className="choose-btn">
            Choose Video
            <input type="file" accept="video/*" onChange={handleVideoChange} hidden multiple/>
          </label>

          <div className="video-preview-container">
            {videoFiles && videoFiles.length > 0 ? (
              <div className="video-grid">
                {videoFiles.map((file, idx) => (
                  <ModuleVideoCard
                    key={idx}
                    video={{
                      id: `new-${idx}`,
                      videoUrl: URL.createObjectURL(file),
                      title: file.name,
                    }}
                    role="admin" onRemove={undefined}        />
                ))}
              </div>
            ) : form.videoUrls && form.videoUrls.length > 0 ? (
              <div className="video-grid">
                {form.videoUrls.map((url, idx) => (
                  <ModuleVideoCard
                    key={idx}
                    video={{
                      id: `existing-${idx}`,
                      videoUrl: url,
                      title: `Video ${idx + 1}`,
                    }}
                    role="admin" onRemove={undefined}        />
                ))}
              </div>
            ) : (
              <p>No videos uploaded.</p>
            )}
          </div>

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Module"}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/adminDash")}>
              Cancel
            </button>
          </div>  

          <div className="danger-container">
            <div className="danger-zone">
              <span className="danger-label">DANGER ZONE</span>
            </div>
          
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete Module
            </button>
          </div>        
        </form>
      </div>
  )}
    </div>
  );
}