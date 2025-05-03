import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/editModule.css";
import NavBar from "../components/AdminNav"

interface ModuleForm {
  title: string;
  department: string;
  description: string;
}

export default function EditModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<ModuleForm>({
    title: "",
    department: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("EditModule useEffect, moduleId:", moduleId);
  
    const loadModule = async () => {
      if (!moduleId || typeof moduleId !== "string") {
        console.error("Invalid moduleId:", moduleId);
        alert("Module ID is missing or invalid.");
        return;
      }
      
  
      try {
        const docRef = doc(db, "modules", moduleId);
        const snap = await getDoc(docRef);
  
        if (!snap.exists()) throw new Error("Module not found");
  
        const data = snap.data() as ModuleForm;
        console.log("Fetched module data:", data);
        setForm(data);
      } catch (err: any) {
        alert("Error loading module: " + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadModule();
  }, [moduleId]);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!moduleId) {
      alert("Missing module ID");
      return;
    }

    try {
      const docRef = doc(db, "modules", moduleId);
      await updateDoc(docRef, {
        title: form.title,
        department: form.department,
        description: form.description,
      });
      alert("Module updated successfully!");
      navigate("/admin/modules");
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <p>Loading module...</p>;

  return (
    <div style={{backgroundColor: "white"}}>
        <NavBar/>
    <div className="edit-container">

      <h2>Edit Module</h2>
      <div className="form-container">
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          placeholder="Department"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        ></textarea>
        <button type="submit">Update</button>
      </form>
      </div>
      </div>
    </div>
  );
}
