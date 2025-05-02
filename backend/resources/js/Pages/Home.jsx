import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Pratos from "../components/Pratos";
import Review from "../components/Review";
import Button from "../layouts/Button";
import AnimatedTitle from "./AnimatedTitle.jsx";
import AnimatedBox from "./AnimatedBox.jsx";

import {
    FaLeaf,
    FaUtensils,
    FaStar,
    FaWhatsapp,
    FaAppleAlt,
    FaRunning,
    FaClock,
    FaDrumstickBite,
    FaHamburger,
    FaCarrot,
    FaFish,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
    const fraseCompleta = "Eleve sua saúde a cada mordida";
    const [textoDigitado, setTextoDigitado] = useState("");
    const [indice, setIndice] = useState(0);

    useEffect(() => {
        if (indice < fraseCompleta.length) {
            const timer = setTimeout(() => {
                setTextoDigitado((prev) => prev + fraseCompleta[indice]);
                setIndice((prev) => prev + 1);
            }, 130);
            return () => clearTimeout(timer);
        }
    }, [indice]);

    // Adicionar estilos CSS customizados para corrigir problemas de corte no carrossel
    useEffect(() => {
        // Adiciona estilos customizados para o slider
        const style = document.createElement("style");
        style.textContent = `
        body {
            overflow-x: hidden;
        }
        .slick-slide {
            padding: 0 10px;
            height: auto;
        }
        .slick-list {
            margin: 0 -10px;
            padding-bottom: 0 !important;
            overflow: hidden;
        }
        .slick-track {
            display: flex !important;
            align-items: stretch !important;
            justify-content: flex-start !important;
            margin-left: auto;
            margin-right: auto;
        }
        .slick-slide > div {
            height: 100%;
        }
        .slick-dots {
            bottom: -10px;
            position: relative;
            margin-top: 15px;
        }
        .slick-dots li button:before {
            font-size: 10px;
            color: #10b981;
            opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
            opacity: 1;
            color: #10b981;
        }
        .slick-prev, .slick-next {
            z-index: 10;
            width: 40px;
            height: 40px;
        }
        .slick-prev {
            left: 0;
        }
        .slick-next {
            right: 0;
        }
        .slick-prev:before, .slick-next:before {
            font-size: 30px;
            color: #10b981;
            opacity: 0.75;
        }
        .slick-prev:hover:before, .slick-next:hover:before {
            opacity: 1;
        }
            @keyframes slidein {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slidein {
  animation: slidein 0.8s ease-out forwards;
}
@keyframes glow {
  0% {
    text-shadow: 0 0 5px #38a169;
  }
  50% {
    text-shadow: 0 0 10px #38a169;
  }
  100% {
    text-shadow: 0 0 5px #38a169;
  }
}

.glow {
  animation: glow 3s ease-in-out infinite;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 4s linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

@keyframes float-slow {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

@keyframes pulse-gentle {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 8s ease-in-out infinite;
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.4) 50%, 
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-rotate-slow {
  animation: rotate 20s linear infinite;
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(10px);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.pop-in {
  animation: pop-in 0.6s forwards ease-out;
}

.shadow-inner-light {
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4);
}

        `;
        document.head.appendChild(style);

        // Simula carregamento de dados
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            document.head.removeChild(style);
            clearTimeout(timer);
        };
    }, []);

    // Configurações do carrossel
    const carrosselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        swipeToSlide: true,
        arrows: true,
        adaptiveHeight: false,
        centerMode: false,
        draggable: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    };

    const restaurantes = [
        {
            id: 1,
            nome: "Saúde no Prato",
            descricao: "Especialistas em pratos veganos e sem glúten",
            imagem: "/img/menu1.jpg",
            rating: 4.8,
            tempo: "30-45 min",
        },
        {
            id: 2,
            nome: "Natureza & Sabor",
            descricao: "Comida orgânica com ingredientes da fazenda",
            imagem: "/img/menu2.jpg",
            rating: 4.6,
            tempo: "25-40 min",
        },
        {
            id: 3,
            nome: "Fit Gourmet",
            descricao: "Pratos balanceados com alto valor proteico",
            imagem: "/img/menu3.jpg",
            rating: 4.9,
            tempo: "35-50 min",
        },
        {
            id: 4,
            nome: "Verde Vida",
            descricao: "Especialistas em saladas e bowls nutritivos",
            imagem: "/img/menu4.jpg",
            rating: 4.7,
            tempo: "20-35 min",
        },
        {
            id: 5,
            nome: "Sabor & Nutrição",
            descricao: "Refeições completas com baixa caloria",
            imagem: "/img/img3.jpg",
            rating: 4.5,
            tempo: "30-45 min",
        },
        {
            id: 6,
            nome: "Energia Natural",
            descricao: "Sucos, smoothies e pratos funcionais",
            imagem: "/img/img4.jpg",
            rating: 4.8,
            tempo: "15-30 min",
        },
    ];

    // Categorias de pratos
    const categoriasPratos = [
        {
            id: 1,
            nome: "Todos",
            icone: <FaUtensils className="text-green-600 text-xl" />,
        },
        {
            id: 2,
            nome: "Aves",
            icone: <FaDrumstickBite className="text-green-600 text-xl" />,
        },
        {
            id: 3,
            nome: "Bovina",
            icone: <FaHamburger className="text-green-600 text-xl" />,
        },
        {
            id: 4,
            nome: "Vegano",
            icone: <FaCarrot className="text-green-600 text-xl" />,
        },
        {
            id: 5,
            nome: "Peixes",
            icone: <FaFish className="text-green-600 text-xl" />,
        },
    ];

    // Dados dos pratos por categoria
    const pratosPorCategoria = [
        {
            id: 1,
            nome: "Salada Caesar de Frango",
            descricao: "Salada fresca com frango grelhado e molho caesar light",
            categoria: "Aves",
            imagem: "/img/menu1.jpg",
            rating: 4.7,
            calorias: "320 kcal",
            preco: "R$ 34,90",
        },
        {
            id: 2,
            nome: "Bowl de Quinoa com Frango",
            descricao: "Quinoa, frango desfiado, legumes e molho de iogurte",
            categoria: "Aves",
            imagem: "/img/menu2.jpg",
            rating: 4.9,
            calorias: "380 kcal",
            preco: "R$ 39,90",
        },
        {
            id: 3,
            nome: "Filé Mignon com Legumes",
            descricao: "Filé mignon grelhado com mix de legumes na manteiga",
            categoria: "Bovina",
            imagem: "/img/menu3.jpg",
            rating: 4.8,
            calorias: "450 kcal",
            preco: "R$ 54,90",
        },
        {
            id: 4,
            nome: "Hambúrguer Fit de Carne",
            descricao: "Hambúrguer de carne com pão integral e salada",
            categoria: "Bovina",
            imagem: "/img/menu4.jpg",
            rating: 4.6,
            calorias: "420 kcal",
            preco: "R$ 32,90",
        },
        {
            id: 5,
            nome: "Bowl Vegano Proteico",
            descricao: "Mix de grãos, tofu, abacate e vegetais",
            categoria: "Vegano",
            imagem: "/img/img3.jpg",
            rating: 4.7,
            calorias: "340 kcal",
            preco: "R$ 36,90",
        },
        {
            id: 6,
            nome: "Wrap Vegano de Grão-de-Bico",
            descricao: "Tortilla integral com húmus, falafel e vegetais",
            categoria: "Vegano",
            imagem: "/img/img4.jpg",
            rating: 4.5,
            calorias: "310 kcal",
            preco: "R$ 29,90",
        },
        {
            id: 7,
            nome: "Salmão Grelhado",
            descricao: "Filé de salmão grelhado com aspargos e quinoa",
            categoria: "Peixes",
            imagem: "/img/menu1.jpg",
            rating: 4.9,
            calorias: "400 kcal",
            preco: "R$ 59,90",
        },
        {
            id: 8,
            nome: "Poke de Atum",
            descricao: "Bowl de arroz japonês, atum, abacate e vegetais",
            categoria: "Peixes",
            imagem: "/img/menu2.jpg",
            rating: 4.8,
            calorias: "380 kcal",
            preco: "R$ 42,90",
        },
    ];

    // Filtrar pratos pela categoria selecionada
    const pratosFiltrados =
        categoriaSelecionada === "Todos"
            ? pratosPorCategoria
            : pratosPorCategoria.filter(
                  (prato) => prato.categoria === categoriaSelecionada
              );

    // Dados dos benefícios
    const beneficios = [
        {
            id: 1,
            icone: <FaLeaf className="text-green-600 text-3xl" />,
            titulo: "Ingredientes Frescos",
            descricao:
                "Todos os pratos são preparados com ingredientes frescos e selecionados.",
        },
        {
            id: 2,
            icone: <FaAppleAlt className="text-green-600 text-3xl" />,
            titulo: "Nutricionalmente Balanceado",
            descricao:
                "Refeições com equilíbrio perfeito de nutrientes para sua saúde.",
        },
        {
            id: 3,
            icone: <FaRunning className="text-green-600 text-3xl" />,
            titulo: "Ideal para Atletas",
            descricao:
                "Opções ricas em proteínas e com baixo teor de gordura para quem treina.",
        },
        {
            id: 4,
            icone: <FaClock className="text-green-600 text-3xl" />,
            titulo: "Entrega Rápida",
            descricao:
                "Receba sua comida saudável em casa com rapidez e segurança.",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 py-10 lg:py-20">
                <div className="w-full lg:w-1/2 space-y-6 mb-10 lg:mb-0">
                    <div className="flex items-center animate-slidein delay-500">
                        <div className="h-1 w-10 bg-green-500 mr-2"></div>
                        <p className="text-green-600 font-medium">
                            COMIDA SAUDÁVEL • ENTREGA RÁPIDA
                        </p>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-800">
                        {textoDigitado.split("saúde").length > 1 ? (
                            <>
                                {textoDigitado.split("saúde")[0]}
                                <span className="text-green-600 glow">
                                    saúde
                                </span>
                                {textoDigitado.split("saúde")[1]}
                            </>
                        ) : (
                            textoDigitado
                        )}
                    </h1>

                    <p className="text-gray-600 text-lg">
                        Conectamos você aos melhores fornecedores de comida
                        saudável da sua região. Pratos frescos, nutritivos e
                        deliciosos entregues na sua porta.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button title="Explorar Cardápio" primary={true} />
                        <Button title="Saiba Mais" primary={false} />
                    </div>

                    <div className="flex items-center space-x-4 pt-8">
                        <div className="flex -space-x-2">
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic1.png"
                                alt="Usuário"
                            />
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic2.png"
                                alt="Usuário"
                            />
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic3.png"
                                alt="Usuário"
                            />
                        </div>
                        <p className="text-gray-600 text-sm">
                            <span className="font-bold text-green-600">
                                500+ pessoas
                            </span>{" "}
                            pediram hoje
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 relative">
                    <div className="relative z-[1] overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-100 h-[500px] shadow-xl">
                        {/* Elementos decorativos que giram lentamente */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-green-100/30 to-green-200/20 animate-rotate-slow"></div>
                            <div
                                className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-yellow-50/30 to-green-50/20 animate-rotate-slow"
                                style={{
                                    animationDirection: "reverse",
                                    animationDuration: "25s",
                                }}
                            ></div>
                        </div>

                        {/* Padrão pontilhado de fundo */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, rgba(34, 197, 94, 0.1) 1px, transparent 1px)",
                                backgroundSize: "20px 20px",
                                opacity: 0.3,
                            }}
                        ></div>

                        {/* Composição visual de alimentos saudáveis */}
                        <div className="absolute inset-0 flex items-center justify-center p-10">
                            {/* Elementos decorativos de fundo com formas variadas */}
                            <div className="absolute top-20 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-70 animate-pulse-gentle"></div>
                            <div
                                className="absolute bottom-24 right-24 w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-50 to-yellow-100 opacity-60 animate-pulse-gentle"
                                style={{ animationDelay: "1.5s" }}
                            ></div>
                            <div
                                className="absolute top-[30%] right-[25%] w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 opacity-40 animate-float-slow"
                                style={{ animationDelay: "0.5s" }}
                            ></div>

                            {/* Efeito de brilho circulante */}
                            <div className="absolute inset-0 animate-shimmer opacity-50"></div>

                            {/* Prato estilizado com efeito 3D */}
                            <div
                                className="relative w-80 h-80 animate-float"
                                style={{ perspective: "1000px" }}
                            >
                                {/* Sombra do prato */}
                                <div className="absolute top-[90%] inset-x-[10%] h-5 bg-black/10 rounded-full blur-md transform-gpu"></div>

                                {/* Prato com bordas realistas */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-full shadow-lg transform-gpu"
                                    style={{ transform: "rotateX(15deg)" }}
                                ></div>
                                <div
                                    className="absolute inset-2 bg-gradient-to-br from-white to-gray-50 rounded-full border border-gray-100 shadow-inner-light transform-gpu"
                                    style={{ transform: "rotateX(15deg)" }}
                                ></div>
                                <div
                                    className="absolute inset-6 bg-gradient-to-br from-gray-50 to-white rounded-full border-t border-l border-white/50 transform-gpu"
                                    style={{ transform: "rotateX(15deg)" }}
                                ></div>

                                {/* Salada estilizada com aspecto realista */}
                                <div
                                    className="absolute top-10 left-10 right-10 bottom-10 overflow-hidden rounded-full transform-gpu"
                                    style={{ transform: "rotateX(15deg)" }}
                                >
                                    {/* Base de folhas verdes com textura */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200"></div>
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(120deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 100%)",
                                            backgroundSize: "200% 200%",
                                        }}
                                    ></div>

                                    {/* Textura de folhas */}
                                    <div
                                        className="absolute inset-0 opacity-40"
                                        style={{
                                            backgroundImage:
                                                "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S25.523 20 20 20zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm30-15c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S55.523 20 50 20zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm-30 15c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S25.523 50 20 50zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm30-15c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S55.523 50 50 50zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z' fill='%2310B981' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                                            backgroundSize: "80px 80px",
                                        }}
                                    ></div>

                                    {/* Alface/Rúcula com bordas irregulares para mais realismo */}
                                    <div
                                        className="absolute top-3 left-5 w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 animate-float-slow shadow-sm"
                                        style={{
                                            borderRadius:
                                                "50% 60% 45% 55% / 55% 45% 60% 50%",
                                            transform: "rotate(45deg)",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 30% 30%, transparent 0%, transparent 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)",
                                                borderRadius: "inherit",
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute top-8 right-8 w-16 h-10 bg-gradient-to-br from-green-500 to-green-600 animate-pulse-gentle shadow-sm"
                                        style={{
                                            borderRadius:
                                                "60% 40% 55% 45% / 40% 60% 40% 60%",
                                            transform: "rotate(-12deg)",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 70% 20%, transparent 0%, transparent 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)",
                                                borderRadius: "inherit",
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute bottom-7 left-10 w-16 h-10 bg-gradient-to-br from-green-300 to-green-400 animate-float-slow shadow-sm"
                                        style={{
                                            animationDelay: "0.5s",
                                            borderRadius:
                                                "45% 55% 40% 60% / 65% 35% 65% 35%",
                                            transform: "rotate(12deg)",
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 60% 60%, transparent 0%, transparent 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.2) 100%)",
                                                borderRadius: "inherit",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Tomates com detalhes mais realistas */}
                                    <div
                                        className="absolute top-7 left-14 w-10 h-10 animate-pulse-gentle shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "1s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-500"></div>
                                        <div className="absolute inset-[20%] rounded-full bg-gradient-to-tl from-white/30 to-transparent"></div>
                                        <div className="absolute top-0 left-[45%] right-[45%] h-2 bg-green-500 rounded-b-sm"></div>
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 100%)",
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute bottom-8 right-5 w-12 h-12 animate-float-slow shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "0.7s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600"></div>
                                        <div className="absolute inset-[20%] rounded-full bg-gradient-to-tl from-white/30 to-transparent"></div>
                                        <div className="absolute top-0 left-[45%] right-[45%] h-2 bg-green-500 rounded-b-sm"></div>
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 100%)",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Cenoura com textura mais realista */}
                                    <div
                                        className="absolute top-12 right-12 w-4 h-12 animate-float-slow shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "1.5s",
                                            borderRadius:
                                                "30% 30% 45% 45% / 15% 15% 65% 65%",
                                            transform: "rotate(-45deg)",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500"></div>
                                        <div className="absolute inset-x-0 top-0 h-1/5 rounded-t-lg bg-green-500/80"></div>
                                        <div
                                            className="absolute inset-x-[30%] inset-y-[10%] opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(0deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)",
                                            }}
                                        ></div>
                                    </div>
                                    <div
                                        className="absolute bottom-12 left-20 w-4 h-10 animate-pulse-gentle shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "0.3s",
                                            borderRadius:
                                                "30% 30% 45% 45% / 15% 15% 65% 65%",
                                            transform: "rotate(45deg)",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-orange-400 to-orange-500"></div>
                                        <div className="absolute inset-x-0 top-0 h-1/5 rounded-t-lg bg-green-500/80"></div>
                                        <div
                                            className="absolute inset-x-[30%] inset-y-[10%] opacity-30"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(0deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                                            }}
                                        ></div>
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 6px)",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Grão de bico/quinoa/proteína com mais detalhes */}
                                    <div
                                        className="absolute top-16 left-12 w-8 h-8 animate-pulse-gentle shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "1.2s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-300"></div>
                                        <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                                            }}
                                        ></div>
                                        <div className="absolute left-[40%] top-[40%] w-[20%] h-[20%] rounded-full bg-yellow-600/30"></div>
                                    </div>
                                    <div
                                        className="absolute right-12 bottom-12 w-9 h-9 animate-float-slow shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "0.9s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200"></div>
                                        <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                                            }}
                                        ></div>
                                        <div className="absolute left-[45%] top-[45%] w-[15%] h-[15%] rounded-full bg-yellow-600/30"></div>
                                    </div>
                                    <div
                                        className="absolute right-20 top-12 w-6 h-6 animate-float-slow shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "1.8s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-400"></div>
                                        <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-white/40 to-transparent"></div>
                                        <div
                                            className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)",
                                            }}
                                        ></div>
                                        <div className="absolute left-[40%] top-[40%] w-[20%] h-[20%] rounded-full bg-yellow-600/30"></div>
                                    </div>

                                    {/* Azeitonas/Abacate com brilhos de óleo e detalhes */}
                                    <div
                                        className="absolute top-20 right-20 w-7 h-7 animate-pulse-gentle shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "2.1s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-800"></div>
                                        <div className="absolute inset-[30%] top-[20%] w-[40%] h-[25%] rounded-full bg-gradient-to-br from-white/50 to-transparent"></div>
                                        <div
                                            className="absolute inset-0 opacity-70"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)",
                                            }}
                                        ></div>
                                        <div className="absolute inset-x-[20%] inset-y-[20%] w-[15%] h-[15%] bg-green-900/50 rounded-full"></div>
                                    </div>
                                    <div
                                        className="absolute bottom-16 left-6 w-8 h-8 animate-float-slow shadow-sm overflow-hidden"
                                        style={{
                                            animationDelay: "1.4s",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-700"></div>
                                        <div className="absolute inset-[30%] top-[20%] w-[40%] h-[25%] rounded-full bg-gradient-to-br from-white/50 to-transparent"></div>
                                        <div
                                            className="absolute inset-0 opacity-70"
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)",
                                            }}
                                        ></div>
                                        <div className="absolute inset-x-[20%] inset-y-[20%] w-[15%] h-[15%] bg-green-900/50 rounded-full"></div>
                                    </div>

                                    {/* Gotículas de água/óleo espalhadas */}
                                    <div
                                        className="absolute top-[30%] right-[30%] w-2 h-2 rounded-full bg-white/80 animate-pulse-gentle"
                                        style={{ animationDelay: "0.7s" }}
                                    ></div>
                                    <div
                                        className="absolute top-[40%] left-[35%] w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse-gentle"
                                        style={{ animationDelay: "1.3s" }}
                                    ></div>
                                    <div
                                        className="absolute bottom-[35%] right-[25%] w-1 h-1 rounded-full bg-white/60 animate-pulse-gentle"
                                        style={{ animationDelay: "0.5s" }}
                                    ></div>
                                    <div
                                        className="absolute bottom-[20%] left-[40%] w-1 h-1 rounded-full bg-white/50 animate-pulse-gentle"
                                        style={{ animationDelay: "1.7s" }}
                                    ></div>
                                </div>

                                {/* Reflexo no prato */}
                                <div
                                    className="absolute inset-6 rounded-full overflow-hidden opacity-10 transform-gpu"
                                    style={{ transform: "rotateX(20deg)" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent"></div>
                                </div>

                                {/* Brilho na borda do prato */}
                                <div
                                    className="absolute inset-1 rounded-full overflow-hidden opacity-20 transform-gpu"
                                    style={{
                                        transform: "rotateX(20deg)",
                                        background:
                                            "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                                    }}
                                ></div>
                            </div>

                            {/* Textos flutuantes com estilo premium - AJUSTADOS PARA NÃO CORTAR */}
                            <div
                                className="absolute top-[20%] left-16 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg transform -rotate-3 flex items-center animate-float-slow pop-in"
                                style={{ animationDelay: "0.3s" }}
                            >
                                <div className="text-xs font-medium text-green-600 flex items-center">
                                    <div className="w-4 h-4 flex items-center justify-center mr-1.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-inner">
                                        <svg
                                            className="w-2.5 h-2.5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    Rico em fibras
                                </div>
                            </div>

                            <div
                                className="absolute bottom-[30%] right-24 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg transform rotate-2 flex items-center animate-float-slow pop-in"
                                style={{ animationDelay: "0.6s" }}
                            >
                                <div className="text-xs font-medium text-green-600 flex items-center">
                                    <div className="w-4 h-4 flex items-center justify-center mr-1.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-inner">
                                        <svg
                                            className="w-2.5 h-2.5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    Baixa caloria
                                </div>
                            </div>

                            <div
                                className="absolute top-[40%] right-16 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg transform -rotate-6 flex items-center animate-float-slow pop-in"
                                style={{ animationDelay: "0.9s" }}
                            >
                                <div className="text-xs font-medium text-green-600 flex items-center">
                                    <div className="w-4 h-4 flex items-center justify-center mr-1.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-inner">
                                        <svg
                                            className="w-2.5 h-2.5 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    Rico em proteínas
                                </div>
                            </div>

                            {/* Badge premium */}
                            <div
                                className="absolute top-10 right-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center pop-in"
                                style={{ animationDelay: "1.2s" }}
                            >
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                Premium
                            </div>
                        </div>

                        {/* Tag de informação na parte inferior - REPOSICIONADA */}
                        <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl z-10">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg shadow-inner">
                                    <FaLeaf className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-bold">
                                        Saudável & Fresco
                                    </p>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg
                                            className="w-3 h-3 text-green-500 mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        Nutrição de qualidade premium
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Efeito de sombra mais elaborado - AJUSTADO */}
                    <div className="absolute -bottom-3 -right-3 -z-10 bg-gradient-to-br from-green-100 to-green-200 w-full h-full rounded-2xl"></div>
                </div>
            </div>

            {/* Nova Seção - Categorias de Pratos */}
            <div className="py-16 bg-white">
                <div className="lg:px-32 px-5">
                    <div className="text-center mb-12">
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                            CARDÁPIO VARIADO
                        </span>
                        <AnimatedTitle>
                            Escolha o tipo de prato ideal para você
                        </AnimatedTitle>

                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Filtre por categoria e encontre o prato perfeito
                            para sua refeição saudável
                        </p>
                    </div>

                    {/* Filtros de Categorias */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categoriasPratos.map((categoria) => (
                            <button
                                key={categoria.id}
                                className={`flex items-center px-6 py-3 rounded-full transition-all ${
                                    categoriaSelecionada === categoria.nome
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() =>
                                    setCategoriaSelecionada(categoria.nome)
                                }
                            >
                                <span className="mr-2">{categoria.icone}</span>
                                <span className="font-medium">
                                    {categoria.nome}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Grid de Pratos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pratosFiltrados.map((prato) => (
                            <div
                                key={prato.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg h-full flex flex-col"
                            >
                                <div className="h-[180px] overflow-hidden relative">
                                    <img
                                        src={prato.imagem}
                                        alt={prato.nome}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center">
                                        <FaStar className="text-yellow-400 mr-1" />
                                        <span className="text-sm font-bold">
                                            {prato.rating}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-green-500 px-2 py-1 rounded-full">
                                        <span className="text-xs text-white font-medium">
                                            {prato.categoria}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                                        {prato.nome}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 flex-grow">
                                        {prato.descricao}
                                    </p>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                                            <FaLeaf className="text-green-500 text-xs mr-1" />
                                            <span className="text-xs text-gray-700">
                                                {prato.calorias}
                                            </span>
                                        </div>
                                        <span className="font-bold text-green-600">
                                            {prato.preco}
                                        </span>
                                    </div>
                                    <Button
                                        title={
                                            <div className="flex items-center justify-center text-sm w-full">
                                                <FaWhatsapp className="mr-2" />
                                                <span>Pedir agora</span>
                                            </div>
                                        }
                                        primary={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {pratosFiltrados.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">
                                Nenhum prato encontrado nesta categoria.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Benefícios animados */}
            <div className="py-16 bg-white">
                <div className="lg:px-32 px-5">
                    <div className="text-center mb-12">
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                            NOSSOS BENEFÍCIOS
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                            <AnimatedTitle>
                                Por que escolher o LeveFit?
                            </AnimatedTitle>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubra como nossa plataforma pode transformar sua
                            alimentação e melhorar sua qualidade de vida
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {beneficios.map((b) => (
                            <AnimatedBox
                                key={b.id}
                                delay={0} // todos com mesmo delay
                                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    {b.icone}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {b.titulo}
                                </h3>
                                <p className="text-gray-600 flex-grow">
                                    {b.descricao}
                                </p>
                            </AnimatedBox>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carrossel de Restaurantes Parceiros */}
            <div className="py-16 lg:px-32 px-5">
                <div className="text-center mb-8">
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                        RESTAURANTES PARCEIROS
                    </span>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                        <AnimatedBox>Conheça nossos fornecedores</AnimatedBox>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Trabalhamos com os melhores restaurantes especializados
                        em alimentação saudável e nutritiva
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <Slider {...carrosselSettings}>
                        {restaurantes.map((restaurante) => (
                            <div key={restaurante.id} className="h-full p-2">
                                <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
                                    <div className="h-[200px] overflow-hidden relative">
                                        <img
                                            src={restaurante.imagem}
                                            alt={restaurante.nome}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
                                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center">
                                            <FaStar className="text-yellow-400 mr-1" />
                                            <span className="text-sm font-bold">
                                                {restaurante.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {restaurante.nome}
                                        </h3>
                                        <p className="text-gray-600 mb-3 flex-grow">
                                            {restaurante.descricao}
                                        </p>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center">
                                                <FaClock className="text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-500">
                                                    {restaurante.tempo}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                title={
                                                    <div className="flex items-center text-sm">
                                                        <FaWhatsapp className="mr-2" />
                                                        <span>Contatar</span>
                                                    </div>
                                                }
                                                primary={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {/* Como Funciona Section */}
            <div className="py-16 bg-white">
                <div className="lg:px-32 px-5">
                    <div className="text-center mb-16">
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                            COMO FUNCIONA
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                            <AnimatedBox>
                                Simples, rápido e saudável
                            </AnimatedBox>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubra como é fácil começar a comer de forma mais
                            saudável com o LeveFit
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                num: "1",
                                icon: (
                                    <FaUtensils className="text-green-600 text-3xl" />
                                ),
                                title: "Escolha seu Prato",
                                text: "Navegue por nosso catálogo de pratos saudáveis de diversos restaurantes parceiros.",
                            },
                            {
                                num: "2",
                                icon: (
                                    <FaWhatsapp className="text-green-600 text-3xl" />
                                ),
                                title: "Contate o Fornecedor",
                                text: "Entre em contato direto com o restaurante via WhatsApp para fazer seu pedido.",
                            },
                            {
                                num: "3",
                                icon: (
                                    <FaStar className="text-green-600 text-3xl" />
                                ),
                                title: "Receba e Avalie",
                                text: "Receba seu pedido e depois avalie sua experiência para ajudar outros usuários.",
                            },
                        ].map((step) => (
                            <AnimatedBox
                                key={step.num}
                                className="bg-gray-50 p-8 rounded-xl relative mt-10 md:mt-0"
                                // sem delay ou delay fixo, para entrarem juntos
                                delay={0.2}
                            >
                                <div className="absolute -top-6 -left-6 bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {step.num}
                                </div>
                                <div className="text-center pt-6">
                                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600">{step.text}</p>
                                </div>
                            </AnimatedBox>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 lg:py-24 bg-green-50">
                <div className="lg:px-32 px-5">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                                    Quer oferecer seus pratos saudáveis?
                                </h2>
                                <p className="text-gray-600 text-lg mb-8">
                                    Se você é proprietário de um restaurante ou
                                    fornecedor de comida saudável, junte-se à
                                    nossa plataforma e amplie seu alcance.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center">
                                        <div className="bg-green-100 p-1 rounded-full mr-3">
                                            <FaLeaf className="text-green-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            Acesso a clientes que buscam
                                            alimentação saudável
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="bg-green-100 p-1 rounded-full mr-3">
                                            <FaLeaf className="text-green-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            Destaque para seus pratos especiais
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="bg-green-100 p-1 rounded-full mr-3">
                                            <FaLeaf className="text-green-600" />
                                        </div>
                                        <span className="text-gray-700">
                                            Aumento nas vendas através de nossa
                                            plataforma
                                        </span>
                                    </li>
                                </ul>
                                <Button
                                    title="Torne-se um Parceiro"
                                    primary={true}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <img
                                    src="/img/img2.jpg"
                                    alt="Chef preparando comida saudável"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Depoimentos Section - Design Simples e Elegante */}
            <div className="py-16 bg-white">
                <div className="lg:px-32 px-5">
                    <div className="text-center mb-12">
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                            DEPOIMENTOS
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                            O que nossos clientes dizem
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Veja como o LeveFit tem transformado a alimentação e
                            a vida das pessoas
                        </p>
                    </div>

                    {/* Card principal */}
                    <div className="max-w-3xl mx-auto mb-12 bg-green-50 rounded-xl p-8 shadow-sm relative">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img
                                    src="/img/pic1.png"
                                    alt="Ana Silva"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <div className="flex text-yellow-400 mb-2">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>

                                <p className="text-gray-700 text-lg italic mb-4">
                                    "Desde que comecei a pedir pelo LeveFit,
                                    minha alimentação mudou completamente. Em
                                    apenas 3 meses, perdi 5kg e ganhei muito
                                    mais energia para o dia-a-dia. Os pratos são
                                    deliciosos e me ajudaram a manter uma rotina
                                    de alimentação saudável sem sacrifícios!"
                                </p>

                                <div className="font-bold text-gray-900">
                                    Ana Silva
                                </div>
                                <div className="text-green-600 text-sm">
                                    Cliente Premium • Cliente desde março 2022
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-6 text-green-200 text-6xl font-serif opacity-50">
                            "
                        </div>
                    </div>

                    {/* Cards secundários em grid simples */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {[
                            {
                                img: "/img/pic2.png",
                                name: "Carlos Mendes",
                                role: "Atleta Profissional",
                                text: "Como atleta, encontrei na LeveFit o parceiro perfeito para minha nutrição esportiva. As refeições ricas em proteínas me dão a energia que preciso para meus treinos intensos!",
                                since: "janeiro 2023",
                            },
                            {
                                img: "/img/pic3.png",
                                name: "Mariana Costa",
                                role: "Nutricionista",
                                text: "Como nutricionista, sou extremamente exigente com qualidade nutricional. A LeveFit oferece exatamente o que eu recomendo aos meus pacientes!",
                                since: "agosto 2022",
                            },
                        ].map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                                        <img
                                            src={review.img}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div>
                                        <div className="font-bold text-gray-800">
                                            {review.name}
                                        </div>
                                        <div className="text-green-600 text-sm">
                                            {review.role}
                                        </div>
                                        <div className="flex text-yellow-400 text-sm mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 italic mb-4">
                                    "{review.text}"
                                </p>

                                <div className="text-gray-500 text-sm">
                                    Cliente desde: {review.since}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Estatísticas simples */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {[
                                {
                                    icon: (
                                        <FaStar className="text-yellow-400" />
                                    ),
                                    value: "4.9/5.0",
                                    label: "Média de avaliações",
                                },
                                {
                                    icon: (
                                        <FaUtensils className="text-green-600" />
                                    ),
                                    value: "2.500+",
                                    label: "Pedidos mensais",
                                },
                                {
                                    icon: <FaLeaf className="text-green-600" />,
                                    value: "950+",
                                    label: "Clientes ativos",
                                },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="px-6 py-4 text-center"
                                >
                                    <div className="inline-flex items-center justify-center text-xl mb-2">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA simples */}
                    <div className="mt-10 text-center">
                        <button className="px-6 py-3 bg-green-500 text-white font-medium rounded-full shadow-sm hover:bg-green-600 transition-colors">
                            <div className="flex items-center">
                                <FaStar className="mr-2 text-yellow-100" />
                                <span>Compartilhe sua história</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home({ auth }) {
    return (
        <>
            <Navbar auth={auth} />
            <HomeContent />
            <Footer />
        </>
    );
}
