import React, { useState } from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';

interface ConfirmacaoPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmacaoPedidoModal: React.FC<ConfirmacaoPedidoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsAnimating(true);
    
    // Simula o tempo de processamento com animação
    setTimeout(() => {
      setShowSuccess(true);
      setIsAnimating(false);
      
      // Fecha o modal após mostrar mensagem de sucesso
      setTimeout(() => {
        onConfirm();
        setShowSuccess(false);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay/Background escuro */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={!isAnimating ? onClose : undefined} />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-gray-900 text-center shadow-xl transition-all sm:w-full sm:max-w-md">
          <div className="px-4 pb-6 pt-5 sm:p-6">
            {!showSuccess ? (
              <>
                {/* Ícone do Carrinho */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
                  <FaShoppingCart className="h-8 w-8 text-green-500" />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-white">
                  Deseja finalizar seu pedido?
                </h3>
                <p className="mb-6 text-gray-400">
                  Ao confirmar, seu pedido será enviado para o fornecedor.
                </p>

                {isAnimating ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <MdDeliveryDining className="text-green-500 text-4xl animate-bounce" />
                      <div className="absolute bottom-0 left-1/2 h-1 w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-20 blur-sm"></div>
                    </div>
                    <p className="text-green-500">Processando seu pedido...</p>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 focus:outline-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 focus:outline-none"
                    >
                      Confirmar Pedido
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Ícone de Sucesso */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
                  <FaCheck className="h-8 w-8 text-green-500" />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-white">
                  Pedido enviado com sucesso!
                </h3>
                <p className="text-gray-400">
                  Seu pedido foi enviado para o fornecedor. Logo ele entrará em contato. Muito obrigado!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoPedidoModal; 