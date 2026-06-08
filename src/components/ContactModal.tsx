import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Terminal, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ id, isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [step, setStep] = useState(0); // 0: Form, 1: Submitting, 2: Success
  const [submittingProgress, setSubmittingProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const executePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStep(1);
    setConsoleLines(["INITIALIZING SECURE TRANSPORT LAYER PROTOCOL..."]);
    
    // Simulate complex pipeline loading logs
    const logs = [
      "RESOLVING TARGET ENDPOINT: TRUNGDAO131105@GMAIL.COM...",
      "ESTABLISHING SSL HANDSHAKE [ECDHE-RSA-AES128-GCM-SHA256]...",
      "CREATING DATASTREAM CHUNK...",
      `ENCRYPTING MESSAGE DATA FROM <${formData.email}>...`,
      "COMPILED SPECS VERIFIED. WRITING STRUCTURAL PAYLOAD...",
      "PUSHING TO DATALAKE PIPELINE: SUCCESS [200 OK]"
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setConsoleLines((prev) => [...prev, logs[i]]);
      setSubmittingProgress(((i + 1) / logs.length) * 100);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    setStep(2);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    setConsoleLines([]);
    setStep(0);
    setSubmittingProgress(0);
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
        className="relative w-full max-w-2xl h-screen md:h-[96vh] md:my-[2vh] md:rounded-l-2xl bg-neutral-900 border-l-2 border-neutral-950 text-[#ebeae4] p-6 md:p-12 shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-800 pb-6 mb-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase mb-1">
                SECURE STREAM PIPELINE // TX // TRUNGDAO131105@GMAIL.COM
              </p>
              <h2 className="font-display text-3xl font-black tracking-tight text-neutral-100 flex items-center gap-2">
                <Terminal size={24} className="text-green-400" /> CONTACT SYSTEM
              </h2>
            </div>
            <button
              id="close-contact-btn"
              onClick={onClose}
              className="p-2 border border-neutral-700 rounded-full hover:bg-[#ebeae4] hover:text-neutral-900 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form
                id="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={executePipeline}
                className="space-y-6"
              >
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase mb-2">
                    IDENTIFIER NAME [INPUT]
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.G., JOHN DOE"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 font-mono text-xs text-[#ebeae4] focus:border-green-400 focus:outline-none transition-colors uppercase placeholder-neutral-700"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase mb-2">
                    EMAIL VECTOR [ROUTE]
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.G., DEVS@DOMAIN.COM"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 font-mono text-xs text-[#ebeae4] focus:border-green-400 focus:outline-none transition-colors uppercase placeholder-neutral-700"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-neutral-400 uppercase mb-2">
                    TRANSMISSION MESSAGE [PAYLOAD]
                  </label>
                  <textarea
                    id="contact-message-input"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="ENTER DETAILED LOGICAL PROPOSAL..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-4 py-3 font-mono text-xs text-[#ebeae4] focus:border-green-400 focus:outline-none transition-colors uppercase placeholder-neutral-700 resize-none"
                  />
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#ebeae4] hover:bg-white text-neutral-950 font-mono text-xs font-black py-4 px-6 rounded uppercase transition-colors"
                >
                  INITIALIZE PIPE TRANSMISSION <Send size={14} />
                </button>
              </motion.form>
            )}

            {step === 1 && (
              <motion.div
                key="pipeline-submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-neutral-950 border border-neutral-800 rounded p-4 font-mono text-[10px] text-green-400 space-y-2 h-72 overflow-y-auto">
                  {consoleLines.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-1">
                      <span className="text-neutral-600">&gt;</span>
                      <p>{line}</p>
                    </div>
                  ))}
                  <div className="w-2 h-4 bg-green-400 animate-pulse inline-block" />
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                    <span>TRANSMITTING ENCRYPTED STREAMS</span>
                    <span>{Math.round(submittingProgress)}%</span>
                  </div>
                  <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-green-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${submittingProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="pipeline-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
              >
                <CheckCircle2 size={54} className="text-green-400 animate-bounce" />
                <div className="space-y-2">
                  <p className="font-display text-2xl font-black text-neutral-100 uppercase">
                    DATA STREAM WRITE STATUS OK
                  </p>
                  <p className="font-mono text-neutral-400 text-xs max-w-sm mx-auto uppercase">
                    Your transmission was successfully cached and piped securely. I will monitor this segment vector and respond shortly.
                  </p>
                </div>

                <div className="border border-neutral-800 bg-neutral-950 p-4 rounded text-left font-mono text-[10px] space-y-1 text-neutral-400 max-w-sm w-full">
                  <p className="text-[#ebeae4] font-bold">TRANSMISSION HEADER ID:</p>
                  <p>M-DAO-{(Math.random() * 10000000).toFixed(0)}</p>
                  <p className="pt-2 text-[#ebeae4] font-bold">ROUTED TARGET ENDPOINT:</p>
                  <p>TRUNGDAO131105@GMAIL.COM</p>
                  <p className="pt-2 text-[#ebeae4] font-bold">HOST VECTOR TIMESTAMP:</p>
                  <p>{new Date().toISOString()}</p>
                </div>

                <button
                  id="reset-contact-btn"
                  onClick={handleReset}
                  className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-[#ebeae4] font-mono text-xs px-6 py-3 rounded uppercase transition-colors"
                >
                  COMPILE NEW PAYLOAD
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex justify-between items-center text-xs font-mono text-neutral-500">
          <span>TX INTERFACE PIPELINE v26</span>
          <span>MILES_DAO@SECURE_NET</span>
        </div>
      </motion.div>
    </div>
  );
}
