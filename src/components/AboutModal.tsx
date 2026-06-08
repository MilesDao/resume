import { motion } from "motion/react";
import { X, Cpu, GitCommit, ShieldCheck, Terminal } from "lucide-react";
import { SkillGroup } from "../types";

interface AboutModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const TECH_STACKS: SkillGroup[] = [
  {
    category: "FRONTEND // SPEC",
    items: ["React (Version 19)", "TypeScript ESM", "Tailwind CSS v4", "Motion (Animate)", "D3.js / Recharts"]
  },
  {
    category: "BACKEND // ENGINE",
    items: ["Node.js Context", "Express Core", "RESTful Routing", "WASM Compilation", "Drizzle ORM"]
  },
  {
    category: "INFRASTRUCTURE // DATA",
    items: ["Cloud Run containers", "PostgreSQL", "Firebase DB / Firestore", "Vite Server Bundler", "Esbuild compiler"]
  }
];

export default function AboutModal({ id, isOpen, onClose }: AboutModalProps) {
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
          <div className="flex justify-between items-start border-b border-neutral-900 pb-6 mb-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase mb-1">
                EX—26 // IDENTITY INDEX
              </p>
              <h2 className="font-display text-3xl font-black tracking-tight text-neutral-900">
                MILES DAO // SPEC
              </h2>
            </div>
            <button
              id="close-about-btn"
              onClick={onClose}
              className="p-2 border border-neutral-900 rounded-full hover:bg-neutral-950 hover:text-[#ebeae4] transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Bio section with technical grid */}
          <div className="space-y-8">
            <div className="border-l-4 border-neutral-950 pl-4 py-2">
              <p className="text-neutral-700 text-sm leading-relaxed max-w-xl font-medium">
                I'm an undergraduate data scientist passionate about data and machine learning. Building insightful data solutions.
              </p>
            </div>

            {/* Core philosophy spec blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-neutral-300 rounded p-4 bg-neutral-200/40">
                <div className="flex items-center gap-2 mb-2 text-neutral-900">
                  <Terminal size={16} />
                  <span className="font-mono text-xs font-bold uppercase">Brutalist Zen</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Focusing on structured lines, clear hierarchy, high-contrast layouts, and keeping zero fluff or unnecessary design bulk.
                </p>
              </div>
              
              <div className="border border-neutral-300 rounded p-4 bg-neutral-200/40">
                <div className="flex items-center gap-2 mb-2 text-neutral-900">
                  <Cpu size={16} />
                  <span className="font-mono text-xs font-bold uppercase">Modern Performance</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Optimized rendering cycles, lightweight bundles, native types, lazy initializations, and swift transitions.
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mt-8">
              <h3 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-300 pb-2 mb-4">
                SYSTEM SPEC METADATA
              </h3>

              <div className="space-y-6">
                {TECH_STACKS.map((stack, idx) => (
                  <div key={idx} className="border border-neutral-300 rounded overflow-hidden">
                    <div className="bg-neutral-950 text-[#ebeae4] px-4 py-2 font-mono text-[10px] tracking-wider uppercase font-bold flex justify-between items-center">
                      <span>{stack.category}</span>
                      <ShieldCheck size={12} className="text-green-400" />
                    </div>
                    <div className="bg-neutral-50 p-4">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {stack.items.map((item, idy) => (
                          <li key={idy} className="flex items-center gap-2 font-mono text-xs text-neutral-700">
                            <GitCommit size={10} className="text-neutral-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            {/* System Outbound Links / Profiles */}
            <div className="mt-8 border-t border-neutral-300 pt-6">
              <h3 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">
                SYSTEM OUTBOUND LINK PORTS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="mailto:trungdao131105@gmail.com"
                  className="flex items-center gap-3 border border-neutral-900 px-4 py-3 bg-neutral-200/50 rounded hover:bg-neutral-950 hover:text-[#ebeae4] transition-all font-mono text-xs font-bold group justify-center sm:justify-start"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-neutral-100" />
                  <span>EMAIL PORT // trungdao131105@gmail.com</span>
                </a>
                <a
                  href="https://github.com/MilesDao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-900 px-4 py-3 bg-neutral-200/50 rounded hover:bg-neutral-950 hover:text-[#ebeae4] transition-all font-mono text-xs font-bold group justify-center sm:justify-start"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-neutral-100" />
                  <span>GITHUB PORT // @MilesDao</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/milesdao/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-neutral-900 px-4 py-3 bg-neutral-200/50 rounded hover:bg-neutral-950 hover:text-[#ebeae4] transition-all font-mono text-xs font-bold group justify-center sm:justify-start"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-neutral-100" />
                  <span>LINKEDIN PORT // @milesdao</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-dashed border-neutral-400 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>COMPILED STACK SPEC 2026</span>
          <span>MILES_DAO@SYSTEM</span>
        </div>
      </motion.div>
    </div>
  );
}
