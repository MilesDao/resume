import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Project, Blog, MediaItem } from "./types";

// Dynamic configuration loading
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials exist. If not, operating in local-fallback mode
export const isFallbackMode = !firebaseConfig.apiKey || !firebaseConfig.projectId;

let db: any = null;

if (!isFallbackMode) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed, falling back to local cache:", error);
  }
}

// ==========================================
// SEED DEFAULT DATA
// ==========================================
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-01",
    title: "COGNITION // APPARATUS",
    category: "Neural Synthesizer",
    year: "2025",
    description: "A real-time high-density acoustic synthesizer translating brainwave telemetry mapping into spatial environments.",
    tags: ["TypeScript", "WebAudio API", "Fast Fourier", "Canvas3D"],
    link: "https://github.com/milesdao/cognition",
    image: "/assets/project_visual.png"
  },
  {
    id: "proj-02",
    title: "ORBITAL_ZERO // METRIQ",
    category: "Satellite Telemetry",
    year: "2025",
    description: "High-performance vector visualizer processing live satellite trajectories with an interactive Kepler orbit model.",
    tags: ["React 19", "WebGL", "Trigonometry", "Tailwind CSS"],
    link: "https://orbital.milesdao.com",
    image: "/assets/project_visual.png"
  },
  {
    id: "proj-03",
    title: "CHRONOS // CONSENSUS",
    category: "Cryptographic state",
    year: "2024",
    description: "Bespoke browser-native cryptographic simulation demonstrating state replication and anti-tamper distributed ledgers.",
    tags: ["Rust", "WASM", "WebRTC", "Reactive Engine"],
    link: "https://chronos.ledger.net",
    image: "/assets/project_visual.png"
  },
  {
    id: "proj-04",
    title: "NEX_SPARK // CORE-VM",
    category: "Virtual Machine",
    year: "2026",
    description: "A sandbox environment parsing bespoke assembly code in a highly visual step-by-step register tape pipeline.",
    tags: ["AST Parser", "Lexer", "React Hooks", "Framer Motion"],
    link: "https://spark.milesdao.com",
    image: "/assets/project_visual.png"
  }
];

const DEFAULT_BLOGS: Blog[] = [
  {
    id: "blog-01",
    title: "DATA_MAPPING // NEURAL_NETWORKS",
    category: "Machine Learning",
    date: "2026-05-12",
    summary: "A detailed analysis of high-density weights mapping in deep feedforward architectures.",
    content: "Deep feedforward networks map high-dimensional representation fields onto logical categories. In this post, we explore how weight telemetry is tracked, optimized, and serialized into visual register matrices in browser engines using WebGL and Canvas.",
    tags: ["Neural Networks", "Telemetry", "WGL", "Data Science"],
    image: "/assets/blog_visual.png"
  },
  {
    id: "blog-02",
    title: "BRUTALIST_UI // DESIGN_PHILOSOPHY",
    category: "User Interfaces",
    date: "2026-06-02",
    summary: "Why modern layout architectures are ditching smooth gradients for high-contrast border grid alignments.",
    content: "Brutalist web interfaces utilize raw layouts, thick borders, monospace typography, and coordinate readouts. By eliminating styling bulk, these systems increase cognitive efficiency and load speeds, providing users with premium, distinct micro-systems.",
    tags: ["UI/UX", "Brutalist CSS", "Minimalism", "Typography"],
    image: "/assets/blog_visual.png"
  }
];

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: "med-01",
    filename: "portrait.png",
    url: "/assets/portrait.png",
    size: "1.91 MB",
    type: "image/png",
    uploadedAt: "2026-06-08"
  },
  {
    id: "med-02",
    filename: "text_texture.png",
    url: "/assets/text_texture.png",
    size: "420 KB",
    type: "image/png",
    uploadedAt: "2026-06-08"
  }
];

// ==========================================
// DATABASE UTILITIES (FIRESTORE / LOCAL STORAGE)
// ==========================================

// Helper to initialize local storage default seeds
const getLocalData = <T>(key: string, defaults: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(data);
};

const saveLocalData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- PROJECTS CRUD ---
export async function getProjects(): Promise<Project[]> {
  if (isFallbackMode) {
    return getLocalData("portfolio_projects", DEFAULT_PROJECTS);
  }
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ ...doc.data() } as Project);
    });
    if (projects.length === 0) {
      // Seed firestore if empty
      for (const proj of DEFAULT_PROJECTS) {
        await saveProject(proj);
      }
      return DEFAULT_PROJECTS;
    }
    return projects;
  } catch (err) {
    console.error("Firestore read error, falling back to LocalStorage:", err);
    return getLocalData("portfolio_projects", DEFAULT_PROJECTS);
  }
}

export async function saveProject(project: Project): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_projects", DEFAULT_PROJECTS);
    const index = list.findIndex(p => p.id === project.id);
    if (index > -1) list[index] = project;
    else list.push(project);
    saveLocalData("portfolio_projects", list);
    return;
  }
  try {
    await setDoc(doc(db, "projects", project.id), project);
  } catch (err) {
    console.error("Firestore write error:", err);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_projects", DEFAULT_PROJECTS);
    const filtered = list.filter(p => p.id !== id);
    saveLocalData("portfolio_projects", filtered);
    return;
  }
  try {
    await deleteDoc(doc(db, "projects", id));
  } catch (err) {
    console.error("Firestore delete error:", err);
    throw err;
  }
}

// --- BLOGS CRUD ---
export async function getBlogs(): Promise<Blog[]> {
  if (isFallbackMode) {
    return getLocalData("portfolio_blogs", DEFAULT_BLOGS);
  }
  try {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogs: Blog[] = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ ...doc.data() } as Blog);
    });
    if (blogs.length === 0) {
      for (const blog of DEFAULT_BLOGS) {
        await saveBlog(blog);
      }
      return DEFAULT_BLOGS;
    }
    return blogs;
  } catch (err) {
    console.error("Firestore blogs read error:", err);
    return getLocalData("portfolio_blogs", DEFAULT_BLOGS);
  }
}

export async function saveBlog(blog: Blog): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_blogs", DEFAULT_BLOGS);
    const index = list.findIndex(b => b.id === blog.id);
    if (index > -1) list[index] = blog;
    else list.push(blog);
    saveLocalData("portfolio_blogs", list);
    return;
  }
  try {
    await setDoc(doc(db, "blogs", blog.id), blog);
  } catch (err) {
    console.error("Firestore blog write error:", err);
    throw err;
  }
}

export async function deleteBlog(id: string): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_blogs", DEFAULT_BLOGS);
    const filtered = list.filter(b => b.id !== id);
    saveLocalData("portfolio_blogs", filtered);
    return;
  }
  try {
    await deleteDoc(doc(db, "blogs", id));
  } catch (err) {
    console.error("Firestore blog delete error:", err);
    throw err;
  }
}

// --- MEDIA CRUD ---
export async function getMedia(): Promise<MediaItem[]> {
  if (isFallbackMode) {
    return getLocalData("portfolio_media", DEFAULT_MEDIA);
  }
  try {
    const querySnapshot = await getDocs(collection(db, "media"));
    const media: MediaItem[] = [];
    querySnapshot.forEach((doc) => {
      media.push({ ...doc.data() } as MediaItem);
    });
    if (media.length === 0) {
      for (const med of DEFAULT_MEDIA) {
        await saveMediaItem(med);
      }
      return DEFAULT_MEDIA;
    }
    return media;
  } catch (err) {
    console.error("Firestore media read error:", err);
    return getLocalData("portfolio_media", DEFAULT_MEDIA);
  }
}

export async function saveMediaItem(item: MediaItem): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_media", DEFAULT_MEDIA);
    const index = list.findIndex(m => m.id === item.id);
    if (index > -1) list[index] = item;
    else list.push(item);
    saveLocalData("portfolio_media", list);
    return;
  }
  try {
    await setDoc(doc(db, "media", item.id), item);
  } catch (err) {
    console.error("Firestore media write error:", err);
    throw err;
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  if (isFallbackMode) {
    const list = getLocalData("portfolio_media", DEFAULT_MEDIA);
    const filtered = list.filter(m => m.id !== id);
    saveLocalData("portfolio_media", filtered);
    return;
  }
  try {
    await deleteDoc(doc(db, "media", id));
  } catch (err) {
    console.error("Firestore media delete error:", err);
    throw err;
  }
}
