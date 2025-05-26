import React from 'react';
import { FaMotorcycle, FaShoppingBag, FaTimes } from 'react-icons/fa';

interface TipoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTipo: (tipo: 'ENTREGA' | 'RETIRADA') => void;
  nomePrato: string;
}

const TipoPedidoModal: React.FC<TipoPedidoModalProps> = ({ isOpen, onClose, onSelectTipo, nomePrato }) => {
  if (!isOpen) return null;

  const handleSelect = (tipo: 'ENTREGA' | 'RETIRADA') => {
    onSelectTipo(tipo);
    // onClose(); // Decidiremos se fechamos aqui ou após a ação principal
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Como você quer seu pedido?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Opções */}
        <div className="p-6 space-y-5">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-1">Você está pedindo: <span className="font-semibold text-green-600 dark:text-green-400">{nomePrato}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opção Entrega */}
                <button 
                    onClick={() => handleSelect('ENTREGA')}
                    className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-700/30 hover:bg-green-100 dark:hover:bg-green-700/50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-500 dark:hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                >
                    <FaMotorcycle className="text-4xl text-green-600 dark:text-green-400 mb-3" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">Entrega</span>
                    <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-1">Receba seu pedido no conforto da sua casa.</p>
                </button>

                {/* Opção Retirada */}
                <button 
                    onClick={() => handleSelect('RETIRADA')}
                    className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-700/30 hover:bg-blue-100 dark:hover:bg-blue-700/50 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                    <FaShoppingBag className="text-4xl text-blue-600 dark:text-blue-400 mb-3" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">Retirada</span>
                    <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-1">Retire seu pedido diretamente no local.</p>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TipoPedidoModal; 