import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Verificar se já existem fornecedores no sistema
  const fornecedores = await prisma.fornecedor.findMany({
    where: {
      assinaturaAtiva: true,
      status: true,
    },
  });

  if (fornecedores.length === 0) {
    console.log(
      "Nenhum fornecedor encontrado com assinatura ativa. Por favor, crie um fornecedor primeiro."
    );
    return;
  }

  // Selecionar o primeiro fornecedor para associar aos pratos
  const fornecedor = fornecedores[0];
  console.log(`Usando fornecedor: ${fornecedor.nome} (ID: ${fornecedor.id})`);

  // Dados dos pratos promocionais
  const pratosPromocionais = [
    {
      nome: "Salada Primavera com Frango Grelhado",
      descricao:
        "Salada fresquinha com mix de folhas, frango grelhado suculento, tomate cereja, cenoura ralada e molho especial. Rica em proteínas e com baixo teor calórico.",
      preco: 24.9,
      precoOriginal: 32.9,
      categoria: "Fitness",
      imagem:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
      emPromocao: true,
      dataFimPromocao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
      calorias: 320,
      proteinas: 28,
      carboidratos: 12,
      gorduras: 18,
      fibras: 5,
      porcao: "Porção de 350g",
    },
    {
      nome: "Bowl Proteico Vegano",
      descricao:
        "Bowl vegano completo com grãos integrais, tofu temperado, abacate, legumes crocantes e molho tahine. Opção nutritiva, saborosa e 100% vegetal.",
      preco: 27.9,
      precoOriginal: 34.9,
      categoria: "Vegano",
      imagem:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
      emPromocao: true,
      dataFimPromocao: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 dias a partir de hoje
      calorias: 420,
      proteinas: 18,
      carboidratos: 45,
      gorduras: 22,
      fibras: 8,
      porcao: "Porção de 400g",
    },
    {
      nome: "Wrap de Salmão com Cream Cheese",
      descricao:
        "Wrap integral recheado com salmão defumado, cream cheese light, pepino, rúcula e sementes de gergelim. Leve e rico em ômega-3.",
      preco: 19.9,
      precoOriginal: 26.9,
      categoria: "Low Carb",
      imagem:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=1000&auto=format&fit=crop",
      emPromocao: true,
      dataFimPromocao: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 dias a partir de hoje
      calorias: 380,
      proteinas: 22,
      carboidratos: 25,
      gorduras: 20,
      fibras: 3,
      porcao: "Unidade de 200g",
    },
    {
      nome: "Tigela Açaí Premium",
      descricao:
        "Tigela de açaí puro da Amazônia com granola artesanal, banana, morango, mel e castanhas. Um boost de energia natural e delicioso.",
      preco: 18.9,
      precoOriginal: 24.9,
      categoria: "Vegetariano",
      imagem:
        "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1000&auto=format&fit=crop",
      emPromocao: true,
      dataFimPromocao: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 dias a partir de hoje
      calorias: 410,
      proteinas: 8,
      carboidratos: 65,
      gorduras: 15,
      fibras: 7,
      porcao: "Tigela de 300ml",
    },
  ];

  console.log("Iniciando inserção dos pratos promocionais...");

  // Inserir os pratos
  for (const prato of pratosPromocionais) {
    try {
      const novoPrato = await prisma.prato.create({
        data: {
          ...prato,
          fornecedorId: fornecedor.id,
        },
      });
      console.log(`✅ Prato inserido: ${novoPrato.nome} (ID: ${novoPrato.id})`);
    } catch (error) {
      console.error(`❌ Erro ao inserir prato "${prato.nome}":`, error);
    }
  }

  console.log("Processo de inserção concluído!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução do script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
