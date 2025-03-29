import React, { useState } from "react";
import { FiSave, FiCamera } from "react-icons/fi";
import InputMask from "react-input-mask";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import PropTypes from "prop-types";

const EditarPerfil = ({ usuario }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImagem, setPreviewImagem] = useState(
    usuario?.fotoPerfil || null
  );
  const [formData, setFormData] = useState({
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: usuario?.telefone || "",
    cep: usuario?.cep || "",
    endereco: usuario?.endereco || "",
    numero: usuario?.numero || "",
    complemento: usuario?.complemento || "",
    cidade: usuario?.cidade || "",
    estado: usuario?.estado || "",
    senha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro quando o campo for modificado
    if (erros[name]) {
      setErros((prev) => {
        const newErros = { ...prev };
        delete newErros[name];
        return newErros;
      });
    }
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
            endereco: data.logradouro,
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

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.trim().length < 3) {
      novosErros.nome = "Nome é obrigatório (mínimo 3 caracteres)";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }

    if (
      !formData.telefone ||
      formData.telefone.replace(/\D/g, "").length < 10
    ) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.cep || formData.cep.replace(/\D/g, "").length !== 8) {
      novosErros.cep = "CEP inválido";
    }

    if (!formData.endereco) {
      novosErros.endereco = "Endereço é obrigatório";
    }

    if (!formData.numero) {
      novosErros.numero = "Número é obrigatório";
    }

    if (!formData.cidade) {
      novosErros.cidade = "Cidade é obrigatória";
    }

    if (!formData.estado) {
      novosErros.estado = "Estado é obrigatório";
    }

    // Validar senha apenas se for informada
    if (formData.senha) {
      if (formData.senha.length < 8) {
        novosErros.senha = "Senha deve ter no mínimo 8 caracteres";
      }

      if (formData.senha !== formData.confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validarFormulario()) {
        setIsLoading(false);
        return;
      }

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      iziToast.success({
        title: "Sucesso!",
        message: "Perfil atualizado com sucesso!",
        position: "bottomRight",
        timeout: 4000,
      });
    } catch (error) {
      iziToast.error({
        title: "Erro",
        message: "Ocorreu um erro ao atualizar o perfil.",
        position: "bottomRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const mostrarErro = (campo) => {
    return erros[campo] ? (
      <span className="text-red-500 text-sm">{erros[campo]}</span>
    ) : null;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meu Perfil</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={previewImagem || "https://via.placeholder.com/150"}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label className="absolute bottom-0 right-0 bg-brightColor text-white p-2 rounded-full cursor-pointer">
              <FiCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Clique no ícone para alterar sua foto
          </p>
        </div>

        {/* Dados pessoais */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Dados Pessoais</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nome do Restaurante/Estabelecimento *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.nome ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("nome")}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("email")}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Telefone *
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
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                      erros.telefone ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                )}
              </InputMask>
              {mostrarErro("telefone")}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Endereço</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                CEP *
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
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                      erros.cep ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                )}
              </InputMask>
              {mostrarErro("cep")}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Endereço *
              </label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.endereco ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("endereco")}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Número *
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.numero ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("numero")}
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Cidade *
              </label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.cidade ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("cidade")}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Estado *
              </label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.estado ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {mostrarErro("estado")}
            </div>
          </div>
        </div>

        {/* Senha */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Alterar Senha</h3>
          <p className="text-sm text-gray-500 mb-4">
            Preencha apenas se desejar alterar sua senha atual
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nova Senha
              </label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.senha ? "border-red-500" : "border-gray-300"
                }`}
              />
              {mostrarErro("senha")}
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
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none ${
                  erros.confirmarSenha ? "border-red-500" : "border-gray-300"
                }`}
              />
              {mostrarErro("confirmarSenha")}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-brightColor text-white py-3 px-8 rounded-lg hover:bg-brightColor/90 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⟳</span> Salvando...
              </>
            ) : (
              <>
                <FiSave /> Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

EditarPerfil.propTypes = {
  usuario: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    cep: PropTypes.string,
    endereco: PropTypes.string,
    numero: PropTypes.string,
    complemento: PropTypes.string,
    cidade: PropTypes.string,
    estado: PropTypes.string,
    fotoPerfil: PropTypes.string,
  }),
};

EditarPerfil.defaultProps = {
  usuario: {
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    fotoPerfil: null,
  },
};

export default EditarPerfil;
