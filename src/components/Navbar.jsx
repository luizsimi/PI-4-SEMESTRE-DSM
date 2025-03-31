import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import InputMask from "react-input-mask";
import PropTypes from "prop-types";
import {
  validarCPF,
  validarEmail,
  validarSenha,
  validarCartaoCredito,
  validarCEP,
} from "../utils/validations";

const Modal = ({ isOpen, closeModal, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
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
      if (!isLogin && !validarFormulario()) {
        setIsSubmitting(false);
        return;
      }

      // Se for fornecedor, validar o cartão com Mercado Pago
      if (!isLogin && tipoUsuario === "fornecedor") {
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
        message: isLogin
          ? "Login realizado com sucesso!"
          : "Cadastro realizado com sucesso!",
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
        message: isLogin
          ? "Erro ao fazer login."
          : "Ocorreu um erro ao cadastrar.",
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
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-[2px]">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] relative overflow-hidden">
          {/* Header estilizado */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">
              {isLogin ? "Acesse sua conta" : "Crie sua conta"}
            </h2>
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-white hover:text-gray-200 transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Botões de alternar entre login e cadastro */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-5 font-medium text-base transition-colors duration-200 ${
                isLogin
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 px-5 font-medium text-base transition-colors duration-200 ${
                !isLogin
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Cadastro
            </button>
          </div>

          {/* Corpo do formulário com scrolling interno */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="flex flex-col">
              {isLogin ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Seu email"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50"
                        required
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Sua senha"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-gray-50"
                        required
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Lembrar
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-green-600 hover:text-green-500"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 mt-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 text-lg"
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
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Tipo de usuário */}
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Tipo de conta
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`p-3 rounded-lg text-center transition-all ${
                          tipoUsuario === "usuario"
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setTipoUsuario("usuario")}
                      >
                        <span className="block font-medium">Usuário</span>
                        <span className="text-xs opacity-80 mt-1 block">
                          Para clientes
                        </span>
                      </button>
                      <button
                        type="button"
                        className={`p-3 rounded-lg text-center transition-all ${
                          tipoUsuario === "fornecedor"
                            ? "bg-green-600 text-white shadow-sm"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setTipoUsuario("fornecedor")}
                      >
                        <span className="block font-medium">Fornecedor</span>
                        <span className="text-xs opacity-80 mt-1 block">
                          Para restaurantes
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Informações pessoais - versão simplificada */}
                  <div>
                    <h3 className="text-base font-medium text-gray-700 mb-4">
                      Informações Pessoais
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Nome Completo"
                        className={`w-full p-3 border rounded-lg outline-none ${
                          erros.nome ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {mostrarErro("nome")}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <InputMask
                            mask="999.999.999-99"
                            maskChar={null}
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="text"
                                placeholder="CPF"
                                className={`w-full p-3 border rounded-lg outline-none ${
                                  erros.cpf
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                required
                              />
                            )}
                          </InputMask>
                          {mostrarErro("cpf")}
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email"
                          className={`w-full p-3 border rounded-lg outline-none ${
                            erros.email ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <InputMask
                          mask="(99) 99999-9999"
                          maskChar={null}
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <input
                              {...inputProps}
                              type="tel"
                              placeholder="Telefone"
                              className={`w-full p-3 border rounded-lg outline-none ${
                                erros.telefone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              required
                            />
                          )}
                        </InputMask>
                        <InputMask
                          mask="99/99/9999"
                          maskChar={null}
                          name="dataNascimento"
                          value={formData.dataNascimento}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => (
                            <input
                              {...inputProps}
                              type="text"
                              placeholder="Data de Nascimento"
                              className={`w-full p-3 border rounded-lg outline-none ${
                                erros.dataNascimento
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              required
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-base font-medium text-gray-700 mb-4">
                      Endereço
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <InputMask
                            mask="99999-999"
                            maskChar={null}
                            name="cep"
                            value={formData.cep}
                            onChange={(e) => {
                              handleInputChange(e);
                              buscarCEP(e.target.value);
                            }}
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="text"
                                placeholder="CEP"
                                className={`w-full p-3 border rounded-lg outline-none ${
                                  erros.cep
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                required
                              />
                            )}
                          </InputMask>
                        </div>
                        <div className="col-span-3">
                          <input
                            type="text"
                            name="rua"
                            value={formData.rua}
                            onChange={handleInputChange}
                            placeholder="Rua"
                            className={`w-full p-3 border rounded-lg outline-none ${
                              erros.rua ? "border-red-500" : "border-gray-300"
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="numero"
                          value={formData.numero}
                          onChange={handleInputChange}
                          placeholder="Número"
                          className={`w-full p-3 border rounded-lg outline-none ${
                            erros.numero ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        />
                        <input
                          type="text"
                          name="complemento"
                          value={formData.complemento}
                          onChange={handleInputChange}
                          placeholder="Complemento"
                          className="w-full p-3 border border-gray-300 rounded-lg outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <h3 className="text-base font-medium text-gray-700 mb-4">
                      Senha
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="password"
                          name="senha"
                          value={formData.senha}
                          onChange={handleInputChange}
                          placeholder="Senha"
                          className={`w-full p-3 border rounded-lg outline-none ${
                            erros.senha ? "border-red-500" : "border-gray-300"
                          }`}
                          required
                        />
                        {mostrarErro("senha")}
                      </div>
                      <div>
                        <input
                          type="password"
                          name="confirmarSenha"
                          value={formData.confirmarSenha}
                          onChange={handleInputChange}
                          placeholder="Confirmar Senha"
                          className={`w-full p-3 border rounded-lg outline-none ${
                            erros.confirmarSenha
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {mostrarErro("confirmarSenha")}
                      </div>
                    </div>
                  </div>

                  {/* Pagamento para fornecedores */}
                  {tipoUsuario === "fornecedor" && (
                    <div>
                      <h3 className="text-base font-medium text-gray-700 mb-4">
                        Dados de Pagamento
                      </h3>
                      <div className="p-5 bg-green-50 border border-green-100 rounded-lg mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-green-400 p-1 rounded-md">
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
                            <span className="font-medium text-green-800 block">
                              Plano Premium
                            </span>
                            <span className="text-sm text-green-700">
                              R$ 20,00/mês
                            </span>
                          </div>
                        </div>

                        {/* Bandeiras aceitas */}
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-xs text-green-700 mb-2">
                            Aceitamos as principais bandeiras:
                          </div>
                          <div className="flex items-center flex-wrap gap-2">
                            <img
                              src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
                              alt="Visa"
                              className="h-6"
                            />
                            <img
                              src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3-226462.png"
                              alt="Mastercard"
                              className="h-6"
                            />
                            <img
                              src="https://logosmarcas.net/wp-content/uploads/2021/03/Elo-Logo.png"
                              alt="Elo"
                              className="h-6"
                            />
                            <img
                              src="https://cdn.iconscout.com/icon/free/png-256/free-american-express-3-226461.png"
                              alt="American Express"
                              className="h-6"
                            />
                            <img
                              src="https://cdn.worldvectorlogo.com/logos/hipercard-1.svg"
                              alt="Hipercard"
                              className="h-6"
                            />
                          </div>
                        </div>

                        {mercadoPagoReady && (
                          <div className="mt-2 text-xs text-green-600 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Pagamento seguro via Mercado Pago
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <InputMask
                            mask="9999 9999 9999 9999"
                            maskChar={null}
                            name="cartao.numero"
                            value={formData.cartao.numero}
                            onChange={handleInputChange}
                          >
                            {(inputProps) => (
                              <input
                                {...inputProps}
                                type="text"
                                placeholder="Número do cartão"
                                className={`w-full p-3 pl-10 border rounded-lg outline-none ${
                                  erros["cartao.numero"]
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                                required
                              />
                            )}
                          </InputMask>
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                          {erros["cartao.numero"] && (
                            <span className="text-red-500 text-xs">
                              {erros["cartao.numero"]}
                            </span>
                          )}
                        </div>

                        <input
                          type="text"
                          name="cartao.titular"
                          value={formData.cartao.titular}
                          onChange={handleInputChange}
                          placeholder="Nome do titular (como está no cartão)"
                          className={`w-full p-3 border rounded-lg outline-none ${
                            erros["cartao.titular"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {erros["cartao.titular"] && (
                          <span className="text-red-500 text-xs">
                            {erros["cartao.titular"]}
                          </span>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <InputMask
                              mask="99/99"
                              maskChar={null}
                              name="cartao.validade"
                              value={formData.cartao.validade}
                              onChange={handleInputChange}
                            >
                              {(inputProps) => (
                                <input
                                  {...inputProps}
                                  type="text"
                                  placeholder="Validade (MM/AA)"
                                  className={`w-full p-3 border rounded-lg outline-none ${
                                    erros["cartao.validade"]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                  required
                                />
                              )}
                            </InputMask>
                            {erros["cartao.validade"] && (
                              <span className="text-red-500 text-xs">
                                {erros["cartao.validade"]}
                              </span>
                            )}
                          </div>
                          <div>
                            <InputMask
                              mask="999"
                              maskChar={null}
                              name="cartao.cvv"
                              value={formData.cartao.cvv}
                              onChange={handleInputChange}
                            >
                              {(inputProps) => (
                                <input
                                  {...inputProps}
                                  type="text"
                                  placeholder="CVV"
                                  className={`w-full p-3 border rounded-lg outline-none ${
                                    erros["cartao.cvv"]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                  required
                                />
                              )}
                            </InputMask>
                            {erros["cartao.cvv"] && (
                              <span className="text-red-500 text-xs">
                                {erros["cartao.cvv"]}
                              </span>
                            )}
                          </div>
                        </div>

                        {erros.pagamento && (
                          <div className="bg-red-50 p-2 rounded-lg border border-red-200 text-red-600 text-sm">
                            {erros.pagamento}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-5">
                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 text-lg"
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
                          Cadastrando...
                        </span>
                      ) : (
                        "Cadastrar"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

const Navbar = ({
  onLogin,
  usuarioLogado,
  onLogout,
  onNavigate,
  onEditarPerfil,
}) => {
  const [menu, setMenu] = useState(false);
  const handleChange = () => setMenu(!menu);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
    // Implementar navegação para a página de editar perfil
    iziToast.info({
      title: "Perfil",
      message: "Funcionalidade de editar perfil será implementada em breve!",
      position: "topRight",
      timeout: 3000,
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
          onEditarPerfil();
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
            to="about"
            spy
            smooth
            duration={500}
            className="text-gray-700 hover:text-green-600 transition-all cursor-pointer"
          >
            Sobre
          </Link>
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
            <button
              onClick={openModal}
              className="px-6 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all rounded-full font-medium"
            >
              Login
            </button>
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
              to="about"
              spy
              smooth
              duration={500}
              className="text-gray-700 hover:text-green-600 transition-all cursor-pointer py-3 border-b border-gray-100"
              onClick={handleChange}
            >
              Sobre
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
              <button
                onClick={() => {
                  openModal();
                  handleChange();
                }}
                className="mt-4 w-full py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all rounded-full"
              >
                Login
              </button>
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
                  onClick={handleEditarPerfil}
                  className="w-full py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all rounded-full"
                >
                  Editar Perfil
                </button>

                {usuarioLogado.tipo === "fornecedor" && (
                  <button
                    onClick={() => {
                      irParaDashboard();
                      handleChange();
                    }}
                    className="w-full py-2 bg-green-600 text-white hover:bg-green-700 transition-all rounded-full"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    handleChange();
                  }}
                  className="w-full py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-full"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} closeModal={closeModal} onLogin={onLogin} />
    </div>
  );
};

Navbar.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onEditarPerfil: PropTypes.func.isRequired,
  usuarioLogado: PropTypes.shape({
    logado: PropTypes.bool,
    tipo: PropTypes.string,
    nome: PropTypes.string,
    email: PropTypes.string,
  }),
};

Navbar.defaultProps = {
  usuarioLogado: {
    logado: false,
    tipo: "",
    nome: "",
    email: "",
  },
};

// Adicione isso no fim do arquivo antes do export default Navbar
// Definindo uma classe global para remover a barra de rolagem
const style = document.createElement("style");
style.textContent = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default Navbar;
