import React from 'react';
import { FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmacaoLimparCarrinhoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fornecedorAtual: string;
  novoFornecedor: string;
}

const ConfirmacaoLimparCarrinhoModal: React.FC<ConfirmacaoLimparCarrinhoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fornecedorAtual,
  novoFornecedor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay/Background escuro */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-gray-900 text-center shadow-xl transition-all sm:w-full sm:max-w-md">
          <div className="px-4 pb-6 pt-5 sm:p-6">
            {/* Ícone de Alerta */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-600/20">
              <FaExclamationTriangle className="h-8 w-8 text-yellow-500" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-white">
              Atenção!
            </h3>
            <p className="mb-2 text-gray-400">
              Você já tem itens de <span className="text-yellow-500">{fornecedorAtual}</span> no carrinho.
            </p>
            <p className="mb-6 text-gray-400">
              Deseja limpar o carrinho e adicionar este item de <span className="text-yellow-500">{novoFornecedor}</span>?
            </p>

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
                onClick={onConfirm}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500 focus:outline-none"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoLimparCarrinhoModal; 