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
        backgroundColor: "#10b981",
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meus Pratos</h2>

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
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
          />
        </div>

        <div className="md:w-64">
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
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
        <div className="text-center py-12 bg-green-50 rounded-lg border border-green-100">
          <p className="text-gray-600 font-medium">Nenhum prato encontrado.</p>
          <p className="text-gray-500 text-sm mt-1">
            Tente modificar os filtros ou adicionar novos pratos.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Prato
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Preço
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Calorias
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pratosFiltrados.map((prato) => (
                <tr
                  key={prato.id}
                  className="hover:bg-green-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-20">
                        <img
                          className="h-14 w-20 object-cover rounded shadow-sm"
                          src={prato.imagem}
                          alt={prato.nome}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {prato.nome}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                          {prato.descricao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {getNomeCategoria(prato.categoria)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    R$ {prato.preco.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {prato.informacaoNutricional.calorias} kcal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="p-1.5 bg-blue-50 rounded-md text-blue-600 hover:bg-blue-100 transition-colors">
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        className="p-1.5 bg-red-50 rounded-md text-red-600 hover:bg-red-100 transition-colors"
                        onClick={() => handleExcluir(prato.id)}
                      >
                        <FiTrash2 size={18} />
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
