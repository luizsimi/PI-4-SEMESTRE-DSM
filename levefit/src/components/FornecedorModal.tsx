import { FaTimes, FaWhatsapp, FaInfoCircle } from "react-icons/fa";

interface Fornecedor {
  id: number;
  nome: string;
  descricao?: string;
  logo?: string;
  whatsapp?: string;
  telefone?: string;
  contato?: string;
  celular?: string;
  tel?: string;
  [key: string]: unknown; // Melhor usar unknown do que any
}

interface FornecedorModalProps {
  fornecedor: Fornecedor | null;
  onClose: () => void;
}

const FornecedorModal = ({ fornecedor, onClose }: FornecedorModalProps) => {
  if (!fornecedor) return null;

  // Criar link do WhatsApp com número fixo
  const criarLinkWhatsApp = () => {
    let numero = "";

    // Se o fornecedor tem WhatsApp, use-o
    if (
      fornecedor.whatsapp &&
      typeof fornecedor.whatsapp === "string" &&
      fornecedor.whatsapp.trim() !== ""
    ) {
      numero = fornecedor.whatsapp.replace(/\D/g, "");
      console.log("Usando WhatsApp do fornecedor:", numero);
    } else {
      // Fallback para um número central (substitua por um número real)
      numero = "5511999999999";
      console.log("Usando número de fallback");
    }

    const mensagem = encodeURIComponent(
      `Olá! Estou interessado nos produtos de ${fornecedor.nome}. Gostaria de mais informações.`
    );
    return `https://wa.me/${numero}?text=${mensagem}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn my-auto"
        onClick={(e) => e.stopPropagation()} // Impede que o clique seja propagado para o fundo
      >
        {/* Cabeçalho do modal com título e botão de fechar */}
        <div className="sticky top-0 z-10 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
              <FaInfoCircle />
            </span>
            Detalhes do Fornecedor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Banner do fornecedor */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6 border border-green-100 dark:border-green-800/30 relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-200/50 dark:bg-green-900/20 rounded-full"></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full"></div>

            <div className="flex flex-col items-center relative z-10">
              {/* Logo ou avatar */}
              <div className="mb-4 relative">
                {fornecedor?.logo ? (
                  <img
                    src={fornecedor.logo}
                    alt={fornecedor.nome}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    onError={(e) => {
                      // Fallback para avatar com inicial se a imagem falhar
                      e.currentTarget.onerror = null;
                      const nome = fornecedor.nome;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        nome
                      )}&background=2F855A&color=fff&size=200`;
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white dark:border-gray-700">
                    {fornecedor?.nome.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Badge verificado */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>

              {/* Nome do fornecedor */}
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {fornecedor.nome}
              </h3>

              {/* Tag de parceiro */}
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-200 dark:border-green-800/40 mb-2">
                Parceiro Oficial
              </span>
            </div>
          </div>

          {/* Seção de descrição */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center border-b pb-2 border-gray-100 dark:border-gray-700">
              <FaInfoCircle className="mr-2 text-green-600 dark:text-green-400" />{" "}
              Sobre o Fornecedor
            </h4>

            {fornecedor.descricao ? (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {fornecedor.descricao}
              </p>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-inner">
                <p className="text-gray-500 dark:text-gray-400 italic text-center text-sm">
                  Este fornecedor ainda não adicionou uma descrição.
                </p>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={criarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-grow items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-300 shadow-md font-medium"
            >
              <FaWhatsapp className="mr-2 text-lg" /> Contatar via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="flex flex-grow items-center justify-center px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorModal;
