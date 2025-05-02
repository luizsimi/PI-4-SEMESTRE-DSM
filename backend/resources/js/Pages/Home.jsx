import React, {
    Suspense,
    lazy,
    useEffect,
    useState,
    memo,
    useCallback,
    useRef,
} from "react";
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
import { createPortal } from "react-dom";
// Importações de componentes grandes feitas com lazy loading
const Slider = lazy(() => import("react-slick"));
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomeContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

    // Adicionar estilos CSS customizados para corrigir problemas de corte no carrossel
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsInView(true);
                    preloadImage(optimizedSrc)
                        .then(() => setIsLoaded(true))
                        .catch(() => {
                            // Fallback para a imagem original se a otimizada falhar
                            preloadImage(src).then(() => setIsLoaded(true));
                        });
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
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
        `;
        document.head.appendChild(style);

        // Simula carregamento de dados
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    // Implementando virtualização para mostrar apenas os elementos visíveis na tela
    useEffect(() => {
        // Definir apenas os elementos que precisam ser renderizados
        const handleScroll = () => {
            if (gridRef.current) {
                const rect = gridRef.current.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setVisibleItems(pratosFiltrados.map((p) => p.id));
                }
            }
        };

        // Inicializa com verificação de visibilidade
        handleScroll();

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [gridRef, categoriaSelecionada]);

    // Memoização da função de seleção de categoria para evitar recriações em cada renderização
    const handleCategoriaChange = useCallback((categoria) => {
        setCategoriaSelecionada(categoria);
    }, []);

    // Configurações otimizadas do carrossel - velocidade reduzida para melhor performance
    const carrosselSettings = {
        dots: true,
        infinite: false, // Alterado para false para melhor performance
        speed: 300, // Reduzido para melhorar a performance
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: window.innerWidth > 768, // Autoplay apenas em telas maiores
        autoplaySpeed: 5000, // Aumentado para reduzir a carga
        pauseOnHover: true,
        swipeToSlide: true,
        arrows: window.innerWidth > 768, // Setas apenas em telas maiores
        adaptiveHeight: false,
        centerMode: false,
        draggable: true,
        lazyLoad: "ondemand",
        initialSlide: 0,
        waitForAnimate: false, // Melhora a responsividade
        useCSS: true, // Usa aceleração CSS
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

    // Filtrar pratos pela categoria selecionada - usando useMemo para evitar recálculos desnecessários
    const pratosFiltrados = React.useMemo(() => {
        return categoriaSelecionada === "Todos"
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

    // Dividir componentes grandes em partes para renderização condicional
    const renderHeroSection = useCallback(
        () => (
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
                                <span className="text-green-600 glow">saúde</span>
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
                        <MemoizedButton
                            title="Explorar Cardápio"
                            primary={true}
                        />
                        <MemoizedButton title="Saiba Mais" primary={false} />
                    </div>

                    <div className="flex items-center space-x-4 pt-8">
                        <div className="flex -space-x-2">
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic1.png"
                                alt="Usuário"
                                loading="lazy"
                                width="32"
                                height="32"
                            />
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic2.png"
                                alt="Usuário"
                                loading="lazy"
                                width="32"
                                height="32"
                            />
                            <img
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                src="/img/pic3.png"
                                alt="Usuário"
                                loading="lazy"
                                width="32"
                                height="32"
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
                    <div className="relative z-[1] overflow-hidden rounded-2xl">
                        <img
                            src="/img/img1.jpg"
                            alt="Comida Saudável"
                            className="w-full h-auto shadow-xl object-cover"
                            loading="lazy"
                            width="600"
                            height="400"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <FaLeaf className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-bold">
                                        Saudável & Fresco
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        100% Ingredientes naturais
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 -z-10 bg-green-100 w-full h-full rounded-2xl"></div>
                </div>
            </div>
        ),
        []
    );

    // Usar IntersectionObserver para carregar componentes apenas quando visíveis
    const [categoriaVisible, setCategoriaVisible] = useState(false);
    const [beneficiosVisible, setBeneficiosVisible] = useState(false);
    const [carrosselVisible, setCarrosselVisible] = useState(false);
    const [comoFuncionaVisible, setComoFuncionaVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const [depoimentosVisible, setDepoimentosVisible] = useState(false);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    switch (id) {
                        case "categoria-section":
                            setCategoriaVisible(true);
                            break;
                        case "beneficios-section":
                            setBeneficiosVisible(true);
                            break;
                        case "carrossel-section":
                            setCarrosselVisible(true);
                            break;
                        case "como-funciona-section":
                            setComoFuncionaVisible(true);
                            break;
                        case "cta-section":
                            setCtaVisible(true);
                            break;
                        case "depoimentos-section":
                            setDepoimentosVisible(true);
                            break;
                        default:
                            break;
                    }
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions
        );

        // Observe all sections
        const sections = document.querySelectorAll(".observe-section");
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

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
            {renderHeroSection()}

            {/* Nova Seção - Categorias de Pratos - Com Lazy Loading */}
            <div
                id="categoria-section"
                className="observe-section py-16 bg-white"
            >
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
                                className={`flex items-center px-6 py-3 rounded-full transition-all ${categoriaSelecionada === categoria.nome
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                onClick={() =>
                                    handleCategoriaChange(categoria.nome)
                                }
                            >
                                <span className="mr-2">{categoria.icone}</span>
                                <span className="font-medium">
                                    {categoria.nome}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Grid de Pratos - usando virtual rendering para melhorar a performance */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {pratosFiltrados.map((prato) => renderizarPrato(prato))}
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

            {/* Benefícios */}
            <div className="py-16 bg-white">
                <div className="lg:px-32 px-5">
                    <div className="text-center mb-12">
                        <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                            NOSSOS BENEFÍCIOS
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                            <AnimatedTitle>Por que escolher o LeveFit?</AnimatedTitle>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubra como nossa plataforma pode transformar sua alimentação e melhorar sua qualidade de vida
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {beneficios.map((b) => (
                            <AnimatedBox
                                key={b.id}
                                delay={0}  // todos com mesmo delay
                                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    {b.icone}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{b.titulo}</h3>
                                <p className="text-gray-600 flex-grow">{b.descricao}</p>
                            </AnimatedBox>
                        ))}
                    </div>
                </div>
            </div>

            {/* Carrossel de Restaurantes Parceiros */}
            <div
                id="carrossel-section"
                className="observe-section py-16 lg:px-32 px-5"
            >
                <div className="text-center mb-8">
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                        RESTAURANTES PARCEIROS
                    </span>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                    <AnimatedBox>
                        Conheça nossos fornecedores
                        </AnimatedBox>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Trabalhamos com os melhores restaurantes especializados
                        em alimentação saudável e nutritiva
                    </p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <MemoizedSlider {...carrosselSettings}>
                        {restaurantes.map((restaurante) => (
                            <RestauranteCard
                                key={restaurante.id}
                                restaurante={restaurante}
                            />
                        ))}
                    </MemoizedSlider>
                </div>
            </div>

            {/* Como Funciona Section */}
            <div
                id="como-funciona-section"
                className="observe-section py-16 bg-white"
            >
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
                            Descubra como é fácil começar a comer de forma mais saudável com o LeveFit
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                num: "1",
                                icon: <FaUtensils className="text-green-600 text-3xl" />,
                                title: "Escolha seu Prato",
                                text:
                                    "Navegue por nosso catálogo de pratos saudáveis de diversos restaurantes parceiros."
                            },
                            {
                                num: "2",
                                icon: <FaWhatsapp className="text-green-600 text-3xl" />,
                                title: "Contate o Fornecedor",
                                text:
                                    "Entre em contato direto com o restaurante via WhatsApp para fazer seu pedido."
                            },
                            {
                                num: "3",
                                icon: <FaStar className="text-green-600 text-3xl" />,
                                title: "Receba e Avalie",
                                text:
                                    "Receba seu pedido e depois avalie sua experiência para ajudar outros usuários."
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
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                                    <p className="text-gray-600">{step.text}</p>
                                </div>
                            </AnimatedBox>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div
                id="cta-section"
                className="observe-section py-16 lg:py-24 bg-green-50"
            >
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
                                <MemoizedButton
                                    title="Torne-se um Parceiro"
                                    primary={true}
                                />
                            </div>
                            <div className="hidden lg:block">
                                <img
                                    src="/img/img2.jpg"
                                    alt="Chef preparando comida saudável"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Depoimentos Section - Simplificado */}
            <div
                id="depoimentos-section"
                className="observe-section py-16 lg:px-32 px-5 bg-white"
            >
                <div className="text-center mb-12">
                    <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                        DEPOIMENTOS
                    </span>
                    <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                    <AnimatedBox>
                        O que nossos clientes dizem
                        </AnimatedBox>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Veja as experiências de quem já utiliza o LeveFit para
                        sua alimentação diária
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full flex flex-col">
                        <div className="flex items-center mb-4">
                            <img
                                src="/img/pic1.png"
                                alt="Cliente"
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                loading="lazy"
                            />
                            <div>
                                <h4 className="font-bold text-gray-800">
                                    Ana Silva
                                </h4>
                                <div className="flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 flex-grow">
                            "Desde que comecei a pedir pelo LeveFit, minha
                            alimentação mudou completamente. Os pratos são
                            deliciosos e nutritivos!"
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full flex flex-col">
                        <div className="flex items-center mb-4">
                            <img
                                src="/img/pic2.png"
                                alt="Cliente"
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                loading="lazy"
                            />
                            <div>
                                <h4 className="font-bold text-gray-800">
                                    Carlos Mendes
                                </h4>
                                <div className="flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 flex-grow">
                            "Fantástico! Como atleta, preciso de refeições
                            balanceadas e aqui encontro exatamente o que preciso
                            para meu desempenho."
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm h-full flex flex-col">
                        <div className="flex items-center mb-4">
                            <img
                                src="/img/pic3.png"
                                alt="Cliente"
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                loading="lazy"
                            />
                            <div>
                                <h4 className="font-bold text-gray-800">
                                    Mariana Costa
                                </h4>
                                <div className="flex text-yellow-400">
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 flex-grow">
                            "Adoro a variedade de opções e a facilidade de
                            contato com os restaurantes. A qualidade dos pratos
                            é incrível!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Memoizar o componente pai para evitar renderizações desnecessárias
const MemoizedHomeContent = memo(HomeContent);

export default function Home({ auth }) {
    return (
        <>
            <Navbar auth={auth} />
            <MemoizedHomeContent />
            <Footer />
        </>
    );
}
