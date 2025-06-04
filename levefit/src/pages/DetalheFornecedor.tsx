import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
// import Navbar from "../components/Navbar"; // Comentado
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";

// URLs de fallback para imagens
const DEFAULT_FORNECEDOR_IMAGE =
  "https://via.placeholder.com/128/2F855A/FFFFFF?text=F";
const DEFAULT_PRATO_IMAGE =
  "https://via.placeholder.com/300x200/E2E8F0/1A202C?text=Sem+Imagem";

interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
  endereco?: string;
  whatsapp: string;
  email: string;
  status: boolean;
  assinaturaAtiva: boolean;
}

interface Prato {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria: string;
  mediaAvaliacao: number;
  totalAvaliacoes: number;
}

const DetalheFornecedor = () => {
  const { id } = useParams<{ id: string }>();
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null);
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handler para erros de imagem do fornecedor
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src = DEFAULT_FORNECEDOR_IMAGE;
  };

  // Handler para erros de imagem do prato
  const handlePratoImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.onerror = null; // Evita loop infinito
    e.currentTarget.src = DEFAULT_PRATO_IMAGE;
  };

  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3333/fornecedores/${id}`
        );
        setFornecedor(response.data);

        // Buscar pratos do fornecedor
        const pratosResponse = await axios.get(
          `http://localhost:3333/pratos?fornecedorId=${id}`
        );
        setPratos(pratosResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do fornecedor:", error);
        setError("Não foi possível carregar os dados do fornecedor.");
        setLoading(false);
      }
    };

    fetchFornecedor();
  }, [id]);

  // Renderizar estrelas de avaliação
  const renderEstrelas = (media: number) => {
    const estrelas = [];
    const notaArredondada = Math.round(media);

    for (let i = 1; i <= 5; i++) {
      if (i <= notaArredondada) {
        estrelas.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        estrelas.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{estrelas}</div>;
  };

  // Formatar número de WhatsApp
  const formatWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return "";
    return whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Link do WhatsApp
  const getWhatsAppLink = (whatsapp: string, message: string = "") => {
    const numero = whatsapp.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      message || "Olá, gostaria de saber mais sobre seus pratos"
    );
    return `https://wa.me/${numero}?text=${mensagem}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !fornecedor) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error || "Fornecedor não encontrado"}</p>
            <Link
              to="/"
              className="mt-4 inline-block text-red-700 font-medium hover:underline"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* <Navbar /> */}
      <main className="container mx-auto px-4 py-8">
        {/* Botão voltar */}
        <Link
          to="/fornecedores"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Voltar para fornecedores
        </Link>

        {/* Header do fornecedor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 flex-shrink-0">
              {fornecedor.logo ? (
                <img
                  src={fornecedor.logo}
                  alt={fornecedor.nome}
                  className="w-full h-full rounded-full object-cover border-4 border-green-100 dark:border-green-800"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                    {fornecedor.nome.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {fornecedor.nome}
              </h1>

              {fornecedor.descricao && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {fornecedor.descricao}
                </p>
              )}

              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 justify-center md:justify-start">
                {fornecedor.endereco && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Endereço:</span>{" "}
                    {fornecedor.endereco}
                  </p>
                )}

                {fornecedor.whatsapp && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">WhatsApp:</span>{" "}
                    {formatWhatsApp(fornecedor.whatsapp)}
                  </p>
                )}
              </div>
            </div>

            {fornecedor.whatsapp && (
              <div className="mt-4 md:mt-0">
                <a
                  href={getWhatsAppLink(fornecedor.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Contatar via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Pratos do fornecedor */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Cardápio
          </h2>

          {pratos.length === 0 ? (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700/50 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded">
              Este fornecedor ainda não tem pratos cadastrados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pratos.map((prato) => (
                <div
                  key={prato.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                    {prato.imagem ? (
                      <img
                        src={prato.imagem}
                        alt={prato.nome}
                        className="w-full h-full object-cover"
                        onError={handlePratoImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-100 dark:bg-green-900/20">
                        <span className="text-4xl">🍲</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                      {prato.categoria}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {prato.nome}
                      </h3>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        R$ {prato.preco.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="flex items-center mb-2">
                      {renderEstrelas(prato.mediaAvaliacao)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        ({prato.totalAvaliacoes}{" "}
                        {prato.totalAvaliacoes === 1
                          ? "avaliação"
                          : "avaliações"}
                        )
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {prato.descricao.length > 100
                        ? `${prato.descricao.substring(0, 100)}...`
                        : prato.descricao}
                    </p>

                    <div className="flex justify-between mt-4">
                      <Link
                        to={`/pratos/${prato.id}`}
                        className="text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
                      >
                        Ver detalhes
                      </Link>

                      <a
                        href={getWhatsAppLink(
                          fornecedor.whatsapp,
                          `Olá, gostaria de encomendar o prato "${prato.nome}"`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        Pedir
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DetalheFornecedor;
