import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 3000,
      ...toast,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options,
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      duration: 5000,
      ...options,
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options,
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options,
    });
  }, [addToast]);

  const getToastStyles = (type) => {
    const styles = {
      success: {
        bg: 'bg-green-500/90',
        border: 'border-green-400/50',
        iconBg: 'bg-green-600/30',
        textColor: 'text-green-100',
        progressBar: 'bg-green-600/30',
      },
      error: {
        bg: 'bg-red-500/90',
        border: 'border-red-400/50',
        iconBg: 'bg-red-600/30',
        textColor: 'text-red-100',
        progressBar: 'bg-red-600/30',
      },
      warning: {
        bg: 'bg-yellow-500/90',
        border: 'border-yellow-400/50',
        iconBg: 'bg-yellow-600/30',
        textColor: 'text-yellow-100',
        progressBar: 'bg-yellow-600/30',
      },
      info: {
        bg: 'bg-blue-500/90',
        border: 'border-blue-400/50',
        iconBg: 'bg-blue-600/30',
        textColor: 'text-blue-100',
        progressBar: 'bg-blue-600/30',
      },
    };
    return styles[type] || styles.info;
  };

  const getIcon = (type) => {
    const icons = {
      success: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[type] || icons.info;
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        addToast,
        removeToast,
      }}
    >
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="pointer-events-auto"
              >
                <div className={`${styles.bg} backdrop-blur-sm border ${styles.border} rounded-lg p-4 shadow-2xl`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                        {getIcon(toast.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      {toast.title && (
                        <h3 className="text-white font-semibold text-sm mb-1">{toast.title}</h3>
                      )}
                      <p className={`${styles.textColor} text-xs`}>{toast.message}</p>
                    </div>
                    <button
                      onClick={() => removeToast(toast.id)}
                      className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Progress bar */}
                  <motion.div 
                    className={`mt-3 h-1 ${styles.progressBar} rounded-full overflow-hidden`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div 
                      className="h-full bg-white/60 rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: toast.duration / 1000, ease: "linear" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
