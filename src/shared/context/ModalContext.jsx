import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiAlertTriangle, FiInfo } from 'react-icons/fi';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  const generateId = () => Date.now() + Math.random();

  // Confirm modal
  const showConfirm = (message, title = "Xác nhận") => {
    return new Promise((resolve) => {
      const id = generateId();
      const modal = {
        id,
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          closeModal(id);
          resolve(false);
        }
      };
      setModals(prev => [...prev, modal]);
    });
  };

  // Open URL modal
  const showOpenUrl = (url, title = "Mở liên kết") => {
    return new Promise((resolve) => {
      const id = generateId();
      const modal = {
        id,
        type: 'openUrl',
        title,
        url,
        onOpen: () => {
          window.open(url, '_blank');
          closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          closeModal(id);
          resolve(false);
        }
      };
      setModals(prev => [...prev, modal]);
    });
  };

  // Info modal
  const showInfo = (message, title = "Thông tin") => {
    return new Promise((resolve) => {
      const id = generateId();
      const modal = {
        id,
        type: 'info',
        title,
        message,
        onClose: () => {
          closeModal(id);
          resolve(true);
        }
      };
      setModals(prev => [...prev, modal]);
    });
  };

  // Custom modal
  const showCustom = (content, options = {}) => {
    return new Promise((resolve) => {
      const id = generateId();
      const modal = {
        id,
        type: 'custom',
        content,
        ...options,
        onClose: (result) => {
          closeModal(id);
          resolve(result);
        }
      };
      setModals(prev => [...prev, modal]);
    });
  };

  const closeModal = (id) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider
      value={{
        showConfirm,
        showOpenUrl,
        showInfo,
        showCustom,
        closeModal,
        closeAllModals
      }}
    >
      {children}
      <ModalsContainer modals={modals} closeModal={closeModal} />
    </ModalContext.Provider>
  );
};

const ModalsContainer = ({ modals, closeModal }) => {
  return (
    <AnimatePresence>
      {modals.map((modal) => (
        <ModalComponent key={modal.id} modal={modal} closeModal={closeModal} />
      ))}
    </AnimatePresence>
  );
};

const ModalComponent = ({ modal, closeModal }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (modal.type === 'confirm') {
        modal.onCancel();
      } else if (modal.type === 'openUrl') {
        modal.onCancel();
      } else {
        modal.onClose && modal.onClose();
      }
    }
  };

  const getIcon = () => {
    switch (modal.type) {
      case 'confirm':
        return <FiAlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'openUrl':
        return <FiExternalLink className="w-6 h-6 text-blue-500" />;
      case 'info':
        return <FiInfo className="w-6 h-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.2 }}
        className="bg-primary border border-secondary rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-white">
              {modal.title}
            </h3>
          </div>
          <button
            onClick={() => {
              if (modal.type === 'confirm') {
                modal.onCancel();
              } else if (modal.type === 'openUrl') {
                modal.onCancel();
              } else {
                modal.onClose && modal.onClose();
              }
            }}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {modal.type === 'custom' ? (
            modal.content
          ) : modal.type === 'openUrl' ? (
            <div>
              <p className="text-secondary mb-4">
                Bạn có muốn mở liên kết này trong tab mới?
              </p>
              <div className="bg-tertiary p-3 rounded-lg">
                <p className="text-sm text-white font-mono break-all">
                  {modal.url}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-secondary">
              {modal.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-secondary bg-tertiary">
          {modal.type === 'confirm' && (
            <>
              <button
                onClick={modal.onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modal.onConfirm}
                className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg font-medium transition-colors"
              >
                Xác nhận
              </button>
            </>
          )}
          
          {modal.type === 'openUrl' && (
            <>
              <button
                onClick={modal.onCancel}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={modal.onOpen}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FiExternalLink className="w-4 h-4" />
                Mở liên kết
              </button>
            </>
          )}
          
          {modal.type === 'info' && (
            <button
              onClick={modal.onClose}
              className="px-6 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg font-medium transition-colors"
            >
              Đóng
            </button>
          )}
          
          {modal.type === 'custom' && modal.actions && modal.actions}
        </div>
      </motion.div>
    </motion.div>
  );
};
