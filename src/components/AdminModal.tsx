import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldAlert, Cpu, Terminal, ShieldCheck, Trash2, Plus, Upload, Check } from "lucide-react";
import { 
  isFallbackMode, 
  getProjects, saveProject, deleteProject, 
  getBlogs, saveBlog, deleteBlog,
  getMedia, saveMediaItem, deleteMediaItem
} from "../firebase";
import { Project, Blog, MediaItem } from "../types";

interface AdminModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ id, isOpen, onClose }: AdminModalProps) {
  const [accessKey, setAccessKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState(false);
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<"projects" | "blogs" | "media">("projects");
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [blogsList, setBlogsList] = useState<Blog[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "",
    year: new Date().getFullYear().toString(),
    description: "",
    tags: "",
    link: "",
    image: ""
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    category: "",
    summary: "",
    content: "",
    tags: "",
    image: ""
  });

  // Media Mock Upload states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // Load lists upon successful authentication
  useEffect(() => {
    if (isAuthorized) {
      loadAllData();
    }
  }, [isAuthorized]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const projs = await getProjects();
      const blgs = await getBlogs();
      const med = await getMedia();
      setProjectsList(projs);
      setBlogsList(blgs);
      setMediaList(med);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret access key is miles2026
    if (accessKey === "miles2026") {
      setIsAuthorized(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      // reset error blinking after 2 seconds
      setTimeout(() => setAuthError(false), 2000);
    }
  };

  // --- PROJECT CRUD HANDLERS ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.category || !projectForm.description) return;

    setIsLoading(true);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: projectForm.title.toUpperCase(),
      category: projectForm.category,
      year: projectForm.year,
      description: projectForm.description,
      tags: projectForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      link: projectForm.link || undefined,
      image: projectForm.image || "/assets/project_visual.png"
    };

    try {
      await saveProject(newProj);
      setProjectForm({ title: "", category: "", year: new Date().getFullYear().toString(), description: "", tags: "", link: "", image: "" });
      await loadAllData();
    } catch (err) {
      alert("Error saving project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsLoading(true);
    try {
      await deleteProject(id);
      await loadAllData();
    } catch (err) {
      alert("Error deleting project");
    } finally {
      setIsLoading(false);
    }
  };

  // --- BLOG CRUD HANDLERS ---
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.category || !blogForm.content) return;

    setIsLoading(true);
    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title: blogForm.title.toUpperCase(),
      category: blogForm.category,
      date: new Date().toISOString().split("T")[0],
      summary: blogForm.summary || blogForm.content.slice(0, 100) + "...",
      content: blogForm.content,
      tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      image: blogForm.image || "/assets/blog_visual.png"
    };

    try {
      await saveBlog(newBlog);
      setBlogForm({ title: "", category: "", summary: "", content: "", tags: "", image: "" });
      await loadAllData();
    } catch (err) {
      alert("Error saving blog post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setIsLoading(true);
    try {
      await deleteBlog(id);
      await loadAllData();
    } catch (err) {
      alert("Error deleting blog post");
    } finally {
      setIsLoading(false);
    }
  };

  // --- MEDIA MOCK UPLOAD HANDLER ---
  const simulateFileUpload = async (filename: string, size: string, type: string) => {
    setUploadProgress(0);
    setUploadLogs(["INITIATING FTP SEGMENT TRANSIT LAYER..."]);
    
    const logs = [
      "PACKAGING MEDIA ARTIFACT MATRIX DATA...",
      `UPLOADING FILE CHUNK: ${filename} (${size})`,
      "WRITING DATA BLOCKS TO DEPLOYED DATASTORE...",
      "CACHING DATA METADATA REGISTERS...",
      "DATABASE SYNCHRONIZATION: COMPLETED SUCCESSFULLY"
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadLogs(prev => [...prev, logs[i]]);
      setUploadProgress(((i + 1) / logs.length) * 100);
    }

    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      filename,
      url: `/assets/${filename}`,
      size,
      type,
      uploadedAt: new Date().toISOString().split("T")[0]
    };

    try {
      await saveMediaItem(newMedia);
      await loadAllData();
    } catch (err) {
      alert("Error caching media");
    } finally {
      setTimeout(() => {
        setUploadProgress(null);
        setUploadLogs([]);
      }, 1000);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      simulateFileUpload(file.name, fileSize, file.type);
    }
  };

  const triggerMockUpload = () => {
    simulateFileUpload(`asset_render_${(Math.random() * 1000).toFixed(0)}.png`, "1.25 MB", "image/png");
  };

  const handleMediaDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset?")) return;
    setIsLoading(true);
    try {
      await deleteMediaItem(id);
      await loadAllData();
    } catch (err) {
      alert("Error deleting media item");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id={id} className="fixed inset-0 z-50 flex items-center justify-end font-sans pr-0 md:pr-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950 cursor-pointer"
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: "100%", opacity: 0.9 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl h-screen md:h-[96vh] md:my-[2vh] md:rounded-l-2xl bg-[#ebeae4] border-l-2 border-neutral-950 p-6 md:p-12 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-900 pb-6 mb-6">
            <div>
              <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase mb-1">
                SECURE CONSOLE // MANAGEMENT
              </p>
              <h2 className="font-display text-3xl font-black tracking-tight text-neutral-900 flex items-center gap-2">
                <Terminal size={24} className="text-neutral-950" /> SYSTEM ADMIN
              </h2>
            </div>
            <button
              id="close-admin-btn"
              onClick={onClose}
              className="p-2 border border-neutral-900 rounded-full hover:bg-neutral-950 hover:text-[#ebeae4] transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Secure access key check */}
          {!isAuthorized ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <motion.div
                animate={authError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`w-full max-w-sm border-2 p-6 rounded bg-neutral-50 ${
                  authError ? "border-red-600 bg-red-50 text-red-950" : "border-neutral-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {authError ? <ShieldAlert size={20} className="text-red-600 animate-pulse" /> : <Cpu size={20} />}
                  <span className="font-mono text-xs font-black uppercase">
                    {authError ? "DECRYPTION SECURITY FAULT" : "SECURED SESSION ACCESS"}
                  </span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5">
                      ENTER ENCRYPTION KEYWORD
                    </label>
                    <input
                      type="password"
                      placeholder="ACCESS KEY"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className={`w-full bg-neutral-100 border border-neutral-900 rounded px-3 py-2.5 font-mono text-xs text-neutral-950 focus:outline-none placeholder-neutral-400 uppercase tracking-widest ${
                        authError ? "border-red-600 focus:border-red-600" : "focus:border-neutral-950"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 border border-neutral-900 text-xs font-mono font-bold uppercase rounded transition-colors ${
                      authError 
                        ? "bg-red-600 text-white border-red-700" 
                        : "bg-neutral-950 text-[#ebeae4] hover:bg-neutral-800"
                    }`}
                  >
                    {authError ? "ACCESS DENIED" : "ESTABLISH CONSOLE PORT"}
                  </button>
                </form>
              </motion.div>
            </div>
          ) : (
            // AUTHENTICATED STATE
            <div className="space-y-6">
              {/* Dynamic Status readouts */}
              <div className={`p-3 rounded border font-mono text-[10px] flex items-center justify-between ${
                isFallbackMode 
                  ? "bg-amber-50 border-amber-300 text-amber-900" 
                  : "bg-emerald-50 border-emerald-300 text-emerald-900"
              }`}>
                <div className="flex items-center gap-2">
                  {isFallbackMode ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                  <span className="font-bold">
                    {isFallbackMode ? "SYS.STATUS: OFFLINE CACHE PORT" : "SYS.STATUS: CLOUD SYNCHRONIZED"}
                  </span>
                </div>
                <span>{isFallbackMode ? "[LOCALSTORAGE_BACKUP]" : "[FIRESTORE_ACTIVE]"}</span>
              </div>

              {/* Console Tabs */}
              <div className="flex border-b border-neutral-300 font-mono text-xs gap-1.5 pb-px">
                {(["projects", "blogs", "media"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 border border-b-0 border-neutral-900 rounded-t uppercase font-bold relative transition-colors ${
                      activeTab === tab 
                        ? "bg-neutral-950 text-[#ebeae4] translate-y-0.5" 
                        : "bg-neutral-200/50 hover:bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TABS CONTAINER */}
              <div className="bg-neutral-50/50 p-4 border border-neutral-900 rounded min-h-[350px]">
                {isLoading && (
                  <div className="text-center py-12 font-mono text-xs text-neutral-500 animate-pulse">
                    EXECUTING DATABASE FETCH QUERY...
                  </div>
                )}

                {!isLoading && activeTab === "projects" && (
                  <div className="space-y-6">
                    {/* Add Project Form */}
                    <form onSubmit={handleProjectSubmit} className="space-y-3 bg-neutral-100 p-4 border border-neutral-300 rounded">
                      <h4 className="font-mono text-xs font-black uppercase text-neutral-800 pb-1 border-b border-neutral-300">
                        ADD PROJECT ENTRY
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Project Title"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g., Virtual Machine)"
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Year"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({...projectForm, year: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Tags (comma separated)"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                          className="col-span-2 bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>
                      <textarea
                        placeholder="Description text snippet..."
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                        className="w-full bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs h-16 resize-none"
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Project Link URL (optional)"
                          value={projectForm.link}
                          onChange={(e) => setProjectForm({...projectForm, link: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Image URL (optional)"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm({...projectForm, image: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 text-[#ebeae4] rounded font-mono text-[10px] font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                        <Plus size={12} /> DEPLOY ARTIFACT
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest pb-1 border-b border-neutral-200">
                        ACTIVE ARTIFACT REGISTERS ({projectsList.length})
                      </h4>
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {projectsList.map((proj) => (
                          <div key={proj.id} className="flex justify-between items-center bg-white p-3 border border-neutral-300 rounded font-mono text-xs">
                            <div className="text-left">
                              <p className="font-bold text-neutral-900">{proj.title}</p>
                              <p className="text-[10px] text-neutral-500">{proj.category} // {proj.year}</p>
                            </div>
                            <button
                              onClick={() => handleProjectDelete(proj.id)}
                              className="p-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!isLoading && activeTab === "blogs" && (
                  <div className="space-y-6">
                    {/* Add Blog Form */}
                    <form onSubmit={handleBlogSubmit} className="space-y-3 bg-neutral-100 p-4 border border-neutral-300 rounded">
                      <h4 className="font-mono text-xs font-black uppercase text-neutral-800 pb-1 border-b border-neutral-300">
                        PUBLISH JOURNAL ENTRY
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Article Title"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Category (e.g., Machine Learning)"
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Tags (comma separated)"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})}
                          className="col-span-3 bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Short Summary / Excerpt"
                          value={blogForm.summary}
                          onChange={(e) => setBlogForm({...blogForm, summary: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Image URL (optional)"
                          value={blogForm.image}
                          onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                          className="bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs"
                        />
                      </div>
                      <textarea
                        placeholder="Write article markdown content..."
                        value={blogForm.content}
                        onChange={(e) => setBlogForm({...blogForm, content: e.target.value})}
                        className="w-full bg-white border border-neutral-400 rounded px-2.5 py-1.5 font-mono text-xs h-24 resize-none"
                        required
                      />
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 text-[#ebeae4] rounded font-mono text-[10px] font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                        <Plus size={12} /> PUBLISH ARTICLE
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest pb-1 border-b border-neutral-200">
                        JOURNAL ARTICLE REGISTERS ({blogsList.length})
                      </h4>
                      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                        {blogsList.map((blog) => (
                          <div key={blog.id} className="flex justify-between items-center bg-white p-3 border border-neutral-300 rounded font-mono text-xs">
                            <div className="text-left">
                              <p className="font-bold text-neutral-900">{blog.title}</p>
                              <p className="text-[10px] text-neutral-500">{blog.category} // {blog.date}</p>
                            </div>
                            <button
                              onClick={() => handleBlogDelete(blog.id)}
                              className="p-1.5 border border-red-200 rounded hover:bg-red-50 text-red-600 transition-colors"
                              title="Delete article"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!isLoading && activeTab === "media" && (
                  <div className="space-y-6">
                    {/* Drag and Drop Zone */}
                    <div className="relative font-mono text-xs select-none">
                      <div
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={triggerMockUpload}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                          dragOver 
                            ? "border-neutral-950 bg-neutral-200/50" 
                            : "border-neutral-400 hover:border-neutral-700 bg-neutral-100"
                        }`}
                      >
                        <Upload size={24} className="mx-auto mb-2 text-neutral-600" />
                        <p className="font-bold uppercase text-neutral-800">DRAG & DROP FILE</p>
                        <p className="text-[10px] text-neutral-500 mt-1">OR CLICK TO MOCK UPLOAD PORTRAIT IMAGE</p>
                      </div>

                      {/* Upload console logs overlay */}
                      {uploadProgress !== null && (
                        <div className="absolute inset-0 bg-neutral-950 border border-neutral-900 rounded-lg p-4 text-left text-green-400 font-mono text-[9px] flex flex-col justify-between z-40">
                          <div className="space-y-1 h-20 overflow-y-auto">
                            {uploadLogs.map((log, id) => (
                              <div key={id} className="flex items-start gap-1">
                                <span>&gt;</span>
                                <p>{log}</p>
                              </div>
                            ))}
                            <div className="w-1.5 h-3 bg-green-400 animate-pulse inline-block" />
                          </div>
                          
                          <div className="space-y-1 mt-2">
                            <div className="flex justify-between font-mono text-[8px] text-neutral-400">
                              <span>FTP UPLOAD IN TRANSIT</span>
                              <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 transition-all duration-100" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Listing Grid */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest pb-1 border-b border-neutral-200">
                        CACHED MEDIA PORT INVENTORY ({mediaList.length})
                      </h4>
                      <div className="max-h-60 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-3">
                          {mediaList.map((item) => (
                            <div key={item.id} className="flex flex-col justify-between bg-white p-2.5 border border-neutral-300 rounded font-mono text-[10px] relative group overflow-hidden">
                              <div className="flex items-start justify-between">
                                <div className="text-left truncate w-[calc(100%-20px)]">
                                  <p className="font-bold text-neutral-950 truncate" title={item.filename}>{item.filename}</p>
                                  <p className="text-neutral-500">{item.size} // {item.type.split("/")[1].toUpperCase()}</p>
                                  <p className="text-neutral-400 mt-1">SYNCED: {item.uploadedAt}</p>
                                </div>
                                <button
                                  onClick={() => handleMediaDelete(item.id)}
                                  className="p-1 border border-red-200 rounded hover:bg-red-50 text-red-600 transition-colors"
                                  title="Delete asset"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                              <div className="mt-2 h-14 bg-neutral-100 rounded border border-dashed border-neutral-300 flex items-center justify-center text-[8px] text-neutral-400 font-bold overflow-hidden select-none">
                                {item.filename.endsWith(".png") ? (
                                  <img src={item.url} alt="" className="w-full h-full object-cover opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                ) : (
                                  "BINARY_STREAM"
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-dashed border-neutral-400 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>CONSOLE SERVICE PANEL v26</span>
          <span>MILES_DAO@SECURE_NET</span>
        </div>
      </motion.div>
    </div>
  );
}
