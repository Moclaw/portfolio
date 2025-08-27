import React from 'react';
import { useModal } from '../../context/ModalContext';

const ModalDemo = () => {
  const { showConfirm, showOpenUrl, showInfo, showCustom } = useModal();

  const handleConfirmDemo = async () => {
    const result = await showConfirm('Bạn có chắc chắn muốn thực hiện thao tác này?', 'Xác nhận Demo');
    alert(`Kết quả: ${result ? 'Đồng ý' : 'Hủy'}`);
  };

  const handleOpenUrlDemo = async () => {
    await showOpenUrl('https://github.com/Moclaw/portfolio', 'Mở GitHub Repository');
  };

  const handleInfoDemo = async () => {
    await showInfo('Đây là một thông báo thông tin hữu ích cho người dùng.', 'Thông tin Demo');
  };

  const handleCustomDemo = async () => {
    const result = await showCustom(
      <div className="p-4">
        <h4 className="text-lg font-semibold text-white mb-4">Custom Modal Content</h4>
        <p className="text-secondary mb-4">
          Đây là nội dung tùy chỉnh của modal. Bạn có thể thêm bất kỳ component nào vào đây.
        </p>
        <div className="bg-tertiary p-3 rounded-lg">
          <p className="text-sm text-gray-300">
            • Input fields<br/>
            • Images<br/>
            • Complex forms<br/>
            • Anything you want!
          </p>
        </div>
      </div>,
      {
        title: 'Custom Modal Demo',
        actions: (
          <div className="flex gap-3">
            <button
              onClick={() => modal.onClose(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => modal.onClose('custom_result')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Custom Action
            </button>
          </div>
        )
      }
    );
    alert(`Custom result: ${result}`);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Modal System Demo</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleConfirmDemo}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
        >
          Confirm Modal
        </button>
        
        <button
          onClick={handleOpenUrlDemo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Open URL Modal
        </button>
        
        <button
          onClick={handleInfoDemo}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Info Modal
        </button>
        
        <button
          onClick={handleCustomDemo}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Custom Modal
        </button>
      </div>
    </div>
  );
};

export default ModalDemo;
