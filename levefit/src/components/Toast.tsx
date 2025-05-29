import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-[80px] right-4 z-50 animate-slideIn">
      <div className="flex items-center p-4 rounded-lg shadow-lg bg-green-600 text-white min-w-[300px]">
        <div className="flex-shrink-0"><FaCheckCircle className="w-5 h-5 text-white" /></div>
        <div className="ml-3 text-sm font-medium">{message}</div>
        <button
          type="button"
          className="ml-4 flex-shrink-0 text-white hover:text-gray-200 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Fechar</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast; 