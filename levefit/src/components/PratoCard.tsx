import { Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaArrowRight,
  FaFire,
  FaCartPlus,
  FaLock,
} from "react-icons/fa";
import { BiDumbbell } from "react-icons/bi";
import { IoNutrition } from "react-icons/io5";
import { GiSlicedBread } from "react-icons/gi";
import {
  useCarrinho,
  type PratoParaCarrinho,
} from "../contexts/CarrinhoContext";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

interface PratoCardPassedProps {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
  fornecedor: {
    id: number;
    nome: string;
    whatsapp: string;
    logo?: string;
  };
  calorias?: number;
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
  fibras?: number;
  porcao?: string;
  emPromocao?: boolean;
  dataFimPromocao?: string;
  precoOriginal?: number;
}

interface PratoCardComponentProps extends PratoCardPassedProps {
  onAbrirTipoPedidoModal?: (prato: PratoCardPassedProps) => void;
}

// Array de URLs de imagens padrão para diferentes categorias de pratos
const defaultImages = {
  Saladas:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format",
  Vegano:
    "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=500&auto=format",
  Vegetariano:
    "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=500&auto=format",
  Proteico:
    "https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=500&auto=format",
  "Low Carb":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=500&auto=format",
  Fit: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=500&auto=format",
  Bowls:
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?q=80&w=500&auto=format",
  Sopas:
    "https://images.unsplash.com/photo-1605891094836-99210404c080?q=80&w=500&auto=format",
  "Café da Manhã":
    "https://images.unsplash.com/photo-1533089860892-a7c6f10a081a?q=80&w=500&auto=format",
  default:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format",
};

// Função para obter uma imagem padrão com base na categoria
const getDefaultImage = (categoria: string) => {
  return (
    defaultImages[categoria as keyof typeof defaultImages] ||
    defaultImages.default
  );
};

const PratoCard: React.FC<PratoCardComponentProps> = (props) => {
  const {
    id,
    nome,
    descricao,
    preco,
    imagem,
    categoria,
    mediaAvaliacao,
    totalAvaliacoes,
    fornecedor,
    calorias,
    proteinas,
    carboidratos,
    gorduras,
    porcao,
    emPromocao,
    precoOriginal,
  } = props;

  const { adicionarAoCarrinho } = useCarrinho();
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  const descricaoResumida =
    descricao.length > 80 ? `${descricao.substring(0, 80)}...` : descricao;

  // Função para lidar com erro ao carregar imagem
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem do prato, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src = getDefaultImage(categoria); // Usa uma imagem padrão da categoria
  };

  // Função para lidar com erro ao carregar imagem do fornecedor
  const handleFornecedorImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("Erro ao carregar imagem do fornecedor, usando fallback");
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(fornecedor.nome) +
      "&background=2F855A&color=fff"; // Avatar gerado
  };

  // Renderizar as estrelas de avaliação
  const renderEstrelas = () => {
    const estrelas = [];
    const notaArredondada = Math.round(mediaAvaliacao);

    for (let i = 1; i <= 5; i++) {
      if (i <= notaArredondada) {
        estrelas.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else {
        estrelas.push(
          <FaRegStar key={i} className="text-yellow-400 text-xs" />
        );
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{estrelas}</div>
        <span className="text-[10px] text-gray-300 dark:text-gray-300">
          ({totalAvaliacoes}{" "}
          {totalAvaliacoes === 1 ? "avaliação" : "avaliações"})
        </span>
      </div>
    );
  };

  // Renderizar informações nutricionais se disponíveis
  const renderInformacoesNutricionais = () => {
    // Se não houver nenhuma informação nutricional, não renderizar a seção
    if (!calorias && !proteinas && !carboidratos && !gorduras) {
      return null;
    }

    return (
      <div className="mt-2 mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
            Informações Nutricionais {porcao && `(${porcao})`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {calorias && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <FaFire className="text-orange-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {calorias}
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                kcal
              </span>
            </div>
          )}

          {proteinas && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <BiDumbbell className="text-blue-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {proteinas}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                prot
              </span>
            </div>
          )}

          {carboidratos && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <GiSlicedBread className="text-yellow-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {carboidratos}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                carbs
              </span>
            </div>
          )}

          {gorduras && (
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded p-0.5">
              <div className="flex items-center">
                <IoNutrition className="text-purple-500 mr-0.5 text-[8px]" />
                <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                  {gorduras}g
                </span>
              </div>
              <span className="text-[8px] text-gray-500 dark:text-gray-400">
                gord
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleFazerPedido = () => {
    if (!isAuthenticated || userType !== "cliente") {
      toast.info("Faça login como cliente para fazer pedidos!", {
        icon: <FaLock />,
        position: "top-center",
      });
      navigate("/login");
      return;
    }

    const pratoParaAdicionar: PratoParaCarrinho = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      imagem: props.imagem,
      fornecedor: {
        id: props.fornecedor.id,
        nome: props.fornecedor.nome,
      },
    };

    const foiAdicionado = adicionarAoCarrinho(pratoParaAdicionar, 1);
    if (foiAdicionado) {
      toast.success(`${props.nome} adicionado ao carrinho!`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 group h-[420px] flex flex-col">
      <div className="relative h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        {imagem ? (
          <img
            src={imagem}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getDefaultImage(categoria)}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = defaultImages.default;
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold tracking-wide shadow-md">
          {categoria}
        </div>
      </div>

      <div className="p-3 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight leading-tight mb-1 line-clamp-1">
            {nome}
          </h3>

          <div className="mb-1">{renderEstrelas()}</div>

          <p className="text-gray-600 dark:text-gray-300 mb-2 text-xs line-clamp-2">
            {descricaoResumida}
          </p>

          {renderInformacoesNutricionais()}

          <div className="flex justify-between items-center mb-2">
            {emPromocao && precoOriginal ? (
              <div className="flex flex-col">
                <span className="line-through text-gray-400 dark:text-gray-500 text-xs">
                  R$ {precoOriginal.toFixed(2).replace(".", ",")}
                </span>
                <span className="font-bold text-green-600 dark:text-green-400 text-base">
                  R$ {preco.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ) : (
              <span className="font-bold text-green-600 dark:text-green-400 text-base">
                R$ {preco.toFixed(2).replace(".", ",")}
              </span>
            )}

            <div className="text-right text-[10px] bg-green-500 text-white px-2 py-1 rounded-full font-medium">
              {categoria}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden mr-2 flex-shrink-0">
              {fornecedor.logo ? (
                <img
                  src={fornecedor.logo}
                  alt={fornecedor.nome}
                  className="w-full h-full object-cover"
                  onError={handleFornecedorImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold text-xs">
                  {fornecedor.nome.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {fornecedor.nome}
            </span>
          </div>

          <div className="flex mt-2 space-x-2">
            <Link
              to={`/pratos/${id}`}
              className="flex-1 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-500 font-medium text-xs py-2 rounded-lg text-center hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 flex items-center justify-center"
            >
              Detalhes <FaArrowRight className="ml-1 text-xs" />
            </Link>
            <button
              onClick={handleFazerPedido}
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-medium text-xs py-2 rounded-lg text-center transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              Fazer Pedido <FaCartPlus className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PratoCard;
