import React from "react";

const Modal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null; // Se não estiver aberto, não renderiza nada.

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Cadastro Completo</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-lg">Nome</label>
            <input
              type="text"
              className="w-full border px-3 py-2 mt-1"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-lg">E-mail</label>
            <input
              type="email"
              className="w-full border px-3 py-2 mt-1"
              placeholder="Seu e-mail"
            />
          </div>
          <div>
            <label className="block text-lg">Senha</label>
            <input
              type="password"
              className="w-full border px-3 py-2 mt-1"
              placeholder="Sua senha"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={closeModal}
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
