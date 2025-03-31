import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaHeart,
} from "react-icons/fa";
import about from "../assets/img/about.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-t-3xl mt-8 md:mt-0 shadow-lg">
      <div className="container mx-auto py-12 px-6 md:px-12">
        {/* Efeito de decoração */}
        <div className="absolute opacity-5 right-0 top-0 w-72 h-72 bg-brightColor rounded-full filter blur-3xl"></div>
        <div className="absolute opacity-5 left-0 bottom-0 w-72 h-72 bg-green-400 rounded-full filter blur-3xl"></div>

        {/* Logo e título do site na parte superior */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white mb-3 shadow-lg shadow-white/20">
            <img
              src={about}
              alt="LeveFit"
              className="h-full w-full object-cover"
            />
          </div>
          <h2 className="font-bold text-3xl text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            LeveFit
          </h2>
          <p className="text-white text-center max-w-xl mt-3">
            Eleve o seu lado Fit a cada mordida. Comida saudável e deliciosa
            para transformar seu corpo e sua vida.
          </p>
        </div>

        {/* Seção principal do footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 - Sobre */}
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/15 transition duration-300">
            <h3 className="font-semibold text-xl mb-4 text-white">Sobre Nós</h3>
            <p className="text-white/90 mb-6 text-sm leading-relaxed">
              Somos especialistas em nutrição e gastronomia, dedicados a
              oferecer refeições saudáveis que não comprometem o sabor. Nossa
              missão é ajudar você a atingir seus objetivos de saúde com prazer.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-green-600 transition-all transform hover:scale-110"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-green-600 transition-all transform hover:scale-110"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-green-600 transition-all transform hover:scale-110"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="https://wa.me/551997612200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="bg-white/20 text-white p-2 rounded-full hover:bg-white hover:text-green-600 transition-all transform hover:scale-110"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Coluna 2 - Links */}
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/15 transition duration-300">
            <h3 className="font-semibold text-xl mb-4 text-white">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Início
                </a>
              </li>
              <li>
                <a
                  href="#pratos"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Explore Nosso Menu
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="#review"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Avaliações
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Categorias */}
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/15 transition duration-300">
            <h3 className="font-semibold text-xl mb-4 text-white">
              Categorias
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#pratos"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Carnes
                </a>
              </li>
              <li>
                <a
                  href="#pratos"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Aves
                </a>
              </li>
              <li>
                <a
                  href="#pratos"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Peixes
                </a>
              </li>
              <li>
                <a
                  href="#pratos"
                  className="text-white/90 hover:text-white flex items-center transition-all hover:translate-x-1"
                >
                  <span className="mr-2 text-white">›</span> Vegano
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/15 transition duration-300">
            <h3 className="font-semibold text-xl mb-4 text-white">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <FaMapMarkerAlt className="text-white mt-1 mr-3 min-w-[16px] group-hover:scale-125 transition-transform" />
                <span className="text-white/90 group-hover:text-white transition-colors">
                  Av. Paulista, 1000, São Paulo - SP, Brasil
                </span>
              </li>
              <li className="flex items-center group">
                <FaEnvelope className="text-white mr-3 min-w-[16px] group-hover:scale-125 transition-transform" />
                <a
                  href="mailto:levefit@gmail.com"
                  className="text-white/90 hover:text-white transition-all"
                >
                  levefit@gmail.com
                </a>
              </li>
              <li className="flex items-center group">
                <FaPhoneAlt className="text-white mr-3 min-w-[16px] group-hover:scale-125 transition-transform" />
                <a
                  href="tel:+551997612200"
                  className="text-white/90 hover:text-white transition-all"
                >
                  (19) 99761-2200
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rodapé com copyright */}
      <div className="border-t border-white/20">
        <div className="container mx-auto py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © {currentYear} LeveFit. Todos os direitos reservados.
          </p>
          <p className="text-white/70 text-sm mt-2 md:mt-0 flex items-center justify-center">
            Feito com{" "}
            <FaHeart className="text-red-400 mx-1 animate-pulse" size={14} />{" "}
            por{" "}
            <span className="text-white hover:underline ml-1">Luiz Simi</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
