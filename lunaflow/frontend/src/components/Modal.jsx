// ============================================================
// src/components/Modal.jsx — Reusable Modal Dialog
// ============================================================

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modal Component
 * Usage:
 * <Modal isOpen={bool} onClose={fn} title="Add Period">...</Modal>
 */

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}) {

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const widthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal Wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className={`w-full ${widthMap[maxWidth]}`}
            >

              <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-pink-50 sticky top-0 bg-white z-10">
                  
                  <h3 className="font-display text-xl font-semibold text-gray-800">
                    {title}
                  </h3>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6">
                  {children}
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}