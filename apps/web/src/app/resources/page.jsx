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

      const meResult = await apiFetch("/api/users/me");
      if (!meResult.ok) {
        if (meResult.status === 401) {
          removeAccessToken();
          localStorage.removeItem("creator");
          setError("Your session is no longer valid. Please sign in again.");
          setLoading(false);
          router.push("/login");
          return;
        }

        setError(meResult.data?.message || "Please sign in to access resources");
        setLoading(false);
        return;
      }

      setUser(meResult.data);
      localStorage.setItem("role", meResult.data.role || "");
      localStorage.setItem("creator", String(Boolean(meResult.data.creator)));

      if (meResult.data.role !== "admin" && !meResult.data.creator) {
        setLoading(false);
        
        return;
      }

      const [coursesResult, contentResult] = await Promise.all([
        apiFetch("/api/courses/mine"),
        apiFetch("/api/content/mine"),
      ]);

      if (!coursesResult.ok) {
        setError(coursesResult.data?.message || "Failed to load courses");
      } else {
        setCourses(Array.isArray(coursesResult.data) ? coursesResult.data : []);
      }

      if (!contentResult.ok) {
        setError(contentResult.data?.message || "Failed to load your content");
      } else {
        setMyContent(
          Array.isArray(contentResult.data)
            ? contentResult.data.map(normalizeContentItem)
            : []
        );
      }

      setLoading(false);
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

  async function refreshContent() {
    const result = await apiFetch("/api/content/mine");

    if (!result.ok) {
      throw new Error(result.data?.message || "Failed to load your content");
    }

    setMyContent(
      Array.isArray(result.data) ? result.data.map(normalizeContentItem) : []
    );
  }

  async function handleCreateCourse(event) {
    event.preventDefault();
    setCourseSubmitting(true);
    setError("");
    setSuccessMsg("");

    const result = await apiFetch("/api/courses", {
      method: "POST",
      body: JSON.stringify({
        title: newCourseTitle,
        description: newCourseDescription,
      }),
    });

    if (!result.ok) {
      setError(result.data?.message || "Failed to create course");
      setCourseSubmitting(false);
      return;
    }

    setCourses((current) => [result.data, ...current]);
    setCourseId(result.data._id);
    setNewCourseTitle("");
    setNewCourseDescription("");
    setSuccessMsg("Course created successfully");
    setCourseSubmitting(false);
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

      const result = await apiFetch("/api/content", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to create content");
      }

      setSuccessMsg("Content uploaded successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setSubject("");
      setGradeLevel("");
      setFiles([]);
      setUrlItems([{ ...emptyUrlItem }]);
      await refreshContent();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setSuccessMsg("");

    const result = await apiFetch(`/api/content/${id}`, {
      method: "DELETE",
    });

    if (!result.ok) {
      setError(result.data?.message || "Delete failed");
      return;
    }

    setMyContent((current) => current.filter((item) => item._id !== id));
    setSuccessMsg("Content deleted successfully");
  }

  return (
    <AppLayout>
      <Topbar placeholder="Search your courses, uploads, and resource drafts..." />
      <div style={pageStyle}>
        <section style={heroStyle}>
          <div>
            <p style={eyebrowStyle}>Creator Workspace</p>
            <h1 style={titleStyle}>Manage courses and publish learning resources</h1>
            <p style={subtitleStyle}>
              This area is available only to admins and users with creator access.
            </p>
          </div>
          {user && (
            <div style={badgeRowStyle}>
              <span style={statusBadgeStyle}>
                Role: {(user.role || "user").toUpperCase()}
              </span>
              <span style={statusBadgeStyle}>
                Creator: {user.creator ? "Enabled" : "Disabled"}
              </span>
            </div>
          )}
        </section>

        {error && <div style={errorStyle}>{error}</div>}
        {successMsg && <div style={successStyle}>{successMsg}</div>}

        {loading ? (
          <div style={panelStyle}>Loading resource workspace...</div>
        ) : !canManageResources ? (
          <div style={panelStyle}>
            <h2 style={sectionTitleStyle}>Access restricted</h2>
            <p style={sectionTextStyle}>
              Only admins or users with `creator` access can open this page.
            </p>
            <div style={actionRowStyle}>
              <Link href="/contribute" style={primaryLinkStyle}>
                Request creator access
              </Link>
              <Link href="/dashboard" style={secondaryLinkStyle}>
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section style={twoColumnStyle}>
              <form onSubmit={handleCreateCourse} style={panelStyle}>
                <h2 style={sectionTitleStyle}>Create Course</h2>
                <p style={sectionTextStyle}>
                  Group upcoming resources into a course before you publish them.
                </p>
                <input
                  type="text"
                  placeholder="Course title"
                  value={newCourseTitle}
                  onChange={(event) => setNewCourseTitle(event.target.value)}
                  required
                  style={inputStyle}
                />
                <textarea
                  placeholder="Course description"
                  value={newCourseDescription}
                  onChange={(event) => setNewCourseDescription(event.target.value)}
                  style={{ ...inputStyle, minHeight: 100 }}
                />
                <button type="submit" disabled={courseSubmitting} style={buttonStyle}>
                  {courseSubmitting ? "Creating..." : "Create Course"}
                </button>
              </form>

              <form onSubmit={handleSubmit} style={panelStyle}>
                <h2 style={sectionTitleStyle}>Add Resource</h2>
                <p style={sectionTextStyle}>
                  Upload files or add external URLs for the course materials you manage.
                </p>

                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  style={inputStyle}
                >
                  <option value="">No course selected</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Default title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  style={inputStyle}
                />
                <textarea
                  placeholder="Default description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  style={{ ...inputStyle, minHeight: 100 }}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Grade level"
                  value={gradeLevel}
                  onChange={(event) => setGradeLevel(event.target.value)}
                  style={inputStyle}
                />

                <div style={modeSwitchStyle}>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    style={uploadMode === "file" ? activeSmallBtn : smallBtn}
                  >
                    Upload files
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    style={uploadMode === "url" ? activeSmallBtn : smallBtn}
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
                      style={inputStyle}
                    />
                    {files.length > 0 && (
                      <div style={metaListStyle}>
                        {files.map((file) => (
                          <span key={`${file.name}-${file.size}`} style={chipStyle}>
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={urlStackStyle}>
                    {urlItems.map((item, index) => (
                      <div key={`url-item-${index}`} style={urlCardStyle}>
                        <input
                          type="text"
                          placeholder="Resource title"
                          value={item.title}
                          onChange={(event) =>
                            handleUrlItemChange(index, "title", event.target.value)
                          }
                          style={inputStyle}
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.url}
                          onChange={(event) =>
                            handleUrlItemChange(index, "url", event.target.value)
                          }
                          style={inputStyle}
                        />
                        <select
                          value={item.type}
                          onChange={(event) =>
                            handleUrlItemChange(index, "type", event.target.value)
                          }
                          style={inputStyle}
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
                          style={{ ...inputStyle, minHeight: 90 }}
                        />
                        <input
                          type="text"
                          placeholder="Optional category override"
                          value={item.category}
                          onChange={(event) =>
                            handleUrlItemChange(index, "category", event.target.value)
                          }
                          style={inputStyle}
                        />
                        {urlItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeUrlItem(index)}
                            style={dangerBtn}
                          >
                            Remove URL row
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addUrlItem} style={smallBtn}>
                      Add another URL
                    </button>
                  </div>
                )}

                <button type="submit" disabled={submitting} style={buttonStyle}>
                  {submitting ? "Saving..." : "Save Resource"}
                </button>
              </form>
            </section>

            <section style={sectionBlockStyle}>
              <div style={sectionHeaderStyle}>
                <div>
                  <h2 style={sectionTitleStyle}>My Courses</h2>
                  <p style={sectionTextStyle}>
                    {courses.length} course{courses.length === 1 ? "" : "s"} available for
                    attaching resources.
                  </p>
                </div>
              </div>

              {courses.length === 0 ? (
                <div style={panelStyle}>No courses yet. Create your first course above.</div>
              ) : (
                <div style={courseGridStyle}>
                  {courses.map((course) => (
                    <div key={course._id} style={panelStyle}>
                      <strong>{course.title}</strong>
                      <p style={sectionTextStyle}>
                        {course.description || "No description yet."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={sectionBlockStyle}>
  <div style={sectionHeaderStyle}>
    <div>
      <h2 style={sectionTitleStyle}>My Uploaded Content</h2>
      <p style={sectionTextStyle}>
        Review what you have published and remove items you no longer want visible.
      </p>
    </div>
  </div>

  {myContent.length === 0 ? (
    <div style={panelStyle}>No content yet. Add a file or URL to get started.</div>
  ) : (
    <div style={contentGridStyle}>
      {myContent.map((item, index) => {
        // Skip invalid items
        if (!item || !item._id) return null;
        
        const sourceUrl = item.sourceUrl || item.url;
        const previewUrl = sourceUrl?.startsWith("http")
          ? sourceUrl
          : `${API_URL}${sourceUrl || ""}`;

        return (
          <div key={item._id} style={resourceCardWrapStyle}>
            {/* Pass 'item' prop, not 'resource' */}
            <CardPreview item={item} rank={index + 1} />
            <div style={resourceMetaStyle}>
              <p style={metaTextStyle}>
                Course: {item.courseId?.title || "Standalone"}
              </p>
              <p style={metaTextStyle}>
                Source: {item.sourceKind || "unknown"}
              </p>
              {sourceUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={inlineLinkStyle}
                >
                  Open resource
                </a>
              )}
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                style={dangerBtn}
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

const pageStyle = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "24px 24px 40px",
};

const heroStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 18,
  marginBottom: 24,
  padding: 24,
  borderRadius: 24,
  background:
    "linear-gradient(135deg, rgba(9,42,74,0.96) 0%, rgba(18,98,124,0.95) 58%, rgba(232,183,91,0.92) 100%)",
  color: "#fff",
  flexWrap: "wrap",
};

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  opacity: 0.8,
};

const titleStyle = {
  margin: "10px 0 8px",
  fontSize: "clamp(2rem, 4vw, 3rem)",
  lineHeight: 1.05,
};

const subtitleStyle = {
  margin: 0,
  maxWidth: 700,
  fontSize: 16,
  lineHeight: 1.6,
  opacity: 0.88,
};

const badgeRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const statusBadgeStyle = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.2)",
  fontSize: 13,
  fontWeight: 600,
};

const twoColumnStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 20,
  alignItems: "start",
};

const sectionBlockStyle = {
  marginTop: 28,
};

const sectionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 14,
};

const panelStyle = {
  background: "#ffffff",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 18px 40px rgba(12, 36, 62, 0.08)",
  border: "1px solid rgba(15, 23, 42, 0.06)",
};

const sectionTitleStyle = {
  margin: "0 0 6px",
  fontSize: 24,
  color: "#10243c",
};

const sectionTextStyle = {
  margin: 0,
  color: "#516072",
  lineHeight: 1.6,
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #d9e0e7",
  marginTop: 12,
  background: "#fbfdff",
};

const buttonStyle = {
  marginTop: 14,
  padding: "12px 16px",
  border: "none",
  borderRadius: 14,
  background: "#0f7a85",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const smallBtn = {
  padding: "10px 12px",

  borderRadius: 12,
  background: "#f4f7fa",
  cursor: "pointer",
};

const activeSmallBtn = {
  ...smallBtn,
  background: "#10243c",
  color: "#fff",
  borderColor: "#10243c",
};

const dangerBtn = {
  padding: "10px 12px",
  border: "none",
  borderRadius: 12,
  background: "#c83d3d",
  color: "#fff",
  cursor: "pointer",
};

const modeSwitchStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 12,
};

const urlStackStyle = {
  display: "grid",
  gap: 12,
  marginTop: 12,
};

const urlCardStyle = {
  padding: 16,
  borderRadius: 18,
  background: "#f7fafc",
  border: "1px solid #e2e8f0",
};

const courseGridStyle = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
};

const contentGridStyle = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const resourceCardWrapStyle = {
  display: "grid",
  gap: 10,
};

const resourceMetaStyle = {
  ...panelStyle,
  padding: 16,
};

const metaTextStyle = {
  margin: "0 0 8px",
  color: "#516072",
  fontSize: 14,
};

const inlineLinkStyle = {
  display: "inline-block",
  marginBottom: 10,
  color: "#0f5f9a",
  textDecoration: "none",
  fontWeight: 600,
};

const metaListStyle = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 12,
};

const chipStyle = {
  padding: "8px 10px",
  borderRadius: 999,
  background: "#edf6ff",
  color: "#1b4f7a",
  fontSize: 13,
};

const errorStyle = {
  ...panelStyle,
  marginBottom: 18,
  background: "#fff4f4",
  border: "1px solid #f1c3c3",
  color: "#8d2121",
};

const successStyle = {
  ...panelStyle,
  marginBottom: 18,
  background: "#f3fff5",
  border: "1px solid #bfe5c4",
  color: "#1c6a31",
};

const actionRowStyle = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

const primaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: 14,
  background: "#0f7a85",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: 14,
  background: "#f4f7fa",
  color: "#10243c",
  textDecoration: "none",
  fontWeight: 700,
};