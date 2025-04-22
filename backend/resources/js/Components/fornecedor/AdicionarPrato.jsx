import React, { useState } from "react";
import { FiUpload, FiSave } from "react-icons/fi";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const AdicionarPrato = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    informacaoNutricional: {
      calorias: "",
      proteinas: "",
      carboidratos: "",
      gorduras: "",
    },
    imagem: null,
  });

  const categorias = [
    { id: "carnes", nome: "Carnes" },
    { id: "aves", nome: "Aves" },
    { id: "peixes", nome: "Peixes" },
    { id: "vegano", nome: "Vegano" },
    { id: "vegetariano", nome: "Vegetariano" },
    { id: "sobremesa", nome: "Sobremesa" },
    { id: "bebida", nome: "Bebida" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
        setFormData({
          ...formData,
          imagem: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      iziToast.success({
        title: "Sucesso!",
        message: "Prato adicionado com sucesso!",
        position: "bottomRight",
        timeout: 4000,
      });

      // Limpar formulário
      setFormData({
        nome: "",
        descricao: "",
        preco: "",
        categoria: "",
        informacaoNutricional: {
          calorias: "",
          proteinas: "",
          carboidratos: "",
          gorduras: "",
        },
        imagem: null,
      });
      setPreviewImagem(null);
    } catch (error) {
      iziToast.error({
        title: "Erro",
        message: "Ocorreu um erro ao adicionar o prato.",
        position: "bottomRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Adicionar Novo Prato
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da esquerda - Upload de imagem */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-72 bg-gray-50 hover:bg-gray-100 transition-colors">
              {previewImagem ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewImagem}
                    alt="Preview"
                    className="w-full h-full object-contain rounded shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImagem(null);
                      setFormData({ ...formData, imagem: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-xs shadow-md hover:bg-red-600 transition-colors"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <>
                  <FiUpload className="text-gray-400 text-4xl mb-2" />
                  <p className="text-gray-500 text-center mb-4">
                    Arraste e solte uma imagem ou clique para selecionar
                  </p>
                  <label className="bg-green-600 text-white py-2.5 px-5 rounded-lg cursor-pointer hover:bg-green-700 transition-colors shadow-md font-medium">
                    Selecionar Imagem
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagemChange}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Coluna da direita - Informações do prato */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nome do Prato *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                placeholder="Ex: Filé de Frango Grelhado"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Descrição *
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                placeholder="Descreva os ingredientes e o preparo do prato"
                required
              ></textarea>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none shadow-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Nutricionais */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">
            Informações Nutricionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-green-50 p-5 rounded-lg border border-green-100">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Calorias (kcal)
              </label>
              <input
                type="number"
                min="0"
                name="informacaoNutricional.calorias"
                value={formData.informacaoNutricional.calorias}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
                placeholder="Ex: 350"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Proteínas (g)
              </label>
              <input
                type="number"
                min="0"
                name="informacaoNutricional.proteinas"
                value={formData.informacaoNutricional.proteinas}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
                placeholder="Ex: 25"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Carboidratos (g)
              </label>
              <input
                type="number"
                min="0"
                name="informacaoNutricional.carboidratos"
                value={formData.informacaoNutricional.carboidratos}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
                placeholder="Ex: 30"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gorduras (g)
              </label>
              <input
                type="number"
                min="0"
                name="informacaoNutricional.gorduras"
                value={formData.informacaoNutricional.gorduras}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none bg-white shadow-sm"
                placeholder="Ex: 10"
              />
            </div>
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <FiSave size={20} />
                Salvar Prato
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarPrato;
