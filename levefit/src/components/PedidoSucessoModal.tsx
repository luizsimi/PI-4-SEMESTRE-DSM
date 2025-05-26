import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface PedidoSucessoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomePrato?: string;
  statusPedido?: string;
  idPedido?: string | number;
}

const PedidoSucessoModal: React.FC<PedidoSucessoModalProps> = ({
  isOpen,
  onClose,
  nomePrato,
  statusPedido,
  idPedido,
}) => {
  if (!isOpen) return null;

  const modalContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalContainerVariants}
          onClick={onClose} // Fecha ao clicar no overlay
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center"
            variants={modalContentVariants}
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro do modal
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
              <FaCheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Pedido Realizado!
            </h3>
            
            {nomePrato && (
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Seu pedido para <strong>{nomePrato}</strong> foi realizado com sucesso.
              </p>
            )}

            {statusPedido && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: <span className="font-semibold text-green-600 dark:text-green-400">{statusPedido}</span>
              </p>
            )}

            {idPedido && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                ID do Pedido: <span className="font-semibold">{idPedido}</span>
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Ver Meus Pedidos
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PedidoSucessoModal; 