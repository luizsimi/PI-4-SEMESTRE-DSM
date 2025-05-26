import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

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
  adicionarAoCarrinho: (prato: PratoParaCarrinho, quantidade?: number) => boolean; // Retorna true se adicionado, false se necessitar confirmação
  removerDoCarrinho: (pratoId: number) => void;
  atualizarQuantidadeNoCarrinho: (pratoId: number, novaQuantidade: number) => void;
  limparCarrinho: () => void;
  obterTotalItensCarrinho: () => number;
  obterValorTotalCarrinho: () => number;
  getQuantidadePrato: (pratoId: number) => number;
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

  useEffect(() => {
    localStorage.setItem('carrinhoItens', JSON.stringify(itens));
    localStorage.setItem('carrinhoFornecedorInfo', JSON.stringify(fornecedorInfoAtual));
  }, [itens, fornecedorInfoAtual]);

  const adicionarAoCarrinho = (prato: PratoParaCarrinho, quantidade: number = 1): boolean => {
    if (fornecedorInfoAtual && fornecedorInfoAtual.id !== prato.fornecedor.id) {
      const confirmReset = window.confirm(
        `Você já tem itens de "${fornecedorInfoAtual.nome}" no carrinho. \nDeseja limpar o carrinho e adicionar este item de "${prato.fornecedor.nome}"?`
      );
      if (confirmReset) {
        setItens([{ prato, quantidade }]);
        setFornecedorInfoAtual(prato.fornecedor);
        return true;
      }
      return false; // Não adicionado, necessita confirmação
    }

    setFornecedorInfoAtual(prato.fornecedor);
    setItens((prevItens) => {
      const itemExistente = prevItens.find((item) => item.prato.id === prato.id);
      if (itemExistente) {
        return prevItens.map((item) =>
          item.prato.id === prato.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...prevItens, { prato, quantidade }];
    });
    return true; // Adicionado com sucesso
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
      }}
    >
      {children}
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