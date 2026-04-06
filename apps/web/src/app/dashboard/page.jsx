"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("video");
    const [moduleId, setModuleId] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            router.push("/login");
            return;
        }
        // Get user from token (in real app, you'd decode JWT)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        else {
            setUser({ name: "User" });
        }
        loadResources();
    }, [router]);
    const loadResources = async () => {
        try {
            const result = await apiFetch("/resources?limit=50");
            setResources(result.items);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddResource = async (e) => {
        e.preventDefault();
        const token = getAccessToken();
        try {
            if ((type === "video" || type === "image" || type === "pdf") && selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("title", title);
                formData.append("moduleId", moduleId);
                const res = await fetch(`${API_URL}/resources/upload-file-auth`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data?.message || "File upload failed");
                }
            }
            else {
                if ((type === "video" || type === "image" || type === "pdf" || type === "link") && !sourceUrl) {
                    throw new Error(`Provide a ${type} URL or upload a ${type} file.`);
                }
                await apiFetch("/resources", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        type,
                        moduleId,
                        sourceUrl: sourceUrl || undefined,
                    }),
                });
            }
            setTitle("");
            setModuleId("");
            setSourceUrl("");
            setSelectedFile(null);
            setShowForm(false);
            loadResources();
        }
        catch (err) {
            alert(err.message);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.push("/");
    };
    if (loading) {
        return (<>
        <nav>
          <Link href="/" className="nav-brand">
            📚 Yovid
          </Link>
        </nav>
        <main>
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </main>
      </>);
    }
    return (<>
      <nav>
        <Link href="/" className="nav-brand">
          📚 Yovid
        </Link>
        <ul className="nav-links">
          <li style={{ color: "#666" }}>Welcome, {user?.name}!</li>
          <li>
            <button onClick={handleLogout} style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 600,
        }}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <main>
        <div className="container">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            gap: "1rem",
            flexWrap: "wrap",
        }}>
            <h1 style={{ color: "#333" }}>📚 My Dashboard</h1>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/contribute" className="btn-primary" style={{ padding: "0.75rem 1.5rem", textDecoration: "none", display: "inline-block" }}>
                ✍️ Request to Contribute
              </Link>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
                {showForm ? "Cancel" : "+ Add Resource"}
              </button>
            </div>
          </div>

          {showForm && (<div className="auth-card" style={{ marginBottom: "2rem" }}>
              <h2 style={{ marginBottom: "1rem", color: "#333" }}>Add New Resource</h2>
              <form onSubmit={handleAddResource}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., React Tutorials" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select id="type" value={type} onChange={(e) => {
                setType(e.target.value);
                setSelectedFile(null);
            }}>
                    <option value="video">📹 Video</option>
                    <option value="pdf">📄 PDF</option>
                    <option value="link">🔗 Link</option>
                    <option value="text">📝 Text</option>
                    <option value="image">🖼️ Image</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="moduleId">Module</label>
                  <input id="moduleId" type="text" value={moduleId} onChange={(e) => setModuleId(e.target.value)} placeholder="e.g., module-1" required/>
                </div>

                <div className="form-group">
                  <label htmlFor="sourceUrl">Source URL (optional when uploading file)</label>
                  <input id="sourceUrl" type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://example.com"/>
                </div>

                {(type === "video" || type === "image" || type === "pdf") && (<div className="form-group">
                    <label htmlFor="resourceFile">
                      Upload {type === "video" ? "Video" : type === "image" ? "Image" : "PDF"} File (optional if URL provided)
                    </label>
                    <input id="resourceFile" type="file" accept={type === "video" ? "video/*" : type === "image" ? "image/*" : "application/pdf"} onChange={(e) => setSelectedFile(e.currentTarget.files?.[0] || null)}/>
                    {selectedFile && (<p style={{ color: "#666", marginTop: "0.5rem", fontSize: "0.875rem" }}>
                        Selected: {selectedFile.name}
                      </p>)}
                  </div>)}

                <button type="submit" className="btn-primary">
                  Add Resource
                </button>
              </form>
            </div>)}

          <h2 style={{ color: "#333", marginBottom: "1rem" }}>
            All Resources ({resources.length})
          </h2>

          {resources.length === 0 ? (<div className="card" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#999" }}>No resources yet. Be the first to share!</p>
            </div>) : (<div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
            }}>
              {resources.map((r) => (<div key={r._id} className="card">
                  <h3 className="card-title">{r.title}</h3>
                  {r.description && (<p style={{ color: "#666", marginBottom: "1rem" }}>
                      {r.description}
                    </p>)}
                  <div className="card-meta">
                    <span className="badge badge-type">{r.type}</span>
                    <span className="badge badge-status">{r.status}</span>
                    <span style={{ fontSize: "0.875rem", color: "#999" }}>
                      {r.moduleId}
                    </span>
                  </div>
                </div>))}
            </div>)}
        </div>
      </main>
    </>);
}
