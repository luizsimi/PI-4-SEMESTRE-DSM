import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../contexts/CarrinhoContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaCreditCard, FaSpinner } from 'react-icons/fa';
// import Navbar from '../components/Navbar'; // Será gerenciado pelo GlobalLayout
// import Footer from '../components/Footer'; // Será gerenciado pelo GlobalLayout

const CarrinhoPage = () => {
  const { 
    itens, 
    removerDoCarrinho, 
    atualizarQuantidadeNoCarrinho, 
    limparCarrinho, 
    obterTotalItensCarrinho, 
    obterValorTotalCarrinho,
    fornecedorInfoAtual 
  } = useCarrinho();
  const { isAuthenticated, userData, userType } = useAuth();
  const navigate = useNavigate();
  const [isLoadingPedido, setIsLoadingPedido] = useState(false);

  const handleIncrementar = (pratoId: number) => {
    const item = itens.find(i => i.prato.id === pratoId);
    if (item) {
      atualizarQuantidadeNoCarrinho(pratoId, item.quantidade + 1);
    }
  };

  const handleDecrementar = (pratoId: number) => {
    const item = itens.find(i => i.prato.id === pratoId);
    if (item && item.quantidade > 1) {
      atualizarQuantidadeNoCarrinho(pratoId, item.quantidade - 1);
    } else if (item && item.quantidade === 1) {
      // Poderia mostrar uma confirmação antes de remover, mas por simplicidade remove direto
      removerDoCarrinho(pratoId);
    }
  };

  const handleFinalizarPedido = async () => {
    if (!isAuthenticated || userType !== 'cliente') {
      toast.error('Por favor, faça login como cliente para finalizar o pedido.');
      navigate('/login', { state: { from: '/carrinho' } }); // Redireciona para login e depois volta
      return;
    }

    if (!fornecedorInfoAtual) {
      toast.error('Erro ao identificar o fornecedor. Por favor, tente novamente.');
      return;
    }

    if (!userData) {
        toast.error('Não foi possível obter os dados do usuário. Por favor, tente fazer login novamente.');
        return;
    }
    
    // Verificar se todos os campos de endereço existem
    const enderecoCompleto = userData.rua && userData.numero && userData.bairro && userData.cidade && userData.estado && userData.cep;
    if (!enderecoCompleto) {
        toast.info('Por favor, complete seu endereço no perfil antes de finalizar o pedido.');
        navigate('/perfil-cliente'); // Supondo que /perfil-cliente é a rota para editar o perfil do cliente
        return;
    }


    setIsLoadingPedido(true);
    try {
      // Montar um único payload para o pedido consolidado
      const dadosPedidoConsolidado = {
        fornecedorId: fornecedorInfoAtual.id,
        nomeCliente: userData.nome,
        contatoCliente: userData.telefone,
        tipoEntrega: 'ENTREGA',
        enderecoEntrega: [
          userData.rua,
          userData.numero,
          userData.complemento,
          userData.bairro,
          userData.cidade,
          userData.estado,
          userData.cep,
        ].filter(Boolean).join(', '),
        // observacoes: "", // Adicionar se houver um campo de observações no carrinho/state
        pratos: itens.map(item => ({
          pratoId: item.prato.id,
          quantidade: item.quantidade,
          // O backend deve buscar o preço atual do prato para calcular o valor_total no momento da criação do pedido
        })),
      };

      // Enviar uma única requisição para o backend
      await axios.post('/pedidos', dadosPedidoConsolidado); // Usando o mesmo endpoint /pedidos por enquanto

      toast.success('Pedido enviado com sucesso!');
      limparCarrinho();
      navigate('/meus-pedidos');

    } catch (error) {
      console.error('Erro ao finalizar pedido:', error); // Mudado de 'pedidos' para 'pedido'
      if (axios.isAxiosError(error) && error.response) {
        const msg = error.response.data?.message || 'Ocorreu um erro ao processar seu pedido.'; // Mudado de 'pedidos' para 'pedido'
        toast.error(msg);
      } else {
        toast.error('Ocorreu um erro desconhecido ao processar seu pedido. Tente novamente mais tarde.'); // Mudado de 'pedidos' para 'pedido'
      }
    } finally {
      setIsLoadingPedido(false);
    }
  };

  if (itens.length === 0 && !isLoadingPedido) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 flex flex-col items-center justify-center text-center px-4">
          <FaShoppingCart className="text-6xl text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Seu carrinho está vazio</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Que tal adicionar alguns pratos deliciosos?
          </p>
          <Link
            to="/fornecedores"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Ver cardápios
          </Link>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate(-1)} 
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center mr-4"
              aria-label="Voltar"
              disabled={isLoadingPedido}
            >
              <FaArrowLeft size={20} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              Meu Carrinho
            </h1>
            {fornecedorInfoAtual && (
              <span className="ml-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                Pedido de: <strong>{fornecedorInfoAtual.nome}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens do Carrinho */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              {itens.map((item) => (
                <div 
                  key={item.prato.id} 
                  className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center mb-4 sm:mb-0">
                    <img 
                      src={item.prato.imagem || 'https://via.placeholder.com/80?text=Prato'} 
                      alt={item.prato.nome} 
                      className="w-20 h-20 rounded-lg object-cover mr-4 shadow"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/80?text=Prato')}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.prato.nome}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Preço unitário: R$ {item.prato.preco.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                      <button 
                        onClick={() => handleDecrementar(item.prato.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                        aria-label="Diminuir quantidade"
                        disabled={isLoadingPedido}
                      >
                        <FaMinus size={14}/>
                      </button>
                      <span className="px-3 py-1 text-gray-800 dark:text-white font-medium min-w-[40px] text-center">{item.quantidade}</span>
                      <button 
                        onClick={() => handleIncrementar(item.prato.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                        aria-label="Aumentar quantidade"
                        disabled={isLoadingPedido}
                      >
                        <FaPlus size={14}/>
                      </button>
                    </div>
                    <p className="text-md font-semibold text-gray-800 dark:text-white w-24 text-right">
                      R$ {(item.prato.preco * item.quantidade).toFixed(2).replace('.', ',')}
                    </p>
                    <button 
                      onClick={() => removerDoCarrinho(item.prato.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                      aria-label="Remover item"
                      disabled={isLoadingPedido}
                    >
                      <FaTrash size={18}/>
                    </button>
                  </div>
                </div>
              ))}
              {itens.length > 0 && (
                <div className="mt-6 text-right">
                  <button
                    onClick={limparCarrinho}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 underline transition-colors"
                    disabled={isLoadingPedido}
                  >
                    Limpar carrinho
                  </button>
                </div>
              )}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 sticky top-28">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                  Resumo do Pedido
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal ({obterTotalItensCarrinho()} itens)</span>
                    <span>R$ {obterValorTotalCarrinho().toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Taxa de entrega</span>
                    <span className="text-green-600 dark:text-green-400">Grátis</span> 
                    {/* Poderia ser calculado ou vir do fornecedor no futuro */}
                  </div>
                  {/* Adicionar mais itens como descontos, etc. se necessário */}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-800 dark:text-white mb-6">
                    <span>Total</span>
                    <span>R$ {obterValorTotalCarrinho().toFixed(2).replace('.', ',')}</span>
                  </div>

                  <button
                    onClick={handleFinalizarPedido}
                    disabled={itens.length === 0 || isLoadingPedido}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingPedido ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCreditCard className="mr-2" />
                    )}
                    {isLoadingPedido ? 'Processando...' : 'Finalizar Pedido'}
                  </button>
                </div>
                <Link
                  to="/fornecedores"
                  className="mt-6 block text-center text-green-600 dark:text-green-400 hover:underline"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default CarrinhoPage; 