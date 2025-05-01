import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { FaUserCircle, FaWhatsapp, FaStar, FaRegStar } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import PropTypes from "prop-types";
import {
  validarCPF,
  validarEmail,
  validarSenha,
  validarCartaoCredito,
  validarCEP,
} from "../utils/validations";

const LoginModal = ({ isOpen, closeModal, onLogin, openCadastroModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulação de login
      await new Promise((resolve) => setTimeout(resolve, 2000));

      iziToast.success({
        title: "Sucesso!",
        message: "Login realizado com sucesso!",
        position: "bottomRight",
        timeout: 4000,
        transitionIn: "bounceInLeft",
        transitionOut: "bounceOutRight",
        messageColor: "#ffffff",
        titleColor: "#ffffff",
        backgroundColor: "#10b981",
        class: "rounded-lg shadow-lg text-lg",
        icon: "ico-success",
      });

      // Chamar a função de login do componente pai
      onLogin("usuario");
      closeModal();
    } catch (error) {
      console.error("Erro no processamento:", error);
      iziToast.error({
        title: "Erro",
        message: "Erro ao fazer login.",
        position: "topRight",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 scale-100 animate-fadeIn">
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 relative">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-20 p-1.5 rounded-full text-white hover:bg-opacity-40 transition-all z-10"
            >
              <AiOutlineClose size={16} />
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white">
                Bem-vindo(a) de volta
              </h2>
              <p className="text-white text-opacity-80 mt-1">
                Acesse sua conta para continuar
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Sua senha"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Lembrar
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>

              <div className="mt-6 text-center">
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">
                      ou
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <button
                    className="text-green-600 font-medium hover:underline transition-all"
                    onClick={() => {
                      closeModal();
                      openCadastroModal();
                    }}
                  >
                    Cadastre-se
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

LoginModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  openCadastroModal: PropTypes.func.isRequired,
};

const CadastroModal = ({ isOpen, closeModal, onLogin, openLoginModal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("usuario");
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);
  const [cardTokenId, setCardTokenId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    cartao: {
      numero: "",
      validade: "",
      cvv: "",
      titular: "",
    },
  });
  const [erros, setErros] = useState({});

  // Carregar script do Mercado Pago quando o componente montar
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;

    script.onload = () => {
      // Initialize o Mercado Pago quando o script estiver carregado
      if (window.MercadoPago) {
        const mp = new window.MercadoPago(
          "TEST-67a03d48-8b35-4558-ac0a-6b2ec8b0c33c",
          {
            locale: "pt-BR",
          }
        );
        window.mp = mp;
        setMercadoPagoReady(true);
      }
    };

    document.body.appendChild(script);

    return () => {
      // Remover o script quando o componente desmontar
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const validarFormulario = () => {
    const novosErros = {};

    // Validações básicas
    if (!formData.nome || formData.nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    if (!validarEmail(formData.email)) {
      novosErros.email = "Email inválido";
    }

    if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    if (
      !formData.telefone ||
      formData.telefone.replace(/\D/g, "").length < 10
    ) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.dataNascimento) {
      novosErros.dataNascimento = "Data de nascimento obrigatória";
    }

    if (!validarCEP(formData.cep)) {
      novosErros.cep = "CEP inválido";
    }

    if (!formData.rua) {
      novosErros.rua = "Endereço obrigatório";
    }

    if (!formData.numero) {
      novosErros.numero = "Número obrigatório";
    }

    if (!validarSenha(formData.senha)) {
      novosErros.senha =
        "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número";
    }

    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem";
    }

    // Validações adicionais para fornecedor
    if (tipoUsuario === "fornecedor") {
      if (
        !formData.cartao.numero ||
        !validarCartaoCredito(formData.cartao.numero)
      ) {
        novosErros["cartao.numero"] = "Número de cartão inválido";
      }

      if (
        !formData.cartao.titular ||
        formData.cartao.titular.trim().length < 3
      ) {
        novosErros["cartao.titular"] = "Nome do titular obrigatório";
      }

      if (
        !formData.cartao.validade ||
        !/^\d{2}\/\d{2}$/.test(formData.cartao.validade)
      ) {
        novosErros["cartao.validade"] = "Validade inválida";
      }

      if (!formData.cartao.cvv || !/^\d{3}$/.test(formData.cartao.cvv)) {
        novosErros["cartao.cvv"] = "CVV inválido";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const gerarTokenCartao = async () => {
    if (!mercadoPagoReady || !window.mp) {
      setErros({ ...erros, pagamento: "Erro ao carregar Mercado Pago" });
      return false;
    }

    try {
      const [mes, ano] = formData.cartao.validade.split("/");

      const cardToken = await window.mp.createCardToken({
        cardNumber: formData.cartao.numero.replace(/\s/g, ""),
        cardholderName: formData.cartao.titular,
        cardExpirationMonth: mes,
        cardExpirationYear: "20" + ano,
        securityCode: formData.cartao.cvv,
        identificationType: "CPF",
        identificationNumber: formData.cpf.replace(/\D/g, ""),
      });

      if (cardToken.id) {
        setCardTokenId(cardToken.id);
        return true;
      } else {
        setErros({ ...erros, pagamento: "Erro ao validar cartão" });
        return false;
      }
    } catch (error) {
      console.error("Erro ao gerar token do cartão:", error);
      setErros({ ...erros, pagamento: "Erro ao processar cartão de crédito" });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar formulário
      if (!validarFormulario()) {
        setIsSubmitting(false);
        return;
      }

      // Se for fornecedor, validar o cartão com Mercado Pago
      if (tipoUsuario === "fornecedor") {
        const tokenGerado = await gerarTokenCartao();
        if (!tokenGerado) {
          setIsSubmitting(false);
          return;
        }

        // Simulação de processamento de pagamento
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Aqui você enviaria o token para seu backend processar o pagamento
        console.log("Token do cartão gerado:", cardTokenId);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      iziToast.success({
        title: "Sucesso!",
        message: "Cadastro realizado com sucesso!",
        position: "bottomRight",
        timeout: 4000,
        transitionIn: "bounceInLeft",
        transitionOut: "bounceOutRight",
        messageColor: "#ffffff",
        titleColor: "#ffffff",
        backgroundColor: "#10b981",
        class: "rounded-lg shadow-lg text-lg",
        icon: "ico-success",
      });

      // Chamar a função de login do componente pai
      onLogin(tipoUsuario);
      closeModal();
    } catch (error) {
      console.error("Erro no processamento:", error);
      iziToast.error({
        title: "Erro",
        message: "Ocorreu um erro ao cadastrar.",
        position: "topRight",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mostrarErro = (campo) => {
    return erros[campo] ? (
      <span className="text-red-500 text-sm">{erros[campo]}</span>
    ) : null;
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-all duration-300">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[650px] relative overflow-hidden transform transition-all duration-300 scale-100 animate-fadeIn max-h-[90vh] overflow-y-auto">
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 relative">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=60')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white bg-opacity-20 p-1.5 rounded-full text-white hover:bg-opacity-40 transition-all z-10"
            >
              <AiOutlineClose size={16} />
            </button>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white">Crie sua conta</h2>
              <p className="text-white text-opacity-80 mt-1">
                Comece sua jornada com o LeveFit hoje
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Tipo de conta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg text-center transition-all duration-300 ${
                      tipoUsuario === "usuario"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setTipoUsuario("usuario")}
                  >
                    <span className="block font-medium text-sm">Usuário</span>
                    <span className="text-xs opacity-90 block">
                      Para clientes
                    </span>
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg text-center transition-all duration-300 ${
                      tipoUsuario === "fornecedor"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setTipoUsuario("fornecedor")}
                  >
                    <span className="block font-medium text-sm">
                      Fornecedor
                    </span>
                    <span className="text-xs opacity-90 block">
                      Para restaurantes
                    </span>
                  </button>
                </div>
              </div>

              {/* Informações pessoais */}
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2 ml-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.nome
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("nome")}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.email
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("email")}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="CPF"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.cpf
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("cpf")}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="Telefone"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.telefone
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("telefone")}
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2 ml-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Endereço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      placeholder="CEP"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.cep
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("cep")}
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="rua"
                      value={formData.rua}
                      onChange={handleInputChange}
                      placeholder="Rua"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.rua
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("rua")}
                  </div>

                  <div>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      placeholder="Número"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.numero
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("numero")}
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleInputChange}
                      placeholder="Complemento"
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Senhas */}
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-2 ml-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Segurança
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      placeholder="Senha"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.senha
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("senha")}
                    <p className="text-xs text-gray-500 mt-1 ml-1">
                      Min. 8 caracteres com maiúsculas, minúsculas e números
                    </p>
                  </div>

                  <div>
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      placeholder="Confirmar Senha"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.confirmarSenha
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("confirmarSenha")}
                  </div>
                </div>
              </div>

              {/* Pagamento para fornecedores */}
              {tipoUsuario === "fornecedor" && (
                <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 ml-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 002-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Dados de Pagamento
                  </h3>
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-500 p-1 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </span>
                      <div>
                        <span className="font-medium text-green-800 block text-sm">
                          Plano Premium
                        </span>
                        <span className="text-xs text-green-700">
                          R$ 20,00/mês
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      name="cartao.numero"
                      value={formData.cartao.numero}
                      onChange={handleInputChange}
                      placeholder="Número do cartão"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros["cartao.numero"]
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {erros["cartao.numero"] && (
                      <span className="text-red-500 text-xs">
                        {erros["cartao.numero"]}
                      </span>
                    )}

                    <input
                      type="text"
                      name="cartao.titular"
                      value={formData.cartao.titular}
                      onChange={handleInputChange}
                      placeholder="Nome do titular"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros["cartao.titular"]
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {erros["cartao.titular"] && (
                      <span className="text-red-500 text-xs">
                        {erros["cartao.titular"]}
                      </span>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="cartao.validade"
                          value={formData.cartao.validade}
                          onChange={handleInputChange}
                          placeholder="Validade (MM/AA)"
                          className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                            erros["cartao.validade"]
                              ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                          }`}
                        />
                        {erros["cartao.validade"] && (
                          <span className="text-red-500 text-xs">
                            {erros["cartao.validade"]}
                          </span>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cartao.cvv"
                          value={formData.cartao.cvv}
                          onChange={handleInputChange}
                          placeholder="CVV"
                          className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                            erros["cartao.cvv"]
                              ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                          }`}
                        />
                        {erros["cartao.cvv"] && (
                          <span className="text-red-500 text-xs">
                            {erros["cartao.cvv"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Cadastrando...
                    </span>
                  ) : (
                    "Cadastrar"
                  )}
                </button>

                <div className="mt-4 text-center">
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs text-gray-500">
                        ou
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Já tem uma conta?{" "}
                    <button
                      className="text-green-600 font-medium hover:underline transition-all"
                      onClick={() => {
                        closeModal();
                        openLoginModal();
                      }}
                    >
                      Faça login
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

CadastroModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  openLoginModal: PropTypes.func.isRequired,
};

// Modal para exibir os pedidos via WhatsApp
const PedidosWhatsappModal = ({ isOpen, closeModal }) => {
  // Estado para controlar qual pedido está sendo avaliado e com quantas estrelas
  const [avaliacaoAberta, setAvaliacaoAberta] = useState(null);
  const [estrelas, setEstrelas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [pedidosAvaliados, setPedidosAvaliados] = useState([]);

  // Dados mockados de pedidos para demonstração
  const pedidos = [
    {
      id: 1,
      data: "05/04/2025",
      restaurante: "Fit & Fresh",
      prato: "Salada Caesar com Frango Grelhado",
      status: "Entregue",
      valor: "R$ 35,90",
      telefone: "11987654321",
    },
    {
      id: 2,
      data: "03/04/2025",
      restaurante: "Nutri Mix",
      prato: "Bowl de Açaí com Granola",
      status: "Em preparo",
      valor: "R$ 29,90",
      telefone: "11912345678",
    },
    {
      id: 3,
      data: "01/04/2025",
      restaurante: "Veggie Land",
      prato: "Hambúrguer Vegetariano com Batata Doce",
      status: "Confirmado",
      valor: "R$ 42,50",
      telefone: "11955554444",
    },
  ];

  const abrirWhatsapp = (telefone, prato) => {
    const mensagem = encodeURIComponent(
      `Olá! Gostaria de saber informações sobre meu pedido: ${prato}`
    );
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, "_blank");
  };

  const iniciarAvaliacao = (pedidoId) => {
    setAvaliacaoAberta(pedidoId);
    setEstrelas(0);
    setComentario("");
  };

  const finalizarAvaliacao = () => {
    if (estrelas > 0) {
      // Em um ambiente real, enviaríamos essa avaliação para o servidor
      setPedidosAvaliados([...pedidosAvaliados, avaliacaoAberta]);

      iziToast.success({
        title: "Avaliação enviada!",
        message: "Obrigado por avaliar seu pedido",
        position: "bottomRight",
        timeout: 3000,
      });
    } else {
      iziToast.error({
        title: "Erro",
        message: "Por favor, selecione pelo menos uma estrela",
        position: "bottomRight",
        timeout: 3000,
      });
      return;
    }

    setAvaliacaoAberta(null);
    setEstrelas(0);
    setComentario("");
  };

  const renderEstrelas = (quantidade, total = 5) => {
    return Array.from({ length: total }, (_, i) => (
      <span
        key={i}
        className="cursor-pointer"
        onClick={() => (avaliacaoAberta ? setEstrelas(i + 1) : null)}
      >
        {i < quantidade ? (
          <FaStar className="text-yellow-400 text-xl" />
        ) : (
          <FaRegStar className="text-yellow-400 text-xl" />
        )}
      </span>
    ));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-[2px]">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] relative overflow-hidden">
          {/* Header estilizado */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Meus Pedidos</h2>
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-white hover:text-gray-200 transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Lista de pedidos */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            {pedidos.length > 0 ? (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{pedido.prato}</h3>
                        <p className="text-gray-600 text-sm">
                          {pedido.restaurante}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                          ${
                            pedido.status === "Entregue"
                              ? "bg-green-100 text-green-800"
                              : pedido.status === "Em preparo"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {pedido.status}
                        </span>
                      </div>
                    </div>

                    {/* Área de avaliação expandida */}
                    {avaliacaoAberta === pedido.id && (
                      <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Avalie seu pedido
                        </h4>
                        <div className="flex mb-3">
                          {renderEstrelas(estrelas)}
                        </div>
                        <textarea
                          placeholder="Conte-nos sua experiência com este pedido (opcional)"
                          className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none"
                          rows="3"
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setAvaliacaoAberta(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={finalizarAvaliacao}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Enviar avaliação
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          {pedido.data}
                        </span>
                        <span className="font-bold">{pedido.valor}</span>
                      </div>

                      <div className="flex gap-2">
                        {pedido.status === "Entregue" &&
                          !pedidosAvaliados.includes(pedido.id) && (
                            <button
                              onClick={() => iniciarAvaliacao(pedido.id)}
                              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <FaStar size={16} />
                              <span>Avaliar</span>
                            </button>
                          )}

                        {pedidosAvaliados.includes(pedido.id) && (
                          <div className="flex items-center gap-1 text-gray-600 px-4 py-2">
                            <FaStar className="text-yellow-400" />
                            <span>Avaliado</span>
                          </div>
                        )}

                        <button
                          onClick={() =>
                            abrirWhatsapp(pedido.telefone, pedido.prato)
                          }
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <FaWhatsapp size={18} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  Você ainda não possui pedidos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

PedidosWhatsappModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

// Modal para editar perfil do usuário
const EditarPerfilModal = ({ isOpen, closeModal, usuarioLogado }) => {
  const [formData, setFormData] = useState({
    nome: usuarioLogado?.nome || "",
    email: usuarioLogado?.email || "",
    telefone: usuarioLogado?.telefone || "",
    cpf: usuarioLogado?.cpf || "",
    endereco: {
      cep: usuarioLogado?.endereco?.cep || "",
      rua: usuarioLogado?.endereco?.rua || "",
      numero: usuarioLogado?.endereco?.numero || "",
      complemento: usuarioLogado?.endereco?.complemento || "",
      bairro: usuarioLogado?.endereco?.bairro || "",
      cidade: usuarioLogado?.endereco?.cidade || "",
      estado: usuarioLogado?.endereco?.estado || "",
    },
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("informacoes");

  useEffect(() => {
    // Atualiza os dados do formulário quando o usuário logado muda
    if (usuarioLogado) {
      setFormData({
        nome: usuarioLogado.nome || "",
        email: usuarioLogado.email || "",
        telefone: usuarioLogado.telefone || "",
        cpf: usuarioLogado.cpf || "",
        endereco: {
          cep: usuarioLogado.endereco?.cep || "",
          rua: usuarioLogado.endereco?.rua || "",
          numero: usuarioLogado.endereco?.numero || "",
          complemento: usuarioLogado.endereco?.complemento || "",
          bairro: usuarioLogado.endereco?.bairro || "",
          cidade: usuarioLogado.endereco?.cidade || "",
          estado: usuarioLogado.endereco?.estado || "",
        },
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      });
    }
  }, [usuarioLogado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const buscarCEP = async () => {
    const cep = formData.endereco.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              rua: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf,
            },
          }));

          // Limpar possíveis erros do endereço
          setErros((prev) => {
            const newErros = { ...prev };
            delete newErros["endereco.rua"];
            delete newErros["endereco.bairro"];
            delete newErros["endereco.cidade"];
            delete newErros["endereco.estado"];
            return newErros;
          });
        } else {
          setErros((prev) => ({
            ...prev,
            "endereco.cep": "CEP não encontrado",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setErros((prev) => ({
          ...prev,
          "endereco.cep": "Erro ao buscar CEP",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateForm = () => {
    const novosErros = {};

    // Validações básicas
    if (!formData.nome || formData.nome.trim().length < 3) {
      novosErros.nome = "Nome deve ter no mínimo 3 caracteres";
    }

    if (!validarEmail(formData.email)) {
      novosErros.email = "Email inválido";
    }

    // Validação do telefone (se estiver preenchido)
    if (formData.telefone && formData.telefone.replace(/\D/g, "").length < 10) {
      novosErros.telefone = "Telefone inválido";
    }

    // Validação do CPF (se estiver preenchido)
    if (formData.cpf && !validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido";
    }

    // Validação do CEP (se estiver preenchido)
    if (formData.endereco.cep && !validarCEP(formData.endereco.cep)) {
      novosErros["endereco.cep"] = "CEP inválido";
    }

    // Se a senha atual estiver preenchida, valida a nova senha
    if (formData.senhaAtual) {
      if (!formData.novaSenha) {
        novosErros.novaSenha = "Nova senha é obrigatória";
      } else if (!validarSenha(formData.novaSenha)) {
        novosErros.novaSenha =
          "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número";
      }

      if (formData.novaSenha !== formData.confirmarSenha) {
        novosErros.confirmarSenha = "As senhas não coincidem";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulação de envio para o servidor
      await new Promise((resolve) => setTimeout(resolve, 1500));

      iziToast.success({
        title: "Sucesso!",
        message: "Perfil atualizado com sucesso!",
        position: "topRight",
        timeout: 3000,
      });

      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      iziToast.error({
        title: "Erro",
        message: "Ocorreu um erro ao atualizar seu perfil.",
        position: "topRight",
        timeout: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mostrarErro = (campo) => {
    return erros[campo] ? (
      <span className="text-red-500 text-xs">{erros[campo]}</span>
    ) : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[700px] relative overflow-hidden transform transition-all duration-300 scale-100 animate-fadeIn">
        {/* Cabeçalho com gradiente */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 relative">
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=60')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-white bg-opacity-20 p-1.5 rounded-full text-white hover:bg-opacity-40 transition-all z-10"
          >
            <AiOutlineClose size={16} />
          </button>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
            <p className="text-white text-opacity-80 mt-1">
              Atualize suas informações pessoais
            </p>
          </div>
        </div>

        <div className="p-5">
          {/* Tabs de navegação */}
          <div className="border-b border-gray-200 mb-5">
            <div className="flex -mb-px">
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "informacoes"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("informacoes")}
              >
                Informações Pessoais
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "endereco"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("endereco")}
              >
                Endereço
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "seguranca"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("seguranca")}
              >
                Segurança
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tab de Informações Pessoais */}
            {activeTab === "informacoes" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                      erros.nome
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    }`}
                  />
                  {mostrarErro("nome")}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                      erros.email
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    }`}
                  />
                  {mostrarErro("email")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Telefone
                    </label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.telefone
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("telefone")}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="XXX.XXX.XXX-XX"
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.cpf
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("cpf")}
                  </div>
                </div>
              </div>
            )}

            {/* Tab de Endereço */}
            {activeTab === "endereco" && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      CEP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="endereco.cep"
                        value={formData.endereco.cep}
                        onChange={handleInputChange}
                        onBlur={buscarCEP}
                        placeholder="00000-000"
                        className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                          erros["endereco.cep"]
                            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                        }`}
                      />
                      {mostrarErro("endereco.cep")}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Estado
                    </label>
                    <input
                      type="text"
                      name="endereco.estado"
                      value={formData.endereco.estado}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="endereco.cidade"
                    value={formData.endereco.cidade}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Bairro
                  </label>
                  <input
                    type="text"
                    name="endereco.bairro"
                    value={formData.endereco.bairro}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Rua
                  </label>
                  <input
                    type="text"
                    name="endereco.rua"
                    value={formData.endereco.rua}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Número
                    </label>
                    <input
                      type="text"
                      name="endereco.numero"
                      value={formData.endereco.numero}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="endereco.complemento"
                      value={formData.endereco.complemento}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab de Segurança */}
            {activeTab === "seguranca" && (
              <div className="space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4">
                  <p className="text-sm text-yellow-800">
                    Para alterar sua senha, preencha sua senha atual e depois a
                    nova senha.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="senhaAtual"
                      value={formData.senhaAtual}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="novaSenha"
                      value={formData.novaSenha}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.novaSenha
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("novaSenha")}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A senha deve ter no mínimo 8 caracteres, incluir letra
                    maiúscula, minúscula e número.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmarSenha"
                      value={formData.confirmarSenha}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg outline-none transition-all duration-200 ${
                        erros.confirmarSenha
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                      }`}
                    />
                    {mostrarErro("confirmarSenha")}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          </form>
        </div>
      </div>
    </div>
  );
};

EditarPerfilModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  usuarioLogado: PropTypes.shape({
    nome: PropTypes.string,
    email: PropTypes.string,
    telefone: PropTypes.string,
    cpf: PropTypes.string,
    endereco: PropTypes.shape({
      cep: PropTypes.string,
      rua: PropTypes.string,
      numero: PropTypes.string,
      complemento: PropTypes.string,
      bairro: PropTypes.string,
      cidade: PropTypes.string,
      estado: PropTypes.string,
    }),
  }),
};

const Navbar = ({ onLogin, usuarioLogado, onLogout, onNavigate }) => {
  const [menu, setMenu] = useState(false);
  const handleChange = () => setMenu(!menu);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false);
  const [isPedidosModalOpen, setIsPedidosModalOpen] = useState(false);
  const [isEditarPerfilModalOpen, setIsEditarPerfilModalOpen] = useState(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openCadastroModal = () => setIsCadastroModalOpen(true);
  const closeCadastroModal = () => setIsCadastroModalOpen(false);
  const openPedidosModal = () => setIsPedidosModalOpen(true);
  const closePedidosModal = () => setIsPedidosModalOpen(false);
  const openEditarPerfilModal = () => setIsEditarPerfilModalOpen(true);
  const closeEditarPerfilModal = () => setIsEditarPerfilModalOpen(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Fechar o menu do usuário ao clicar fora dele
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const irParaDashboard = () => {
    if (usuarioLogado?.tipo === "fornecedor") {
      onNavigate("dashboard");
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleEditarPerfil = () => {
    // Abrir o modal de edição de perfil
    openEditarPerfilModal();

    // Feedback visual para o usuário
    iziToast.info({
      title: "Perfil",
      message: "Abrindo editor de perfil",
      position: "topRight",
      timeout: 2000,
    });
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setUserMenuOpen(false);
    iziToast.success({
      title: "Logout",
      message: "Você saiu da sua conta com sucesso",
      position: "topRight",
      timeout: 3000,
    });
  };

  const UserMenu = () => (
    <div
      ref={userMenuRef}
      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">
          {usuarioLogado.nome}
        </p>
        <p className="text-xs text-gray-500 truncate">{usuarioLogado.email}</p>
      </div>

      {usuarioLogado.tipo === "fornecedor" && (
        <button
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
          onClick={() => {
            setUserMenuOpen(false);
            irParaDashboard();
          }}
        >
          Dashboard
        </button>
      )}

      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
        onClick={() => {
          setUserMenuOpen(false);
          openPedidosModal();
        }}
      >
        Meus Pedidos
      </button>

      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
        onClick={() => {
          setUserMenuOpen(false);
          handleEditarPerfil();
        }}
      >
        Editar Perfil
      </button>

      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
        onClick={() => {
          setUserMenuOpen(false);
          handleLogout();
        }}
      >
        Sair
      </button>
    </div>
  );

  return (
    <div
      className={`fixed w-full z-50 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className="container mx-auto flex flex-row justify-between items-center p-4">
        <div className="flex items-center">
          <Link to="home" spy smooth duration={500}>
            <h1 className="text-2xl font-semibold text-green-600 cursor-pointer">
              LeveFit
            </h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="home"
            spy
            smooth
            duration={500}
            className="text-gray-700 hover:text-green-600 transition-all cursor-pointer"
          >
            Home
          </Link>
          <div className="relative group">
            <div className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-all cursor-pointer">
              <span>Pratos</span>
              <BiChevronDown />
            </div>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <ul className="py-2">
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-700 hover:text-green-600 transition-all cursor-pointer block py-1 px-4"
                  >
                    Todos os Pratos
                  </Link>
                </li>
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-700 hover:text-green-600 transition-all cursor-pointer block py-1 px-4"
                  >
                    Mais vendidos
                  </Link>
                </li>
                <li>
                  <Link
                    to="dishes"
                    spy
                    smooth
                    duration={500}
                    className="text-gray-700 hover:text-green-600 transition-all cursor-pointer block py-1 px-4"
                  >
                    Avaliados
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link
            to="menu"
            spy
            smooth
            duration={500}
            className="text-gray-700 hover:text-green-600 transition-all cursor-pointer"
          >
            Destaques
          </Link>
          <Link
            to="review"
            spy
            smooth
            duration={500}
            className="text-gray-700 hover:text-green-600 transition-all cursor-pointer"
          >
            Avaliações
          </Link>

          {!usuarioLogado?.logado ? (
            <div className="flex items-center gap-3">
              <button
                onClick={openCadastroModal}
                className="px-6 py-2.5 bg-white text-green-600 hover:text-green-700 font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center gap-1 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-600 after:transition-all after:duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                Cadastro
              </button>
              <button
                onClick={openLoginModal}
                className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 000 4zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* User profile icon with dropdown menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-all"
                >
                  <FaUserCircle className="text-2xl text-green-600" />
                  <span className="font-medium">
                    {usuarioLogado.nome || "Usuário"}
                  </span>
                  <BiChevronDown
                    className={`transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && <UserMenu />}
              </div>
            </div>
          )}
        </nav>

        {/* Resto do código do menu mobile */}
        <div className="md:hidden flex items-center">
          {menu ? (
            <AiOutlineClose
              size={25}
              className="text-gray-700"
              onClick={handleChange}
            />
          ) : (
            <AiOutlineMenuUnfold
              size={25}
              className="text-gray-700"
              onClick={handleChange}
            />
          )}
        </div>
      </div>

      {/* Menu Mobile - precisamos atualizar para incluir o ícone de usuário */}
      {menu && (
        <div className="md:hidden bg-white shadow-lg absolute w-full transition-all">
          <div className="flex flex-col p-5">
            <Link
              to="home"
              spy
              smooth
              duration={500}
              className="text-gray-700 hover:text-green-600 transition-all cursor-pointer py-3 border-b border-gray-100"
              onClick={handleChange}
            >
              Home
            </Link>
            <Link
              to="dishes"
              spy
              smooth
              duration={500}
              className="text-gray-700 hover:text-green-600 transition-all cursor-pointer py-3 border-b border-gray-100"
              onClick={handleChange}
            >
              Pratos
            </Link>
            <Link
              to="menu"
              spy
              smooth
              duration={500}
              className="text-gray-700 hover:text-green-600 transition-all cursor-pointer py-3 border-b border-gray-100"
              onClick={handleChange}
            >
              Destaques
            </Link>
            <Link
              to="review"
              spy
              smooth
              duration={500}
              className="text-gray-700 hover:text-green-600 transition-all cursor-pointer py-3 border-b border-gray-100"
              onClick={handleChange}
            >
              Avaliações
            </Link>

            {!usuarioLogado?.logado ? (
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    openCadastroModal();
                    handleChange();
                  }}
                  className="w-full py-2.5 bg-white text-green-600 hover:text-green-700 font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Cadastro
                </button>
                <button
                  onClick={() => {
                    openLoginModal();
                    handleChange();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 000 4zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Login
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {/* Mostrar informações do usuário no mobile */}
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <FaUserCircle className="text-2xl text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">
                      {usuarioLogado.nome || "Usuário"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {usuarioLogado.tipo === "fornecedor"
                        ? "Fornecedor"
                        : "Cliente"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    openPedidosModal();
                    handleChange();
                  }}
                  className="w-full py-2 bg-green-100 text-green-700 hover:bg-green-200 transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} />
                  Meus Pedidos
                </button>

                <button
                  onClick={() => {
                    handleEditarPerfil();
                    handleChange();
                  }}
                  className="w-full py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-lg"
                >
                  Editar Perfil
                </button>

                {usuarioLogado.tipo === "fornecedor" && (
                  <button
                    onClick={() => {
                      irParaDashboard();
                      handleChange();
                    }}
                    className="w-full py-2 bg-green-600 text-white hover:bg-green-700 transition-all rounded-lg"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    handleChange();
                  }}
                  className="w-full py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        closeModal={closeLoginModal}
        onLogin={onLogin}
        openCadastroModal={openCadastroModal}
      />
      <CadastroModal
        isOpen={isCadastroModalOpen}
        closeModal={closeCadastroModal}
        onLogin={onLogin}
        openLoginModal={openLoginModal}
      />
      <PedidosWhatsappModal
        isOpen={isPedidosModalOpen}
        closeModal={closePedidosModal}
      />
      <EditarPerfilModal
        isOpen={isEditarPerfilModalOpen}
        closeModal={closeEditarPerfilModal}
        usuarioLogado={usuarioLogado}
      />
    </div>
  );
};

Navbar.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  usuarioLogado: PropTypes.shape({
    logado: PropTypes.bool,
    tipo: PropTypes.string,
    nome: PropTypes.string,
    email: PropTypes.string,
  }),
  onEditarPerfil: PropTypes.func,
};

Navbar.defaultProps = {
  usuarioLogado: {
    logado: false,
    tipo: "",
    nome: "",
    email: "",
  },
};

export default Navbar;
