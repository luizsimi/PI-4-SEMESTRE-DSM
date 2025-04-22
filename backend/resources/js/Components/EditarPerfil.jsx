import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { validarEmail, validarSenha, validarCEP } from "../utils/validations";

const EditarPerfil = ({ usuario, onSave }) => {
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    alterarSenha: false,
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const [erros, setErros] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (usuario) {
      // Extrair informações do endereço
      const enderecoInfo = extrairInformacoesEndereco(usuario.endereco);

      setDadosUsuario({
        nome: usuario.nome || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        endereco: {
          cep: enderecoInfo.cep || "",
          rua: enderecoInfo.rua || "",
          numero: enderecoInfo.numero || "",
          complemento: enderecoInfo.complemento || "",
          bairro: enderecoInfo.bairro || "",
          cidade: enderecoInfo.cidade || "",
          estado: enderecoInfo.estado || "",
        },
        alterarSenha: false,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
    }
  }, [usuario]);

  // Função para extrair informações do endereço de uma string
  const extrairInformacoesEndereco = (enderecoString) => {
    if (!enderecoString) return {};

    const enderecoParts = enderecoString.split(", ");
    const ruaNumero = enderecoParts[0] || "";
    const [rua, numero] = ruaNumero.split(", ");

    return {
      rua: rua || "",
      numero: numero || "",
      complemento: "",
      bairro: "",
      cidade: enderecoParts[1]?.split(", ")[0] || "",
      estado: "",
    };
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setDadosUsuario((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setDadosUsuario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpar erro quando o campo for modificado
    if (erros[name]) {
      setErros((prev) => {
        const newErros = { ...prev };
        delete newErros[name];
        return newErros;
      });
    }
  };

  // Handler para o checkbox de alterar senha
  const handleChangePasswordToggle = (e) => {
    const { checked } = e.target;
    setDadosUsuario((prev) => ({
      ...prev,
      alterarSenha: checked,
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    }));
  };

  // Buscar dados do CEP
  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setDadosUsuario((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              rua: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              estado: data.uf || "",
            },
          }));

          // Feedback positivo
          iziToast.success({
            title: "CEP encontrado",
            message: "Endereço preenchido automaticamente",
            position: "topRight",
            timeout: 3000,
          });
        } else {
          iziToast.error({
            title: "CEP não encontrado",
            message: "Verifique o CEP informado",
            position: "topRight",
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        iziToast.error({
          title: "Erro",
          message: "Não foi possível buscar o CEP",
          position: "topRight",
          timeout: 3000,
        });
      }
    }
  };

  // Validar formulário antes de enviar
  const validarFormulario = () => {
    const novosErros = {};

    // Validações básicas
    if (!dadosUsuario.nome || dadosUsuario.nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    if (!validarEmail(dadosUsuario.email)) {
      novosErros.email = "Email inválido";
    }

    if (
      !dadosUsuario.telefone ||
      dadosUsuario.telefone.replace(/\D/g, "").length < 10
    ) {
      novosErros.telefone = "Telefone inválido";
    }

    // Validar endereço se tiver CEP preenchido
    if (dadosUsuario.endereco.cep && !validarCEP(dadosUsuario.endereco.cep)) {
      novosErros["endereco.cep"] = "CEP inválido";
    }

    // Validações de senha
    if (dadosUsuario.alterarSenha) {
      if (!dadosUsuario.senhaAtual) {
        novosErros.senhaAtual = "Senha atual é obrigatória";
      }

      if (!validarSenha(dadosUsuario.novaSenha)) {
        novosErros.novaSenha =
          "Senha deve ter no mínimo 8 caracteres, incluir letras maiúsculas, minúsculas e números";
      }

      if (dadosUsuario.novaSenha !== dadosUsuario.confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Handler para submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsSaving(true);

    try {
      // Simular chamada de API para atualizar os dados
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Formatar endereço completo para salvar
      const enderecoCompleto = `${dadosUsuario.endereco.rua}, ${
        dadosUsuario.endereco.numero
      }${
        dadosUsuario.endereco.complemento
          ? `, ${dadosUsuario.endereco.complemento}`
          : ""
      }, ${dadosUsuario.endereco.cidade}${
        dadosUsuario.endereco.estado ? ` - ${dadosUsuario.endereco.estado}` : ""
      }`;

      // Formatar dados para salvar
      const dadosAtualizados = {
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        telefone: dadosUsuario.telefone,
        endereco: enderecoCompleto,
      };

      // Chamar função de callback para salvar
      onSave(dadosAtualizados);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      iziToast.error({
        title: "Erro",
        message: "Não foi possível salvar as alterações",
        position: "topRight",
        timeout: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Função para exibir mensagens de erro
  const mostrarErro = (campo) => {
    return erros[campo] ? (
      <span className="text-red-500 text-sm mt-1">{erros[campo]}</span>
    ) : null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-6">
        <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
        <p className="text-green-100 mt-1">
          Atualize suas informações pessoais
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Informações pessoais */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Informações Pessoais
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nome"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={dadosUsuario.nome}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                    erros.nome ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {mostrarErro("nome")}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={dadosUsuario.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                    erros.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {mostrarErro("email")}
              </div>

              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Telefone
                </label>
                <InputMask
                  mask="(99) 99999-9999"
                  maskChar={null}
                  id="telefone"
                  name="telefone"
                  value={dadosUsuario.telefone}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                    erros.telefone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {mostrarErro("telefone")}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label
                    htmlFor="cep"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CEP
                  </label>
                  <InputMask
                    mask="99999-999"
                    maskChar={null}
                    id="cep"
                    name="endereco.cep"
                    value={dadosUsuario.endereco.cep}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value.replace(/\D/g, "").length === 8) {
                        buscarCEP(e.target.value);
                      }
                    }}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                      erros["endereco.cep"]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {erros["endereco.cep"] && (
                    <span className="text-red-500 text-sm mt-1">
                      {erros["endereco.cep"]}
                    </span>
                  )}
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="rua"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rua
                  </label>
                  <input
                    type="text"
                    id="rua"
                    name="endereco.rua"
                    value={dadosUsuario.endereco.rua}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="numero"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="endereco.numero"
                    value={dadosUsuario.endereco.numero}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="complemento"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="endereco.complemento"
                    value={dadosUsuario.endereco.complemento}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bairro"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="endereco.bairro"
                    value={dadosUsuario.endereco.bairro}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cidade"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="endereco.cidade"
                    value={dadosUsuario.endereco.cidade}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <input
                  type="text"
                  id="estado"
                  name="endereco.estado"
                  value={dadosUsuario.endereco.estado}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Alterar senha */}
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="alterarSenha"
                checked={dadosUsuario.alterarSenha}
                onChange={handleChangePasswordToggle}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="alterarSenha"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Alterar senha
              </label>
            </div>

            {dadosUsuario.alterarSenha && (
              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div>
                  <label
                    htmlFor="senhaAtual"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Senha atual
                  </label>
                  <input
                    type="password"
                    id="senhaAtual"
                    name="senhaAtual"
                    value={dadosUsuario.senhaAtual}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                      erros.senhaAtual ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {mostrarErro("senhaAtual")}
                </div>

                <div>
                  <label
                    htmlFor="novaSenha"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="novaSenha"
                    name="novaSenha"
                    value={dadosUsuario.novaSenha}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                      erros.novaSenha ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {mostrarErro("novaSenha")}
                  <p className="mt-1 text-sm text-gray-500">
                    A senha deve ter no mínimo 8 caracteres, incluir letras
                    maiúsculas, minúsculas e números.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmarSenha"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={dadosUsuario.confirmarSenha}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${
                      erros.confirmarSenha
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {mostrarErro("confirmarSenha")}
                </div>
              </div>
            )}
          </div>

          <div className="pt-5">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </div>
          </div>
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
    endereco: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditarPerfil;
