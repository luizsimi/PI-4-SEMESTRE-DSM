import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";

const AvaliacoesPratos = () => {
  const [busca, setBusca] = useState("");
  const [filtroEstrelas, setFiltroEstrelas] = useState(0);
  const [pratoDaAvaliacao, setPratoDaAvaliacao] = useState("");

  // Dados mockados para simulação (em produção, viriam da API)
  const avaliacoes = [
    {
      id: 1,
      pratoId: 1,
      pratoNome: "Filé de Frango com Ervas",
      pratoImagem: "https://via.placeholder.com/100x70",
      cliente: "João Silva",
      data: "05/04/2025",
      estrelas: 5,
      comentario:
        "Delicioso! O frango estava perfeitamente temperado e muito suculento.",
      respondido: false,
    },
    {
      id: 2,
      pratoId: 1,
      pratoNome: "Filé de Frango com Ervas",
      pratoImagem: "https://via.placeholder.com/100x70",
      cliente: "Maria Santos",
      data: "02/04/2025",
      estrelas: 4,
      comentario: "Muito bom, mas poderia ter mais ervas no tempero.",
      respondido: true,
      resposta:
        "Olá Maria, obrigado pelo feedback! Vamos considerar adicionar mais ervas no preparo.",
    },
    {
      id: 3,
      pratoId: 2,
      pratoNome: "Salada Caesar com Camarão",
      pratoImagem: "https://via.placeholder.com/100x70",
      cliente: "Pedro Oliveira",
      data: "04/04/2025",
      estrelas: 5,
      comentario: "Os camarões estavam ótimos e a salada muito fresca!",
      respondido: false,
    },
    {
      id: 4,
      pratoId: 3,
      pratoNome: "Bowl Vegetariano",
      pratoImagem: "https://via.placeholder.com/100x70",
      cliente: "Ana Rodrigues",
      data: "03/04/2025",
      estrelas: 3,
      comentario:
        "Os ingredientes estavam frescos, mas achei um pouco sem sal.",
      respondido: true,
      resposta: "Olá Ana, agradecemos o feedback! Vamos ajustar o tempero.",
    },
    {
      id: 5,
      pratoId: 2,
      pratoNome: "Salada Caesar com Camarão",
      pratoImagem: "https://via.placeholder.com/100x70",
      cliente: "Carlos Mendes",
      data: "01/04/2025",
      estrelas: 4,
      comentario: "Muito boa combinação de sabores. Recomendo!",
      respondido: false,
    },
  ];

  // Lista de pratos disponíveis para filtro
  const pratos = [
    { id: 1, nome: "Filé de Frango com Ervas" },
    { id: 2, nome: "Salada Caesar com Camarão" },
    { id: 3, nome: "Bowl Vegetariano" },
  ];

  // Filtrar avaliações com base nos critérios
  const avaliacoesFiltradas = avaliacoes.filter((avaliacao) => {
    const matchBusca =
      busca === "" ||
      avaliacao.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      avaliacao.comentario.toLowerCase().includes(busca.toLowerCase()) ||
      avaliacao.pratoNome.toLowerCase().includes(busca.toLowerCase());

    const matchEstrelas =
      filtroEstrelas === 0 || avaliacao.estrelas === filtroEstrelas;

    const matchPrato =
      pratoDaAvaliacao === "" ||
      avaliacao.pratoId === parseInt(pratoDaAvaliacao);

    return matchBusca && matchEstrelas && matchPrato;
  });

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const total = avaliacoes.length;
    const mediaEstrelas =
      avaliacoes.reduce((acc, curr) => acc + curr.estrelas, 0) / total;
    const porCategoria = avaliacoes.reduce((acc, curr) => {
      acc[curr.pratoId] = (acc[curr.pratoId] || 0) + 1;
      return acc;
    }, {});

    const estrelas = [0, 0, 0, 0, 0];
    avaliacoes.forEach((a) => {
      estrelas[a.estrelas - 1]++;
    });

    return {
      total,
      mediaEstrelas: mediaEstrelas.toFixed(1),
      porCategoria,
      estrelas,
      naoRespondidas: avaliacoes.filter((a) => !a.respondido).length,
    };
  };

  const estatisticas = calcularEstatisticas();

  // Renderizar estrelas
  const renderEstrelas = (quantidade) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < quantidade ? (
          <FaStar className="text-yellow-400" />
        ) : (
          <FaRegStar className="text-gray-300" />
        )}
      </span>
    ));
  };

  // Renderizar gráfico de barras para distribuição de estrelas
  const renderBarraEstrelas = (quantidade, total) => {
    const porcentagem = total > 0 ? (quantidade / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-yellow-400 h-2.5 rounded-full"
            style={{ width: `${porcentagem}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 w-8">{quantidade}</span>
      </div>
    );
  };

  const responderAvaliacao = (id) => {
    // Em uma aplicação real, aqui abriria um modal ou formulário para responder
    alert(`Responder à avaliação ${id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Avaliações de Pratos
      </h2>

      {/* Resumo estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Média geral</h3>
            <span className="text-3xl font-bold text-green-600">
              {estatisticas.mediaEstrelas}
            </span>
          </div>
          <div className="flex mt-2">
            {renderEstrelas(Math.round(parseFloat(estatisticas.mediaEstrelas)))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Baseado em {estatisticas.total} avaliações
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-2">Distribuição</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-24">
                  <span className="text-xs text-gray-700">{num}</span>
                  <FaStar className="text-yellow-400 text-xs" />
                </div>
                {renderBarraEstrelas(
                  estatisticas.estrelas[num - 1],
                  estatisticas.total
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-2">
            Pendentes de resposta
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-orange-500">
              {estatisticas.naoRespondidas}
            </span>
            <span className="text-sm text-gray-500">
              avaliações sem resposta
            </span>
          </div>
          <button className="mt-3 text-sm text-blue-600 hover:underline">
            Ver somente não respondidas
          </button>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, comentário ou prato..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
          />
        </div>

        <div className="md:w-64">
          <select
            value={pratoDaAvaliacao}
            onChange={(e) => setPratoDaAvaliacao(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
          >
            <option value="">Todos os pratos</option>
            {pratos.map((prato) => (
              <option key={prato.id} value={prato.id}>
                {prato.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="md:w-48">
          <select
            value={filtroEstrelas}
            onChange={(e) => setFiltroEstrelas(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
          >
            <option value="0">Todas as estrelas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="2">2 estrelas</option>
            <option value="1">1 estrela</option>
          </select>
        </div>
      </div>

      {/* Lista de avaliações */}
      {avaliacoesFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded-lg border border-green-100">
          <p className="text-gray-600 font-medium">
            Nenhuma avaliação encontrada.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Tente modificar os filtros ou espere por novas avaliações.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {avaliacoesFiltradas.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={avaliacao.pratoImagem}
                    alt={avaliacao.pratoNome}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {avaliacao.cliente}
                      </h3>
                      <p className="text-sm text-gray-500">{avaliacao.data}</p>
                    </div>
                    <div className="flex">
                      {renderEstrelas(avaliacao.estrelas)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-2">
                    {avaliacao.comentario}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600">
                      Prato: {avaliacao.pratoNome}
                    </span>

                    {!avaliacao.respondido && (
                      <button
                        onClick={() => responderAvaliacao(avaliacao.id)}
                        className="text-sm px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-full transition-colors"
                      >
                        Responder
                      </button>
                    )}
                  </div>

                  {avaliacao.respondido && (
                    <div className="mt-3 pl-4 border-l-2 border-green-300 py-2">
                      <p className="text-xs font-medium text-gray-700">
                        Sua resposta:
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {avaliacao.resposta}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvaliacoesPratos;
