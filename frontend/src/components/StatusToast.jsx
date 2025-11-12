import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const statusStyles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    badge: 'bg-emerald-500',
    title: 'Success',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-900',
    badge: 'bg-red-500',
    title: 'Something went wrong',
  },
  info: {
    container: 'border-amber-200 bg-amber-50 text-amber-900',
    badge: 'bg-amber-500',
    title: 'Heads up',
  },
};

export default function StatusToast({ feedback, onClose }) {
  if (!feedback) return null;
  const variant = statusStyles[feedback.type] || statusStyles.info;

  return (
    <AnimatePresence>
      <motion.div
        key="status-toast"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <div
          className={`relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-lg backdrop-blur ${variant.container}`}
          role="alert"
        >
          <div className="flex items-start gap-4 p-4 pl-5 sm:p-5">
            <span className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${variant.badge}`}>
              {feedback.type === 'success' && '✓'}
              {feedback.type === 'error' && '!'}
              {feedback.type === 'info' && 'ℹ'}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wide uppercase">{feedback.title || variant.title}</p>
              <p className="mt-1 text-sm leading-relaxed">{feedback.message}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-xs font-semibold uppercase tracking-wide transition hover:bg-black/5"
              aria-label="Dismiss notification"
            >
              Close
            </button>
          </div>
          {feedback.actionLabel && feedback.onAction ? (
            <div className="border-t border-black/5 bg-black/5 p-3 text-center text-sm font-medium">
              <button
                type="button"
                onClick={feedback.onAction}
                className="rounded-full bg-black/10 px-4 py-2 transition hover:bg-black/15"
              >
                {feedback.actionLabel}
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

