"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createResourceSchema, resourceTypeSchema } from "@yovid/shared";
import AppLayout from "@/components/AppLayout";
import CardPreview from "@/components/CardPreview";
import Topbar from "@/components/Topbar";
import { removeAccessToken } from "@/lib/auth";
import { API_URL, apiFetch, normalizeContentItem } from "@/lib/api";
import {
  fetchCurrentUser,
  fetchMyCourses,
  fetchMyContent,
  createCourse,
  createContent,
  deleteContent,
} from "@/lib/api";

const emptyUrlItem = {
  title: "",
  url: "",
  type: resourceTypeSchema.options[0],
  description: "",
  category: "",
};

export default function AddResourcesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [myContent, setMyContent] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [uploadMode, setUploadMode] = useState("file");
  const [files, setFiles] = useState([]);
  const [urlItems, setUrlItems] = useState([{ ...emptyUrlItem }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canManageResources = user?.role === "admin" || user?.creator === true;

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError("");

      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
        localStorage.setItem("role", userData.role || "");
        localStorage.setItem("creator", String(Boolean(userData.creator)));

        if (userData.role !== "admin" && !userData.creator) {
          setLoading(false);
          return;
        }

        const results = await Promise.allSettled([
          fetchMyCourses(),
          fetchMyContent(),
        ]);

        if (results[0].status === "fulfilled") {
          setCourses(results[0].value);
        }

        if (results[1].status === "fulfilled") {
          setMyContent(results[1].value);
        }
      } catch (err) {
        if (err.message?.includes("401") || err.message?.includes("Failed to fetch user")) {
          removeAccessToken();
          localStorage.removeItem("creator");
          setError("Your session is no longer valid. Please sign in again.");
          router.push("/login");
        } else {
          setError(err.message || "Please sign in to access resources");
        }
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  function handleFilesChange(event) {
    setFiles(Array.from(event.target.files || []));
  }

  function handleUrlItemChange(index, field, value) {
    setUrlItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  }

  function addUrlItem() {
    setUrlItems((current) => [...current, { ...emptyUrlItem }]);
  }

  function removeUrlItem(index) {
    setUrlItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleCreateCourse(event) {
    event.preventDefault();
    setCourseSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const newCourse = await createCourse(newCourseTitle, newCourseDescription);
      setCourses((current) => [newCourse, ...current]);
      setCourseId(newCourse._id);
      setNewCourseTitle("");
      setNewCourseDescription("");
      setSuccessMsg("Course created successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setCourseSubmitting(false);
    }
  }

  function validateUrlItems(items) {
    for (const item of items) {
      const validation = createResourceSchema.safeParse({
        title: item.title || title || "Untitled URL Content",
        description: item.description || description,
        type: item.type,
        courseId,
        category: item.category || category,
        subject,
        gradeLevel,
        sourceUrl: item.url,
      });

      if (!validation.success) {
        return validation.error.issues[0]?.message || "Invalid resource data";
      }
    }
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subject", subject);
      formData.append("gradeLevel", gradeLevel);

      if (courseId) {
        formData.append("courseId", courseId);
      }

      if (uploadMode === "file") {
        if (files.length === 0) {
          throw new Error("Please choose at least one file");
        }
        files.forEach((file) => {
          formData.append("files", file);
        });
      } else {
        const validUrls = urlItems.filter((item) => item.url.trim());

        if (validUrls.length === 0) {
          throw new Error("Please add at least one URL");
        }

        const validationMessage = validateUrlItems(validUrls);
        if (validationMessage) {
          throw new Error(validationMessage);
        }

        formData.append("urlItems", JSON.stringify(validUrls));
      }

      await createContent(formData);
      setSuccessMsg("Content uploaded successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setSubject("");
      setGradeLevel("");
      setFiles([]);
      setUrlItems([{ ...emptyUrlItem }]);

      const updatedContent = await fetchMyContent();
      setMyContent(updatedContent);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setSuccessMsg("");

    try {
      await deleteContent(id);
      setMyContent((current) => current.filter((item) => item._id !== id));
      setSuccessMsg("Content deleted successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppLayout>
      <Topbar placeholder="Search your courses, uploads, and resource drafts..." />
      <div className="resources-page">
        <section className="resources-hero">
          <div className="resources-hero-content">
            <p className="resources-eyebrow">Creator Workspace</p>
            <h1>Manage courses and publish learning resources</h1>
            <p className="resources-text">
              This area is available only to admins and users with creator access.
            </p>
          </div>
          {user && (
            <div className="badge-row">
              <span className="status-badge">
                Role: {(user.role || "user").toUpperCase()}
              </span>
              <span className="status-badge">
                Creator: {user.creator ? "Enabled" : "Disabled"}
              </span>
            </div>
          )}
        </section>

        {error && (
          <div className="resources-panel resources-error">{error}</div>
        )}
        {successMsg && (
          <div className="resources-panel resources-success">{successMsg}</div>
        )}

        {loading ? (
          <div className="resources-panel">Loading resource workspace...</div>
        ) : !canManageResources ? (
          <div className="resources-panel">
            <h2 className="resources-title">Access restricted</h2>
            <p className="resources-text">
              Only admins or users with `creator` access can open this page.
            </p>
            <div className="resources-action-row">
              <Link href="/contribute" className="resources-link primary">
                Request creator access
              </Link>
              <Link href="/dashboard" className="resources-link secondary">
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="resources-two-column">
              <form onSubmit={handleCreateCourse} className="resources-panel">
                <h2 className="resources-title">Create Course</h2>
                <p className="resources-text">
                  Group upcoming resources into a course before you publish them.
                </p>
                <input
                  type="text"
                  placeholder="Course title"
                  value={newCourseTitle}
                  onChange={(event) => setNewCourseTitle(event.target.value)}
                  required
                  className="resources-input"
                />
                <textarea
                  placeholder="Course description"
                  value={newCourseDescription}
                  onChange={(event) => setNewCourseDescription(event.target.value)}
                  className="resources-textarea"
                />
                <button type="submit" disabled={courseSubmitting} className="resources-button">
                  {courseSubmitting ? "Creating..." : "Create Course"}
                </button>
              </form>

              <form onSubmit={handleSubmit} className="resources-panel">
                <h2 className="resources-title">Add Resource</h2>
                <p className="resources-text">
                  Upload files or add external URLs for the course materials you manage.
                </p>

                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className="resources-input"
                >
                  <option value="">No course selected</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {courses.length === 0 && (
                  <p style={{ fontSize: "13px", color: "#8090aa", marginTop: "6px" }}>
                    No courses available yet. Create one from the form on the left.
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Default title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="resources-input"
                />
                <textarea
                  placeholder="Default description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="resources-textarea"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="resources-input"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="resources-input"
                />
                <input
                  type="text"
                  placeholder="Grade level"
                  value={gradeLevel}
                  onChange={(event) => setGradeLevel(event.target.value)}
                  className="resources-input"
                />

                <div className="resources-mode-switch">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`resources-small-btn ${uploadMode === "file" ? "active" : ""}`}
                  >
                    Upload files
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`resources-small-btn ${uploadMode === "url" ? "active" : ""}`}
                  >
                    Add URLs
                  </button>
                </div>

                {uploadMode === "file" ? (
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="video/*,image/*,application/pdf"
                      onChange={handleFilesChange}
                      className="resources-input"
                    />
                    {files.length > 0 && (
                      <div className="resources-chip-row">
                        {files.map((file) => (
                          <span key={`${file.name}-${file.size}`} className="resources-chip">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="resources-url-stack">
                    {urlItems.map((item, index) => (
                      <div key={`url-item-${index}`} className="resources-url-card">
                        <input
                          type="text"
                          placeholder="Resource title"
                          value={item.title}
                          onChange={(event) =>
                            handleUrlItemChange(index, "title", event.target.value)
                          }
                          className="resources-input"
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.url}
                          onChange={(event) =>
                            handleUrlItemChange(index, "url", event.target.value)
                          }
                          className="resources-input"
                        />
                        <select
                          value={item.type}
                          onChange={(event) =>
                            handleUrlItemChange(index, "type", event.target.value)
                          }
                          className="resources-input"
                        >
                          {resourceTypeSchema.options.map((type) => (
                            <option key={type} value={type}>
                              {type.toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <textarea
                          placeholder="Short description for this URL"
                          value={item.description}
                          onChange={(event) =>
                            handleUrlItemChange(index, "description", event.target.value)
                          }
                          className="resources-textarea"
                        />
                        <input
                          type="text"
                          placeholder="Optional category override"
                          value={item.category}
                          onChange={(event) =>
                            handleUrlItemChange(index, "category", event.target.value)
                          }
                          className="resources-input"
                        />
                        {urlItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUrlItem(index)}
                            className="resources-danger-btn"
                          >
                            Remove URL row
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addUrlItem} className="resources-small-btn">
                      Add another URL
                    </button>
                  </div>
                )}

                <button type="submit" disabled={submitting} className="resources-button">
                  {submitting ? "Saving..." : "Save Resource"}
                </button>
              </form>
            </section>

            <section className="resources-section-block">
              <div className="resources-section-header">
                <div>
                  <h2 className="resources-title">My Courses</h2>
                  <p className="resources-text">
                    {courses.length} course{courses.length === 1 ? "" : "s"} available for
                    attaching resources.
                  </p>
                </div>
              </div>

              {courses.length === 0 ? (
                <div className="resources-panel">No courses yet. Create your first course above.</div>
              ) : (
                <div className="resources-course-grid">
                  {courses.map((course) => (
                    <div key={course._id} className="resources-panel">
                      <strong>{course.title}</strong>
                      <p className="resources-text">
                        {course.description || "No description yet."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="resources-section-block">
              <div className="resources-section-header">
                <div>
                  <h2 className="resources-title">My Uploaded Content</h2>
                  <p className="resources-text">
                    Review what you have published and remove items you no longer want visible.
                  </p>
                </div>
              </div>

              {myContent.length === 0 ? (
                <div className="resources-panel">No content yet. Add a file or URL to get started.</div>
              ) : (
                <div className="resources-content-grid">
                  {myContent.map((item) => {
                    if (!item || !item._id) return null;

                    const sourceUrl = item.sourceUrl || item.url;
                    const previewUrl = sourceUrl?.startsWith("http")
                      ? sourceUrl
                      : `${API_URL}${sourceUrl || ""}`;

                    return (
                      <div key={item._id} className="resources-card-wrap">
                        <CardPreview item={item} rank={myContent.indexOf(item) + 1} />
                        <div className="resources-meta">
                          <p className="resources-meta-text">
                            Course: {item.courseId?.title || "Standalone"}
                          </p>
                          <p className="resources-meta-text">
                            Source: {item.sourceKind || "unknown"}
                          </p>
                          {sourceUrl && (
                            <a
                              href={previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="resources-inline-link"
                            >
                              Open resource
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id)}
                            className="resources-danger-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}