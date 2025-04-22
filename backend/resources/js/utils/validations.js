export const validarCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) return false;

  // Validação do CPF
  let soma = 0;
  let resto;

  if (cpf === "00000000000") return false;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha) => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(senha);
};

export const validarCartaoCredito = (numero) => {
  // Remove caracteres não numéricos
  numero = numero.replace(/\D/g, "");

  // Algoritmo de Luhn (Módulo 10)
  let soma = 0;
  let dobro = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = parseInt(numero.charAt(i));

    if (dobro) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    soma += digito;
    dobro = !dobro;
  }

  return soma % 10 === 0;
};

export const validarCEP = (cep) => {
  const regex = /^\d{5}-?\d{3}$/;
  return regex.test(cep);
};

// Inicializar o SDK do Mercado Pago (Simples)
export const inicializarMercadoPago = (publicKey) => {
  if (typeof window !== "undefined" && window.MercadoPago) {
    return new window.MercadoPago(publicKey);
  }
  return null;
};

// Exemplo de função para processar pagamento (interface com API backend)
export const processarPagamento = async (dadosCartao, valor) => {
  try {
    // Em produção, isto seria uma chamada para o seu backend
    // que então se comunicaria com o Mercado Pago
    const response = await fetch("/api/pagamento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartao: dadosCartao,
        valor: valor,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    throw new Error("Falha ao processar pagamento");
  }
};
