import { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { AiOutlineMenuUnfold, AiOutlineClose } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import {
    FaUserCircle,
    FaWhatsapp,
    FaStar,
    FaRegStar,
    FaUtensils,
    FaLeaf,
} from "react-icons/fa";
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
import { router } from "@inertiajs/react";

const LoginModal = ({ isOpen, closeModal, onLogin, openCadastroModal }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        senha: "",
        lembrar: false,
    });
    const [erros, setErros] = useState({});
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (erros[name]) {
            setErros((prev) => {
                const newErros = { ...prev };
                delete newErros[name];
                return newErros;
            });
        }
    };

    const validarLogin = () => {
        const novosErros = {};

        if (!formData.email) {
            novosErros.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            novosErros.email = "Email inválido";
        }

        if (!formData.senha) {
            novosErros.senha = "Senha é obrigatória";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarLogin()) return;

        setIsSubmitting(true);

        try {
            // Enviar dados para a API de login
            const response = await fetch("/api/clientes/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify({
                    email: formData.email,
                    senha: formData.senha,
                }),
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.message || "Erro ao fazer login");
            }

            // Armazenar o token no localStorage
            localStorage.setItem("auth_token", resultado.token);

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

            // Chamar a função de login do componente pai, se disponível
            if (typeof onLogin === "function") {
                try {
                    onLogin(resultado.cliente);
                } catch (loginError) {
                    console.error("Erro ao processar login:", loginError);
                }
            } else {
                console.warn("Função onLogin não está disponível");
            }

            // Fechar o modal
            closeModal();

            // Redirecionar para a página apropriada se houver um URL de redirecionamento
            if (resultado.redirect) {
                window.location.href = resultado.redirect;
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
            iziToast.error({
                title: "Erro",
                message: error.message || "Email ou senha incorretos.",
                position: "topRight",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
            setErros({ resetEmail: "Email inválido" });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulação de envio de email
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setEmailSent(true);

            iziToast.success({
                title: "Email enviado!",
                message:
                    "Verifique sua caixa de entrada para redefinir sua senha.",
                position: "bottomRight",
                timeout: 5000,
            });
        } catch (error) {
            iziToast.error({
                title: "Erro",
                message: "Não foi possível enviar o email de recuperação.",
                position: "topRight",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para lidar com login social
    const handleSocialLogin = (provider) => {
        iziToast.info({
            title: "Autenticação Social",
            message: `Login com ${provider} será implementado em breve!`,
            position: "bottomRight",
            timeout: 3000,
        });
    };

    // Renderiza o formulário de recuperação de senha
    if (forgotPassword) {
        return (
            isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden transform transition-all duration-300 scale-100 animate-fadeIn">
                        {/* Cabeçalho com gradiente */}
                        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 relative">
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60')] bg-cover bg-center opacity-15 mix-blend-overlay"></div>

                            <button
                                onClick={() => {
                                    setForgotPassword(false);
                                    setEmailSent(false);
                                }}
                                className="absolute top-4 right-4 bg-white bg-opacity-20 p-1.5 rounded-full text-white hover:bg-opacity-40 transition-all z-10"
                            >
                                <AiOutlineClose size={16} />
                            </button>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white">
                                    Recuperar Senha
                                </h2>
                                <p className="text-white text-opacity-80 mt-1">
                                    Digite seu email para receber instruções
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            {!emailSent ? (
                                <form
                                    onSubmit={handleForgotPassword}
                                    className="space-y-5"
                                >
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
                                                value={resetEmail}
                                                onChange={(e) =>
                                                    setResetEmail(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        {erros.resetEmail && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {erros.resetEmail}
                                            </p>
                                        )}
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
                                                Enviando...
                                            </span>
                                        ) : (
                                            "Enviar Instruções"
                                        )}
                                    </button>

                                    <div className="mt-6 text-center">
                                        <button
                                            type="button"
                                            className="text-green-600 font-medium hover:underline transition-all"
                                            onClick={() =>
                                                setForgotPassword(false)
                                            }
                                        >
                                            Voltar para Login
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="py-6 text-center">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <svg
                                            className="w-8 h-8 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        Email Enviado!
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Enviamos as instruções para {resetEmail}
                                        . Verifique sua caixa de entrada.
                                    </p>
                                    <button
                                        type="button"
                                        className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        onClick={() => {
                                            setForgotPassword(false);
                                            setEmailSent(false);
                                        }}
                                    >
                                        Voltar para Login
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        );
    }

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
                                        name="email"
                                        placeholder="Seu email"
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                                            erros.email
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                {erros.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {erros.email}
                                    </p>
                                )}
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
                                        name="senha"
                                        placeholder="Sua senha"
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                                            erros.senha
                                                ? "border-red-500"
                                                : "border-gray-200"
                                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        value={formData.senha}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                {erros.senha && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {erros.senha}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="lembrar"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        checked={formData.lembrar}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-gray-700"
                                    >
                                        Lembrar-me
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                                    onClick={() => setForgotPassword(true)}
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

                            <div className="mt-6">
                                <div className="relative my-3">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-4 text-sm text-gray-500">
                                            ou continuar com
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSocialLogin("Google")
                                        }
                                        className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="#EA4335"
                                                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                                            />
                                            <path
                                                fill="#4A90E2"
                                                d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSocialLogin("Facebook")
                                        }
                                        className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="#1877F2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSocialLogin("Apple")
                                        }
                                        className="py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <div className="text-sm text-gray-600">
                                    Não tem uma conta?{" "}
                                    <button
                                        className="text-green-600 font-medium hover:underline transition-all"
                                        onClick={() => {
                                            closeModal();
                                            openCadastroModal();
                                        }}
                                        type="button"
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
    const [currentStep, setCurrentStep] = useState(1);
    const [termosAceitos, setTermosAceitos] = useState(false);
    const [politicaAceita, setPoliticaAceita] = useState(false);
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
        bairro: "",
        cidade: "",
        estado: "",
        cartao: {
            numero: "",
            validade: "",
            cvv: "",
            titular: "",
        },
    });
    const [erros, setErros] = useState({});
    const formRef = useRef(null);

    // Total de passos
    const totalSteps = tipoUsuario === "fornecedor" ? 4 : 3;

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

        // Formatar dados específicos
        if (name === "cpf") {
            formatarCPF(value);
        } else if (name === "telefone") {
            formatarTelefone(value);
        } else if (name === "cep") {
            formatarCEP(value);
            if (value.replace(/\D/g, "").length === 8) {
                buscarCEP(value);
            }
        } else if (name === "cartao.numero") {
            formatarCartao(value);
        } else if (name === "cartao.validade") {
            formatarValidade(value);
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

    // Funções de formatação
    const formatarCPF = (value) => {
        const cpfLimpo = value.replace(/\D/g, "");
        let cpfFormatado = cpfLimpo;

        if (cpfLimpo.length > 3) {
            cpfFormatado =
                cpfLimpo.substring(0, 3) + "." + cpfLimpo.substring(3);
        }
        if (cpfLimpo.length > 6) {
            cpfFormatado =
                cpfFormatado.substring(0, 7) + "." + cpfFormatado.substring(7);
        }
        if (cpfLimpo.length > 9) {
            cpfFormatado =
                cpfFormatado.substring(0, 11) +
                "-" +
                cpfFormatado.substring(11);
        }

        setFormData((prev) => ({ ...prev, cpf: cpfFormatado }));
    };

    const formatarTelefone = (value) => {
        const telefoneLimpo = value.replace(/\D/g, "");
        let telefoneFormatado = telefoneLimpo;

        if (telefoneLimpo.length > 0) {
            telefoneFormatado = "(" + telefoneLimpo.substring(0, 2);
        }
        if (telefoneLimpo.length > 2) {
            telefoneFormatado += ") " + telefoneLimpo.substring(2, 7);
        }
        if (telefoneLimpo.length > 7) {
            telefoneFormatado += "-" + telefoneLimpo.substring(7, 11);
        }

        setFormData((prev) => ({ ...prev, telefone: telefoneFormatado }));
    };

    const formatarCEP = (value) => {
        const cepLimpo = value.replace(/\D/g, "");
        let cepFormatado = cepLimpo;

        if (cepLimpo.length > 5) {
            cepFormatado =
                cepLimpo.substring(0, 5) + "-" + cepLimpo.substring(5, 8);
        }

        setFormData((prev) => ({ ...prev, cep: cepFormatado }));
    };

    const formatarCartao = (value) => {
        const cartaoLimpo = value.replace(/\D/g, "");
        let cartaoFormatado = cartaoLimpo.replace(/(\d{4})/g, "$1 ").trim();

        setFormData((prev) => ({
            ...prev,
            cartao: {
                ...prev.cartao,
                numero: cartaoFormatado,
            },
        }));
    };

    const formatarValidade = (value) => {
        const validadeLimpa = value.replace(/\D/g, "");
        let validadeFormatada = validadeLimpa;

        if (validadeLimpa.length > 2) {
            validadeFormatada =
                validadeLimpa.substring(0, 2) +
                "/" +
                validadeLimpa.substring(2, 4);
        }

        setFormData((prev) => ({
            ...prev,
            cartao: {
                ...prev.cartao,
                validade: validadeFormatada,
            },
        }));
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

    const validarPasso = () => {
        const novosErros = {};

        // Validar de acordo com o passo atual
        if (currentStep === 1) {
            // Validação de informações pessoais
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
            } else {
                // Verificar se é maior de idade
                const hoje = new Date();
                const nascimento = new Date(formData.dataNascimento);
                const idade = hoje.getFullYear() - nascimento.getFullYear();
                const mesAtual = hoje.getMonth() < nascimento.getMonth();
                const mesmoMesDiaAnterior =
                    hoje.getMonth() === nascimento.getMonth() &&
                    hoje.getDate() < nascimento.getDate();

                if (
                    idade < 18 ||
                    (idade === 18 && (mesAtual || mesmoMesDiaAnterior))
                ) {
                    novosErros.dataNascimento =
                        "É preciso ser maior de 18 anos";
                }
            }
        } else if (currentStep === 2) {
            // Validação de endereço
            if (!validarCEP(formData.cep)) {
                novosErros.cep = "CEP inválido";
            }

            if (!formData.rua) {
                novosErros.rua = "Endereço obrigatório";
            }

            if (!formData.numero) {
                novosErros.numero = "Número obrigatório";
            }

            if (!formData.bairro) {
                novosErros.bairro = "Bairro obrigatório";
            }

            if (!formData.cidade) {
                novosErros.cidade = "Cidade obrigatória";
            }

            if (!formData.estado) {
                novosErros.estado = "Estado obrigatório";
            }
        } else if (currentStep === 3) {
            // Validação de senha
            if (!validarSenha(formData.senha)) {
                novosErros.senha =
                    "Senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número";
            }

            if (formData.senha !== formData.confirmarSenha) {
                novosErros.confirmarSenha = "As senhas não coincidem";
            }

            if (!termosAceitos) {
                novosErros.termos = "Você precisa aceitar os termos de uso";
            }

            if (!politicaAceita) {
                novosErros.politica =
                    "Você precisa aceitar a política de privacidade";
            }
        } else if (currentStep === 4 && tipoUsuario === "fornecedor") {
            // Validações para pagamento (fornecedores)
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

    const nextStep = () => {
        if (validarPasso()) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        } else {
            // Rolar para o primeiro erro
            const firstError = document.querySelector(".error-message");
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
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
            setErros({
                ...erros,
                pagamento: "Erro ao processar cartão de crédito",
            });
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validar formulário
            if (!validarPasso()) {
                setIsSubmitting(false);
                return;
            }

            // Preparar os dados para envio
            const dadosCadastro = {
                nome_completo: formData.nome,
                cpf: formData.cpf.replace(/\D/g, ""),
                telefone: formData.telefone.replace(/\D/g, ""),
                email: formData.email,
                data_nascimento: formData.dataNascimento,
                cep: formData.cep.replace(/\D/g, ""),
                rua: formData.rua,
                numero: formData.numero,
                complemento: formData.complemento,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                senha: formData.senha,
                senha_confirmation: formData.confirmarSenha,
                termos_uso: termosAceitos,
                politica_privacidade: politicaAceita,
                tipoUsuario:
                    tipoUsuario === "fornecedor" ? "fornecedor" : "cliente",
            };

            // Adicionar campos de cartão se for fornecedor
            if (tipoUsuario === "fornecedor") {
                dadosCadastro.numero_cartao = formData.cartao.numero.replace(
                    /\D/g,
                    ""
                );
                dadosCadastro.nome_titular = formData.cartao.titular;
                dadosCadastro.validade_cartao = formData.cartao.validade;
                dadosCadastro.cvv = formData.cartao.cvv;
            }

            console.log("Enviando dados para API:", dadosCadastro);

            // Enviar dados para a API
            const response = await fetch("/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                },
                body: JSON.stringify(dadosCadastro),
            });

            const resultado = await response.json();

            if (!response.ok) {
                // Se for um erro de validação (422), exibir os erros específicos
                if (response.status === 422 && resultado.errors) {
                    const errosValidacao = resultado.errors;

                    // Mostrar detalhes dos erros ao usuário
                    console.error("Erros de validação:", errosValidacao);

                    // Atualizar o estado de erros com os erros do servidor
                    const novosErros = {};
                    Object.keys(errosValidacao).forEach((campo) => {
                        novosErros[campo] = errosValidacao[campo][0];
                    });

                    setErros(novosErros);

                    // Exibir mensagem com o resumo dos erros
                    const mensagemErro = Object.values(errosValidacao)
                        .flat()
                        .join("\n");

                    iziToast.error({
                        title: "Erro de validação",
                        message:
                            mensagemErro || "Verifique os campos do formulário",
                        position: "topRight",
                        timeout: 6000,
                    });

                    throw new Error("Erro de validação");
                }

                throw new Error(
                    resultado.message || "Erro ao cadastrar usuário"
                );
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

            // Armazenar o token no localStorage
            localStorage.setItem("auth_token", resultado.token);

            // Chamar a função de login do componente pai, se disponível
            if (typeof onLogin === "function") {
                try {
                    onLogin(resultado.cliente);
                } catch (loginError) {
                    console.error(
                        "Erro ao fazer login automático:",
                        loginError
                    );
                    // Continua o fluxo mesmo se o login falhar
                }
            } else {
                console.warn("Função onLogin não está disponível");
            }

            // Fechar o modal de qualquer maneira
            closeModal();

            // NOVO: Redirecionar para o dashboard de fornecedor se for um fornecedor
            if (tipoUsuario === "fornecedor" && resultado.redirect) {
                // Usar router em vez de window.location para evitar recarregamento completo
                router.visit(resultado.redirect);
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
            // Só exibe mensagem de erro genérica se não for um erro de validação (que já foi tratado)
            if (error.message !== "Erro de validação") {
                iziToast.error({
                    title: "Erro",
                    message: error.message || "Ocorreu um erro ao cadastrar.",
                    position: "topRight",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const mostrarErro = (campo) => {
        return erros[campo] ? (
            <p className="text-red-500 text-sm mt-1 error-message">
                {erros[campo]}
            </p>
        ) : null;
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 backdrop-blur-sm transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-100 animate-fadeIn">
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
                                {tipoUsuario === "fornecedor"
                                    ? "Cadastro de Fornecedor"
                                    : "Criar sua conta"}
                            </h2>
                            <p className="text-white text-opacity-80 mt-1">
                                {tipoUsuario === "fornecedor"
                                    ? "Ofereça seus produtos saudáveis na plataforma"
                                    : "Acesse o melhor da alimentação saudável"}
                            </p>
                        </div>
                    </div>

                    {/* Seleção de tipo de usuário */}
                    {currentStep === 1 && (
                        <div className="px-6 pt-4">
                            <p className="text-gray-600 mb-3">Tipo de conta:</p>
                            <div className="flex gap-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setTipoUsuario("usuario")}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                                        tipoUsuario === "usuario"
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <FaUserCircle
                                        size={24}
                                        className={
                                            tipoUsuario === "usuario"
                                                ? "text-green-500"
                                                : "text-gray-400"
                                        }
                                    />
                                    <span
                                        className={`font-medium mt-2 ${
                                            tipoUsuario === "usuario"
                                                ? "text-green-700"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        Cliente
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Quero encomendar comida saudável
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTipoUsuario("fornecedor")}
                                    className={`flex-1 py-3 px-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                                        tipoUsuario === "fornecedor"
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <FaUtensils
                                        size={24}
                                        className={
                                            tipoUsuario === "fornecedor"
                                                ? "text-green-500"
                                                : "text-gray-400"
                                        }
                                    />
                                    <span
                                        className={`font-medium mt-2 ${
                                            tipoUsuario === "fornecedor"
                                                ? "text-green-700"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        Fornecedor
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Quero vender meus pratos saudáveis
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Barra de progresso */}
                    <div className="px-6 py-4">
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-green-500 h-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${
                                        (currentStep / totalSteps) * 100
                                    }%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Informações Pessoais</span>
                            <span>Endereço</span>
                            <span>Acesso</span>
                            {tipoUsuario === "fornecedor" && (
                                <span>Pagamento</span>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Passo 1: Informações pessoais */}
                            {currentStep === 1 && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Nome completo
                                        </label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleInputChange}
                                            placeholder="Seu nome completo"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.nome
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
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
                                            placeholder="seu.email@exemplo.com"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.email
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("email")}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                CPF
                                            </label>
                                            <input
                                                type="text"
                                                name="cpf"
                                                value={formData.cpf}
                                                onChange={handleInputChange}
                                                placeholder="000.000.000-00"
                                                maxLength={14}
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.cpf
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("cpf")}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Telefone
                                            </label>
                                            <input
                                                type="text"
                                                name="telefone"
                                                value={formData.telefone}
                                                onChange={handleInputChange}
                                                placeholder="(00) 00000-0000"
                                                maxLength={15}
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.telefone
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("telefone")}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Data de nascimento
                                        </label>
                                        <input
                                            type="date"
                                            name="dataNascimento"
                                            value={formData.dataNascimento}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.dataNascimento
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("dataNascimento")}
                                    </div>
                                </>
                            )}

                            {/* Passo 2: Endereço */}
                            {currentStep === 2 && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                CEP
                                            </label>
                                            <input
                                                type="text"
                                                name="cep"
                                                value={formData.cep}
                                                onChange={handleInputChange}
                                                placeholder="00000-000"
                                                maxLength={9}
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.cep
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("cep")}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Rua
                                        </label>
                                        <input
                                            type="text"
                                            name="rua"
                                            value={formData.rua}
                                            onChange={handleInputChange}
                                            placeholder="Nome da rua"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.rua
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("rua")}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Número
                                            </label>
                                            <input
                                                type="text"
                                                name="numero"
                                                value={formData.numero}
                                                onChange={handleInputChange}
                                                placeholder="Número"
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.numero
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("numero")}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Complemento
                                            </label>
                                            <input
                                                type="text"
                                                name="complemento"
                                                value={formData.complemento}
                                                onChange={handleInputChange}
                                                placeholder="Apto, bloco, etc."
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            name="bairro"
                                            value={formData.bairro}
                                            onChange={handleInputChange}
                                            placeholder="Bairro"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.bairro
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("bairro")}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Cidade
                                            </label>
                                            <input
                                                type="text"
                                                name="cidade"
                                                value={formData.cidade}
                                                onChange={handleInputChange}
                                                placeholder="Cidade"
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.cidade
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("cidade")}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Estado
                                            </label>
                                            <input
                                                type="text"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                                placeholder="UF"
                                                maxLength={2}
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros.estado
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {mostrarErro("estado")}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Passo 3: Senha e Termos */}
                            {currentStep === 3 && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Senha
                                        </label>
                                        <input
                                            type="password"
                                            name="senha"
                                            value={formData.senha}
                                            onChange={handleInputChange}
                                            placeholder="Digite sua senha"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.senha
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("senha")}
                                        <p className="text-gray-500 text-xs mt-1">
                                            A senha deve ter no mínimo 8
                                            caracteres, incluindo uma letra
                                            maiúscula, uma minúscula e um
                                            número.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                            Confirmar senha
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmarSenha"
                                            value={formData.confirmarSenha}
                                            onChange={handleInputChange}
                                            placeholder="Confirme sua senha"
                                            className={`w-full px-4 py-3 bg-gray-50 border ${
                                                erros.confirmarSenha
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                        />
                                        {mostrarErro("confirmarSenha")}
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <div
                                            className={
                                                erros.termos
                                                    ? "border border-red-500 rounded-lg p-3"
                                                    : ""
                                            }
                                        >
                                            <label className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    checked={termosAceitos}
                                                    onChange={(e) =>
                                                        setTermosAceitos(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-5 w-5 mt-0.5 text-green-600 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Li e aceito os{" "}
                                                    <a
                                                        href="#"
                                                        className="text-green-600 hover:underline"
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Termos de Uso
                                                    </a>{" "}
                                                    do LeveFit
                                                </span>
                                            </label>
                                            {mostrarErro("termos")}
                                        </div>

                                        <div
                                            className={
                                                erros.politica
                                                    ? "border border-red-500 rounded-lg p-3"
                                                    : ""
                                            }
                                        >
                                            <label className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    checked={politicaAceita}
                                                    onChange={(e) =>
                                                        setPoliticaAceita(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="h-5 w-5 mt-0.5 text-green-600 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Concordo com a{" "}
                                                    <a
                                                        href="#"
                                                        className="text-green-600 hover:underline"
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        Política de Privacidade
                                                    </a>
                                                </span>
                                            </label>
                                            {mostrarErro("politica")}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Passo 4: Informações de Pagamento (apenas para fornecedores) */}
                            {currentStep === 4 &&
                                tipoUsuario === "fornecedor" && (
                                    <>
                                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
                                            <h3 className="text-amber-800 font-medium mb-2">
                                                Assinatura de Fornecedor
                                            </h3>
                                            <p className="text-amber-700 text-sm">
                                                Para oferecer seus produtos na
                                                plataforma LeveFit, é necessário
                                                assinar nosso plano mensal de R$
                                                69,90 por mês. Você terá acesso
                                                a todas as ferramentas de gestão
                                                e exposição de seus produtos.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Número do cartão
                                            </label>
                                            <input
                                                type="text"
                                                name="cartao.numero"
                                                value={formData.cartao.numero}
                                                onChange={handleInputChange}
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros["cartao.numero"]
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {erros["cartao.numero"] && (
                                                <p className="text-red-500 text-sm mt-1 error-message">
                                                    {erros["cartao.numero"]}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                Nome do titular
                                            </label>
                                            <input
                                                type="text"
                                                name="cartao.titular"
                                                value={formData.cartao.titular}
                                                onChange={handleInputChange}
                                                placeholder="Nome como está no cartão"
                                                className={`w-full px-4 py-3 bg-gray-50 border ${
                                                    erros["cartao.titular"]
                                                        ? "border-red-500"
                                                        : "border-gray-200"
                                                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                            />
                                            {erros["cartao.titular"] && (
                                                <p className="text-red-500 text-sm mt-1 error-message">
                                                    {erros["cartao.titular"]}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                    Validade
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cartao.validade"
                                                    value={
                                                        formData.cartao.validade
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="MM/AA"
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3 bg-gray-50 border ${
                                                        erros["cartao.validade"]
                                                            ? "border-red-500"
                                                            : "border-gray-200"
                                                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                                />
                                                {erros["cartao.validade"] && (
                                                    <p className="text-red-500 text-sm mt-1 error-message">
                                                        {
                                                            erros[
                                                                "cartao.validade"
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cartao.cvv"
                                                    value={formData.cartao.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    maxLength={3}
                                                    className={`w-full px-4 py-3 bg-gray-50 border ${
                                                        erros["cartao.cvv"]
                                                            ? "border-red-500"
                                                            : "border-gray-200"
                                                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200`}
                                                />
                                                {erros["cartao.cvv"] && (
                                                    <p className="text-red-500 text-sm mt-1 error-message">
                                                        {erros["cartao.cvv"]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="py-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Assinatura mensal:
                                                </span>
                                                <span className="font-medium">
                                                    R$ 69,90/mês
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mt-1">
                                                <span className="text-gray-600">
                                                    Taxa de processamento:
                                                </span>
                                                <span className="font-medium">
                                                    R$ 0,00
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-200 mt-3 pt-3 flex items-center justify-between">
                                                <span className="font-medium">
                                                    Total hoje:
                                                </span>
                                                <span className="font-bold text-lg text-green-600">
                                                    R$ 69,90
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}

                            {/* Botões de navegação */}
                            <div className="flex justify-between mt-8">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="py-2.5 px-5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Voltar
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                {currentStep < totalSteps ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="py-2.5 px-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none"
                                    >
                                        Próximo
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="py-2.5 px-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 focus:outline-none flex items-center"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
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
                                                Processando...
                                            </>
                                        ) : (
                                            "Criar Conta"
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <div className="text-sm text-gray-600">
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
                            </div>
                        </div>
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
                        <h2 className="text-2xl font-bold text-center">
                            Meus Pedidos
                        </h2>
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
                                                <h3 className="font-medium text-lg">
                                                    {pedido.prato}
                                                </h3>
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
                                                    onChange={(e) =>
                                                        setComentario(
                                                            e.target.value
                                                        )
                                                    }
                                                ></textarea>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setAvaliacaoAberta(
                                                                null
                                                            )
                                                        }
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={
                                                            finalizarAvaliacao
                                                        }
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
                                                <span className="font-bold">
                                                    {pedido.valor}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                {pedido.status === "Entregue" &&
                                                    !pedidosAvaliados.includes(
                                                        pedido.id
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                iniciarAvaliacao(
                                                                    pedido.id
                                                                )
                                                            }
                                                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                                                        >
                                                            <FaStar size={16} />
                                                            <span>Avaliar</span>
                                                        </button>
                                                    )}

                                                {pedidosAvaliados.includes(
                                                    pedido.id
                                                ) && (
                                                    <div className="flex items-center gap-1 text-gray-600 px-4 py-2">
                                                        <FaStar className="text-yellow-400" />
                                                        <span>Avaliado</span>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        abrirWhatsapp(
                                                            pedido.telefone,
                                                            pedido.prato
                                                        )
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
                const response = await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );
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
        if (
            formData.telefone &&
            formData.telefone.replace(/\D/g, "").length < 10
        ) {
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
                        <h2 className="text-2xl font-bold text-white">
                            Editar Perfil
                        </h2>
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
                                            value={
                                                formData.endereco.complemento
                                            }
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
                                        Para alterar sua senha, preencha sua
                                        senha atual e depois a nova senha.
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
                                        A senha deve ter no mínimo 8 caracteres,
                                        incluir letra maiúscula, minúscula e
                                        número.
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
    const [isEditarPerfilModalOpen, setIsEditarPerfilModalOpen] =
        useState(false);
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

    // Estado para guardar o usuário logado
    const [localUsuarioLogado, setLocalUsuarioLogado] = useState(
        usuarioLogado || { logado: false }
    );

    // Verificar se tem token no localStorage ao iniciar
    useEffect(() => {
        const token = localStorage.getItem("auth_token");

        // Se tiver token e não estiver logado, buscar as informações do usuário
        if (token && !localUsuarioLogado.logado) {
            fetchUserInfo(token);
        }
    }, []);

    // Função para obter as informações do usuário com o token
    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch("/api/cliente", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                handleLoginSuccess(userData);
            } else {
                // Token inválido ou expirado, remove
                localStorage.removeItem("auth_token");
            }
        } catch (error) {
            console.error("Erro ao buscar informações do usuário:", error);
        }
    };

    // Função para tratar o login bem-sucedido
    const handleLoginSuccess = (userData) => {
        setLocalUsuarioLogado({
            ...userData,
            logado: true,
        });

        // Se o componente pai forneceu uma função onLogin, chama
        if (typeof onLogin === "function") {
            try {
                onLogin(userData);
            } catch (error) {
                console.error("Erro ao chamar onLogin:", error);
            }
        }
    };

    // Função para fazer logout
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("auth_token");

            if (token) {
                await fetch("/api/cliente/logout", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Limpa o token do localStorage
                localStorage.removeItem("auth_token");
            }

            // Atualiza o estado local
            setLocalUsuarioLogado({ logado: false });

            // Se o componente pai forneceu uma função onLogout, chama
            if (typeof onLogout === "function") {
                onLogout();
            }

            setUserMenuOpen(false);

            iziToast.success({
                title: "Logout",
                message: "Você saiu da sua conta com sucesso",
                position: "topRight",
                timeout: 3000,
            });

            // Redireciona para a home
            window.location.href = "/";
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

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
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const irParaDashboard = () => {
        // Navegar diretamente para a rota dashboard de fornecedor
        try {
            router.visit("/fornecedor/dashboard", {
                preserveState: false,
                onSuccess: () => {
                    console.log("Navegação para dashboard bem-sucedida");
                },
                onError: (errors) => {
                    console.error("Erro na navegação:", errors);
                },
            });
        } catch (error) {
            console.error("Erro ao navegar para o dashboard:", error);
            // Fallback para navegação tradicional caso o router falhe
            window.location.href = "/fornecedor/dashboard";
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

    // Usar o usuário logado do estado local ou da prop
    const effectiveUsuarioLogado = localUsuarioLogado.logado
        ? localUsuarioLogado
        : usuarioLogado || { logado: false };

    const UserMenu = () => (
        <div
            ref={userMenuRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
        >
            <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 flex items-center">
                    {effectiveUsuarioLogado.nome}
                    {effectiveUsuarioLogado.tipo === "fornecedor" && (
                        <span
                            className="ml-2 text-amber-600"
                            title="Conta de Fornecedor"
                        >
                            <FaUtensils size={12} />
                        </span>
                    )}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {effectiveUsuarioLogado.email}
                </p>
                {effectiveUsuarioLogado.tipo === "fornecedor" && (
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <FaUtensils size={10} className="mr-1" />
                        Fornecedor
                    </span>
                )}
            </div>

            {effectiveUsuarioLogado.tipo === "fornecedor" && (
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
                onClick={handleLogout}
            >
                Sair
            </button>
        </div>
    );

    return (
        <div
            className={`fixed w-full z-50 ${
                scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
            } transition-all duration-300`}
        >
            <div className="container mx-auto flex flex-row justify-between items-center px-4 md:px-8">
                <div className="flex items-center">
                    <Link to="home" spy smooth duration={500}>
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-green-500 text-white rounded-full flex items-center justify-center mr-2">
                                <FaLeaf className="text-white text-xl" />
                            </div>
                            <h1 className="text-2xl font-bold text-green-600">
                                LeveFit
                            </h1>
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        to="home"
                        spy
                        smooth
                        duration={500}
                        className="text-gray-700 hover:text-green-600 transition-all cursor-pointer relative py-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-500 after:transition-all after:duration-300"
                    >
                        Home
                    </Link>
                    <div className="relative group">
                        <div className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition-all cursor-pointer py-2">
                            <span>Pratos</span>
                            <BiChevronDown className="group-hover:rotate-180 transition-transform duration-300" />
                        </div>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <ul className="py-2">
                                <li>
                                    <Link
                                        to="dishes"
                                        spy
                                        smooth
                                        duration={500}
                                        className="text-gray-700 hover:text-white hover:bg-green-500 transition-all cursor-pointer block py-2 px-4"
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
                                        className="text-gray-700 hover:text-white hover:bg-green-500 transition-all cursor-pointer block py-2 px-4"
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
                                        className="text-gray-700 hover:text-white hover:bg-green-500 transition-all cursor-pointer block py-2 px-4"
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
                        className="text-gray-700 hover:text-green-600 transition-all cursor-pointer relative py-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-500 after:transition-all after:duration-300"
                    >
                        Destaques
                    </Link>
                    <Link
                        to="review"
                        spy
                        smooth
                        duration={500}
                        className="text-gray-700 hover:text-green-600 transition-all cursor-pointer relative py-2 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-green-500 after:transition-all after:duration-300"
                    >
                        Avaliações
                    </Link>

                    {!effectiveUsuarioLogado.logado ? (
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
                                    <div className="relative">
                                        <FaUserCircle className="text-2xl text-green-600" />
                                        {effectiveUsuarioLogado.tipo ===
                                            "fornecedor" && (
                                            <div
                                                className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3 border border-white"
                                                title="Conta de Fornecedor"
                                            ></div>
                                        )}
                                    </div>
                                    <span className="font-medium">
                                        {effectiveUsuarioLogado.nome ||
                                            "Usuário"}
                                    </span>
                                    {effectiveUsuarioLogado.tipo ===
                                        "fornecedor" && (
                                        <div
                                            className="ml-1 flex items-center text-amber-600"
                                            title="Conta de Fornecedor"
                                        >
                                            <FaUtensils className="text-sm" />
                                        </div>
                                    )}
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

                        {!effectiveUsuarioLogado.logado ? (
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
                                <div className="flex items-center p-4 bg-green-50 rounded-lg mb-2">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm mr-3">
                                            <span className="text-lg font-bold">
                                                {effectiveUsuarioLogado.nome
                                                    ? effectiveUsuarioLogado.nome
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "U"}
                                            </span>
                                        </div>
                                        {effectiveUsuarioLogado.tipo ===
                                            "fornecedor" && (
                                            <div
                                                className="absolute -top-1 -right-2 bg-amber-500 rounded-full w-5 h-5 border-2 border-white flex items-center justify-center"
                                                title="Conta de Fornecedor"
                                            >
                                                <FaUtensils className="text-white text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 flex items-center">
                                            {effectiveUsuarioLogado.nome ||
                                                "Usuário"}
                                            {effectiveUsuarioLogado.tipo ===
                                                "fornecedor" && (
                                                <span
                                                    className="ml-2 text-amber-600"
                                                    title="Conta de Fornecedor"
                                                >
                                                    <FaUtensils />
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {effectiveUsuarioLogado.email}
                                        </p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                            {effectiveUsuarioLogado.tipo ===
                                            "fornecedor"
                                                ? "Fornecedor"
                                                : "Cliente"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        openPedidosModal();
                                        handleChange();
                                    }}
                                    className="w-full py-3 text-gray-700 hover:bg-green-50 transition-all rounded-lg flex items-center px-4 gap-3 border border-gray-200"
                                >
                                    <FaWhatsapp className="text-green-500 text-lg" />
                                    <span className="font-medium">
                                        Meus Pedidos
                                    </span>
                                </button>

                                <button
                                    onClick={() => {
                                        handleEditarPerfil();
                                        handleChange();
                                    }}
                                    className="w-full py-3 text-gray-700 hover:bg-green-50 transition-all rounded-lg flex items-center px-4 gap-3 border border-gray-200"
                                >
                                    <svg
                                        className="w-5 h-5 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        ></path>
                                    </svg>
                                    <span className="font-medium">
                                        Editar Perfil
                                    </span>
                                </button>

                                {effectiveUsuarioLogado.tipo ===
                                    "fornecedor" && (
                                    <button
                                        onClick={() => {
                                            irParaDashboard();
                                            handleChange();
                                        }}
                                        className="w-full py-3 bg-green-500 text-white hover:bg-green-600 transition-all rounded-lg flex items-center px-4 gap-3"
                                    >
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            ></path>
                                        </svg>
                                        <span className="font-medium">
                                            Dashboard
                                        </span>
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        handleChange();
                                    }}
                                    className="w-full py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-lg flex items-center px-4 gap-3 mt-2"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        ></path>
                                    </svg>
                                    <span className="font-medium">
                                        Sair da conta
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <LoginModal
                isOpen={isLoginModalOpen}
                closeModal={closeLoginModal}
                onLogin={handleLoginSuccess}
                openCadastroModal={openCadastroModal}
            />
            <CadastroModal
                isOpen={isCadastroModalOpen}
                closeModal={closeCadastroModal}
                onLogin={handleLoginSuccess}
                openLoginModal={openLoginModal}
            />
            <PedidosWhatsappModal
                isOpen={isPedidosModalOpen}
                closeModal={closePedidosModal}
            />
            <EditarPerfilModal
                isOpen={isEditarPerfilModalOpen}
                closeModal={closeEditarPerfilModal}
                usuarioLogado={effectiveUsuarioLogado}
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
