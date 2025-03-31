import React, { useState } from "react";
import { FiCamera } from "react-icons/fi";
import InputMask from "react-input-mask";
import PropTypes from "prop-types";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const EditarPerfil = ({ usuario }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: usuario?.telefone || "",
    cep: usuario?.cep || "",
    rua: usuario?.endereco || "",
    numero: usuario?.numero || "",
    complemento: usuario?.complemento || "",
    cidade: usuario?.cidade || "",
    estado: usuario?.estado || "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleCancelar = () => {
    // Resetar formulário para dados originais
    setFormData({
      nome: usuario?.nome || "",
      email: usuario?.email || "",
      telefone: usuario?.telefone || "",
      cep: usuario?.cep || "",
      rua: usuario?.endereco || "",
      numero: usuario?.numero || "",
      complemento: usuario?.complemento || "",
      cidade: usuario?.cidade || "",
      estado: usuario?.estado || "",
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    });
    setPreviewImagem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      iziToast.success({
        title: "Sucesso!",
        message: "Perfil atualizado com sucesso!",
        position: "bottomRight",
        timeout: 4000,
        backgroundColor: "#10b981",
      });
    } catch (error) {
      iziToast.error({
        title: "Erro",
        message: "Ocorreu um erro ao atualizar o perfil.",
        position: "bottomRight",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meu Perfil</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
        {/* Header com foto e informações básicas */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={previewImagem || usuario.fotoPerfil}
                alt="Foto do Perfil"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                <FiCamera className="text-green-600" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagemChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-bold">{formData.nome}</h3>
              <p className="text-white text-opacity-90 mb-1">
                {formData.email}
              </p>
              <p className="text-sm text-white text-opacity-80">
                Fornecedor desde {usuario.dataCadastro}
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da esquerda */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Informações Pessoais
              </h3>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Telefone
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  maskChar={null}
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                >
                  {(inputProps) => (
                    <input
                      {...inputProps}
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                      required
                    />
                  )}
                </InputMask>
              </div>
            </div>

            {/* Coluna da direita */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-4">
                Endereço
              </h3>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-medium mb-2">
                    CEP
                  </label>
                  <InputMask
                    mask="99999-999"
                    maskChar={null}
                    name="cep"
                    value={formData.cep}
                    onChange={(e) => {
                      handleChange(e);
                      buscarCEP(e.target.value);
                    }}
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                        required
                      />
                    )}
                  </InputMask>
                </div>
                <div className="col-span-3">
                  <label className="block text-gray-700 font-medium mb-2">
                    Rua
                  </label>
                  <input
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de senha */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Alterar Senha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  name="senhaAtual"
                  value={formData.senhaAtual}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Deixe os campos em branco para manter a senha atual.
            </p>
          </div>

          {/* Botões */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditarPerfil.propTypes = {
  usuario: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    endereco: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    cidade: PropTypes.string,
    estado: PropTypes.string,
    cep: PropTypes.string,
    dataCadastro: PropTypes.string,
    fotoPerfil: PropTypes.string,
  }),
};

EditarPerfil.defaultProps = {
  usuario: {
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    cep: "",
    dataCadastro: "",
    fotoPerfil: "https://via.placeholder.com/150",
  },
};

export default EditarPerfil;
