import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import Toast from '../components/Toast';
import ConfirmacaoLimparCarrinhoModal from '../components/ConfirmacaoLimparCarrinhoModal';
import ConfirmacaoPedidoModal from '../components/ConfirmacaoPedidoModal';

// Interfaces
export interface FornecedorInfo {
  id: number;
  nome: string;
}

export interface PratoParaCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem?: string;
  fornecedor: FornecedorInfo; 
}

export interface CarrinhoItem {
  prato: PratoParaCarrinho;
  quantidade: number;
}

interface CarrinhoContextType {
  itens: CarrinhoItem[];
  fornecedorInfoAtual: FornecedorInfo | null;
  adicionarAoCarrinho: (prato: PratoParaCarrinho, quantidade?: number) => boolean;
  removerDoCarrinho: (pratoId: number) => void;
  atualizarQuantidadeNoCarrinho: (pratoId: number, novaQuantidade: number) => void;
  limparCarrinho: () => void;
  obterTotalItensCarrinho: () => number;
  obterValorTotalCarrinho: () => number;
  getQuantidadePrato: (pratoId: number) => number;
  finalizarPedido: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itens, setItens] = useState<CarrinhoItem[]>(() => {
    const itensSalvos = localStorage.getItem('carrinhoItens');
    return itensSalvos ? JSON.parse(itensSalvos) : [];
  });
  
  const [fornecedorInfoAtual, setFornecedorInfoAtual] = useState<FornecedorInfo | null>(() => {
    const fornecedorSalvo = localStorage.getItem('carrinhoFornecedorInfo');
    return fornecedorSalvo ? JSON.parse(fornecedorSalvo) : null;
  });
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pratoEmEspera, setPratoEmEspera] = useState<{prato: PratoParaCarrinho, quantidade: number} | null>(null);
  const [showConfirmacaoPedido, setShowConfirmacaoPedido] = useState(false);

  useEffect(() => {
    localStorage.setItem('carrinhoItens', JSON.stringify(itens));
    localStorage.setItem('carrinhoFornecedorInfo', JSON.stringify(fornecedorInfoAtual));
  }, [itens, fornecedorInfoAtual]);

  const adicionarAoCarrinho = (prato: PratoParaCarrinho, quantidade: number = 1): boolean => {
    if (fornecedorInfoAtual && fornecedorInfoAtual.id !== prato.fornecedor.id) {
      setPratoEmEspera({ prato, quantidade });
      setShowModal(true);
      return false;
    }

    setFornecedorInfoAtual(prato.fornecedor);
    setItens((prevItens) => {
      const itemExistente = prevItens.find((item) => item.prato.id === prato.id);
      if (itemExistente) {
        setToastMessage(`${prato.nome} adicionado ao carrinho!`);
        setShowToast(true);
        return prevItens.map((item) =>
          item.prato.id === prato.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      setToastMessage(`${prato.nome} adicionado ao carrinho!`);
      setShowToast(true);
      return [...prevItens, { prato, quantidade }];
    });
    return true;
  };

  const handleConfirmarLimparCarrinho = () => {
    if (pratoEmEspera) {
      setItens([{ prato: pratoEmEspera.prato, quantidade: pratoEmEspera.quantidade }]);
      setFornecedorInfoAtual(pratoEmEspera.prato.fornecedor);
      setToastMessage(`${pratoEmEspera.prato.nome} adicionado ao carrinho!`);
      setShowToast(true);
      setShowModal(false);
      setPratoEmEspera(null);
    }
  };

  const removerDoCarrinho = (pratoId: number) => {
    setItens((prevItens) => {
      const novosItens = prevItens.filter((item) => item.prato.id !== pratoId);
      if (novosItens.length === 0) {
        setFornecedorInfoAtual(null);
      }
      return novosItens;
    });
  };

  const atualizarQuantidadeNoCarrinho = (pratoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(pratoId);
      return;
    }
    setItens((prevItens) =>
      prevItens.map((item) =>
        item.prato.id === pratoId ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
    setFornecedorInfoAtual(null);
  };

  const obterTotalItensCarrinho = (): number => {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  };

  const obterValorTotalCarrinho = (): number => {
    return itens.reduce((total, item) => total + item.prato.preco * item.quantidade, 0);
  };

  const getQuantidadePrato = (pratoId: number): number => {
    const item = itens.find(i => i.prato.id === pratoId);
    return item ? item.quantidade : 0;
  };

  const finalizarPedido = () => {
    setShowConfirmacaoPedido(true);
  };

  const handleConfirmarPedido = () => {
    // Aqui você pode adicionar a lógica para enviar o pedido para o backend
    limparCarrinho();
    setShowConfirmacaoPedido(false);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        fornecedorInfoAtual,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidadeNoCarrinho,
        limparCarrinho,
        obterTotalItensCarrinho,
        obterValorTotalCarrinho,
        getQuantidadePrato,
        finalizarPedido,
      }}
    >
      {children}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      {showModal && pratoEmEspera && fornecedorInfoAtual && (
        <ConfirmacaoLimparCarrinhoModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setPratoEmEspera(null);
          }}
          onConfirm={handleConfirmarLimparCarrinho}
          fornecedorAtual={fornecedorInfoAtual.nome}
          novoFornecedor={pratoEmEspera.prato.fornecedor.nome}
        />
      )}
      <ConfirmacaoPedidoModal
        isOpen={showConfirmacaoPedido}
        onClose={() => setShowConfirmacaoPedido(false)}
        onConfirm={handleConfirmarPedido}
      />
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = (): CarrinhoContextType => {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}; 