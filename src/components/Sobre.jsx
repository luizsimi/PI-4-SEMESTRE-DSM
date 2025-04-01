import img from "../assets/img/about.png";
import Button from "../layouts/Button";
import { FaLeaf, FaHeartbeat, FaAppleAlt, FaBrain } from "react-icons/fa";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center lg:px-32 px-5 py-20 bg-gray-50">
      <div className="lg:w-1/2 mb-10 lg:mb-0 relative">
        <div className="relative z-10">
          <img
            src={img}
            alt="Comida saudável"
            className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute -bottom-4 -right-4 bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg">
            <span className="font-bold text-lg">100% Nutritivo</span>
          </div>
        </div>
        <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-gradient-to-br from-green-200 to-green-400 rounded-lg opacity-50"></div>
      </div>

      <div className="lg:w-1/2 lg:pl-16 space-y-6">
        <h1 className="font-bold text-4xl text-gray-800 text-center lg:text-start">
          Por que escolher <span className="text-green-600">LeveFit</span>?
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Na LeveFit, acreditamos que alimentação saudável não precisa ser sem
          graça. Nossa missão é fornecer refeições nutritivas e deliciosas que
          apoiam seu estilo de vida ativo e objetivos de saúde, sem comprometer
          o sabor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <FaLeaf className="text-green-600 text-2xl mr-3" />
              <h3 className="font-semibold text-lg text-gray-800">
                Ingredientes Naturais
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Utilizamos apenas ingredientes frescos, orgânicos e de produtores
              locais para garantir qualidade e sustentabilidade.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <FaHeartbeat className="text-green-600 text-2xl mr-3" />
              <h3 className="font-semibold text-lg text-gray-800">
                Saúde em Primeiro Lugar
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Nossas refeições são desenvolvidas por nutricionistas para
              proporcionar o equilíbrio perfeito de nutrientes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <FaAppleAlt className="text-green-600 text-2xl mr-3" />
              <h3 className="font-semibold text-lg text-gray-800">
                Sabor Incomparável
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Nossos chefs são especialistas em criar pratos saborosos que farão
              você esquecer que está comendo saudável.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-3">
              <FaBrain className="text-green-600 text-2xl mr-3" />
              <h3 className="font-semibold text-lg text-gray-800">
                Bem-estar Mental
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Alimentos que nutrem não só o corpo, mas também a mente, ajudando
              a melhorar seu foco e disposição.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-center lg:justify-start">
          <Button title="Conheça nosso Menu" />
        </div>
      </div>
    </div>
  );
};

export default Sobre;
