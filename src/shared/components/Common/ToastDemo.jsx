import React from 'react';
import { useToast } from '../../context/ToastContext';

const ToastDemo = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Toast Notifications Demo</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => showSuccess('Thao tác thành công!')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Success Toast
        </button>
        
        <button
          onClick={() => showError('Có lỗi xảy ra!')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Error Toast
        </button>
        
        <button
          onClick={() => showWarning('Cảnh báo: Hành động này không thể hoàn tác!')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Warning Toast
        </button>
        
        <button
          onClick={() => showInfo('Thông tin hữu ích cho bạn')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Info Toast
        </button>
      </div>
    </div>
  );
};

export default ToastDemo;
