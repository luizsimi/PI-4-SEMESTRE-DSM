import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const MeusPratos = () => {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  // Dados mockados para simulação (em produção, viriam da API)
  const [pratos, setPratos] = useState([
    {
      id: 1,
      nome: "Filé de Frango com Ervas",
      descricao:
        "Peito de frango grelhado com mix de ervas frescas, acompanha salada e batata doce.",
      preco: 32.9,
      categoria: "aves",
      informacaoNutricional: {
        calorias: 320,
        proteinas: 28,
        carboidratos: 18,
        gorduras: 12,
      },
      imagem: "https://via.placeholder.com/200x150",
    },
    {
      id: 2,
      nome: "Salada Caesar com Camarão",
      descricao:
        "Mix de folhas verdes, croutons, parmesão e camarões grelhados ao molho caesar.",
      preco: 38.9,
      categoria: "peixes",
      informacaoNutricional: {
        calorias: 280,
        proteinas: 22,
        carboidratos: 15,
        gorduras: 18,
      },
      imagem: "https://via.placeholder.com/200x150",
    },
    {
      id: 3,
      nome: "Bowl Vegetariano",
      descricao:
        "Bowl com arroz integral, grão de bico, legumes assados, abacate e molho tahine.",
      preco: 28.9,
      categoria: "vegetariano",
      informacaoNutricional: {
        calorias: 420,
        proteinas: 15,
        carboidratos: 60,
        gorduras: 18,
      },
      imagem: "https://via.placeholder.com/200x150",
    },
  ]);

  const categorias = [
    { id: "carnes", nome: "Carnes" },
    { id: "aves", nome: "Aves" },
    { id: "peixes", nome: "Peixes" },
    { id: "vegano", nome: "Vegano" },
    { id: "vegetariano", nome: "Vegetariano" },
    { id: "sobremesa", nome: "Sobremesa" },
    { id: "bebida", nome: "Bebida" },
  ];

  const getNomeCategoria = (id) => {
    const categoria = categorias.find((cat) => cat.id === id);
    return categoria ? categoria.nome : "Sem categoria";
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este prato?")) {
      // Simulação de exclusão
      setPratos(pratos.filter((prato) => prato.id !== id));

      iziToast.success({
        title: "Sucesso!",
        message: "Prato excluído com sucesso!",
        position: "bottomRight",
        timeout: 4000,
      });
    }
  };

  const pratosLimpar = () => {
    if (busca.trim() === "" && categoriaSelecionada === "") {
      return pratos;
    }

    return pratos.filter((prato) => {
      const matchBusca =
        busca.trim() === "" ||
        prato.nome.toLowerCase().includes(busca.toLowerCase()) ||
        prato.descricao.toLowerCase().includes(busca.toLowerCase());

      const matchCategoria =
        categoriaSelecionada === "" || prato.categoria === categoriaSelecionada;

      return matchBusca && matchCategoria;
    });
  };

  const pratosFiltrados = pratosLimpar();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Meus Pratos</h2>

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar prato..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none"
          />
        </div>

        <div className="md:w-64">
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brightColor focus:border-brightColor outline-none"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de pratos */}
      {pratosFiltrados.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum prato encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prato
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Preço
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Calorias
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pratosFiltrados.map((prato) => (
                <tr key={prato.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-16">
                        <img
                          className="h-12 w-16 object-cover rounded"
                          src={prato.imagem}
                          alt={prato.nome}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {prato.nome}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {prato.descricao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {getNomeCategoria(prato.categoria)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {prato.preco.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {prato.informacaoNutricional.calorias} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEdit2 />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleExcluir(prato.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MeusPratos;
