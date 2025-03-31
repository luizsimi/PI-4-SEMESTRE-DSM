import Button from "../layouts/Button";
import { FaLeaf, FaUtensils, FaStar, FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";

const Home = () => {
  // Adicionar estilos CSS customizados para corrigir problemas de corte no carrossel
  useEffect(() => {
    // Adiciona estilos customizados para o slider
    const style = document.createElement("style");
    style.textContent = `
      .slick-slide {
        padding: 0 10px;
      }
      .slick-list {
        margin: 0 -10px;
        padding-bottom: 15px !important;
      }
      .slick-track {
        display: flex !important;
        align-items: stretch !important;
        justify-content: flex-start !important;
      }
      .slick-slide > div {
        height: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
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
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Dados dos restaurantes parceiros
  const restaurantes = [
    {
      id: 1,
      nome: "Saúde no Prato",
      descricao: "Especialistas em pratos veganos e sem glúten",
      imagem: "/src/assets/img/menu1.jpg",
    },
    {
      id: 2,
      nome: "Natureza & Sabor",
      descricao: "Comida orgânica com ingredientes da fazenda",
      imagem: "/src/assets/img/menu2.jpg",
    },
    {
      id: 3,
      nome: "Fit Gourmet",
      descricao: "Pratos balanceados com alto valor proteico",
      imagem: "/src/assets/img/menu3.jpg",
    },
    {
      id: 4,
      nome: "Verde Vida",
      descricao: "Especialistas em saladas e bowls nutritivos",
      imagem: "/src/assets/img/menu4.jpg",
    },
    {
      id: 5,
      nome: "Sabor & Nutrição",
      descricao: "Refeições completas com baixa caloria",
      imagem: "/src/assets/img/img3.jpg",
    },
    {
      id: 6,
      nome: "Energia Natural",
      descricao: "Sucos, smoothies e pratos funcionais",
      imagem: "/src/assets/img/img4.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 py-10 lg:py-20">
        <div className="w-full lg:w-1/2 space-y-6 mb-10 lg:mb-0">
          <div className="flex items-center">
            <div className="h-1 w-10 bg-green-500 mr-2"></div>
            <p className="text-green-600 font-medium">
              COMIDA SAUDÁVEL • ENTREGA RÁPIDA
            </p>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-800">
            Eleve sua <span className="text-green-600">saúde</span> a cada
            mordida
        </h1>

          <p className="text-gray-600 text-lg">
            Conectamos você aos melhores fornecedores de comida saudável da sua
            região. Pratos frescos, nutritivos e deliciosos entregues na sua
            porta.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button title="Explorar Cardápio" primary={true} />
            <Button title="Saiba Mais" primary={false} />
          </div>

          <div className="flex items-center space-x-4 pt-8">
            <div className="flex -space-x-2">
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="/src/assets/img/pic1.png"
                alt="Usuário"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="/src/assets/img/pic2.png"
                alt="Usuário"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                src="/src/assets/img/pic3.png"
                alt="Usuário"
              />
            </div>
            <p className="text-gray-600 text-sm">
              <span className="font-bold text-green-600">500+ pessoas</span>{" "}
              pediram hoje
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="relative z-[1] overflow-hidden rounded-2xl">
            <img
              src="/src/assets/img/img1.jpg"
              alt="Comida Saudável"
              className="w-full h-auto shadow-xl object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaLeaf className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-800 font-bold">Saudável & Fresco</p>
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

      {/* Carrossel de Restaurantes Parceiros */}
      <div className="py-16 lg:px-32 px-5">
        <div className="text-center mb-12">
          <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
            RESTAURANTES PARCEIROS
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
            Conheça nossos fornecedores
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trabalhamos com os melhores restaurantes especializados em
            alimentação saudável e nutritiva
          </p>
        </div>

        <div className="slick-container px-2 mb-8">
          <div className="slick-fix mx-auto max-w-7xl">
            <Slider {...carrosselSettings}>
              {restaurantes.map((restaurante) => (
                <div key={restaurante.id} className="h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transition-all hover:shadow-lg mx-2">
                    <div className="h-[220px] overflow-hidden relative">
                      <img
                        src={restaurante.imagem}
                        alt={restaurante.nome}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
                    </div>
                    <div className="p-5 flex flex-col h-[calc(100%-220px)]">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {restaurante.nome}
                      </h3>
                      <p className="text-gray-600 mb-4 flex-grow">
                        {restaurante.descricao}
                      </p>
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
      </div>

      {/* Como Funciona Section */}
      <div className="py-16 bg-white">
        <div className="lg:px-32 px-5">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
              PROCESSO SIMPLES
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
              Como o LeveFit funciona?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Em apenas 3 passos você pode desfrutar de refeições saudáveis e
              deliciosas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-xl">
                1
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-green-200"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Escolha seu prato
              </h3>
              <p className="text-gray-600">
                Navegue pelo nosso catálogo de pratos saudáveis e escolha o que
                mais te agrada.
              </p>
              <div className="mt-4">
                <FaUtensils className="text-green-500 text-3xl mx-auto" />
              </div>
            </div>

            <div className="text-center relative">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-xl">
                2
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-green-200"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Peça pelo WhatsApp
              </h3>
              <p className="text-gray-600">
                Converse diretamente com o fornecedor e faça seu pedido de forma
                rápida e personalizada.
              </p>
              <div className="mt-4">
                <FaWhatsapp className="text-green-500 text-3xl mx-auto" />
              </div>
            </div>

            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Receba e aproveite
              </h3>
              <p className="text-gray-600">
                Receba seu pedido fresquinho e aproveite uma refeição deliciosa
                e saudável.
              </p>
              <div className="mt-4">
                <FaStar className="text-green-500 text-3xl mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destaque Section */}
      <div className="py-16 lg:px-32 px-5 bg-gradient-to-r from-green-50 to-green-100">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                DESTAQUE
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Descubra o melhor da comida saudável
              </h2>
              <p className="text-gray-600 mb-6">
                Experimente nossos pratos mais populares, preparados com
                ingredientes frescos e técnicas que preservam o sabor e os
                nutrientes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-700">
                    Opções para todos os tipos de dieta
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-700">
                    Informações nutricionais completas
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-700">
                    Avaliações de outros usuários
                  </span>
                </li>
              </ul>
              <Button title="Explorar pratos populares" primary={true} />
            </div>
            <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[initial]">
              <img
                src="/src/assets/img/img2.jpg"
                alt="Comida Saudável"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
