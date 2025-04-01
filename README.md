# LeveFit - Sistema de Delivery de Comida Saudável

## Sobre o Projeto

O LeveFit é uma plataforma de delivery de comida saudável que conecta fornecedores e clientes. O sistema permite que fornecedores cadastrem seus pratos saudáveis com informações nutricionais, enquanto os clientes podem navegar pelo catálogo, filtrar por categorias, e realizar pedidos via whatsapp.

## Tecnologias Utilizadas

### Frontend

- React.js
- Tailwind CSS
- React Router
- Axios
- Context API
- Mercado Pago SDK

### Backend

- PHP Laravel
- MySQL
- Sanctum (autenticação API)

## Estrutura do Projeto

- `/backend` - API Laravel
- `/src` - Aplicação React
- `/public` - Arquivos estáticos

## Funcionalidades Principais

### Para Clientes

- Registro e login de usuários
- Navegação no catálogo de pratos
- Filtros por categoria, disponibilidade e preço
- Visualização de informações nutricionais
- Avaliação de pratos consumidos
- Pagamentos via WhatsApp direto com o restaurante

### Para Fornecedores

- Pagamento via Mercado Pago para ter acesso a ter seu catalogo de pratos em nosso site
- Dashboard de gerenciamento
- Cadastro e edição de pratos
- Upload de imagens
- Controle de disponibilidade
- Visualização de avaliações

## Começando

### Requisitos

- Node.js 14.x ou superior
- PHP 8.1 ou superior
- Composer
- MySQL
- XAMPP, WAMP ou similar (opcional)

### Instalação e Configuração

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd levefit
```

2. Configure o Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure o banco de dados no arquivo .env
php artisan migrate
php artisan serve
```

3. Configure o Frontend:

```bash
cd ..  # Voltar para a pasta raiz
npm install
# Configure o arquivo .env com a URL da API
npm start
```

O frontend estará disponível em `http://localhost:3000` e o backend em `http://localhost:8000`.

## Autenticação

O sistema utiliza tokens JWT via Laravel Sanctum para autenticação. Os tokens são armazenados no localStorage e enviados em cada requisição através do cabeçalho de Authorization.

## Screenshots

[Inserir screenshots do sistema aqui]

## Desenvolvedores

- ABNER DE SOUZA (DOCUMENTAÇÃO/DESIGN)
- DARLAN DOS SANTOS (BACK-END)
- LUIZ HENRIQUE SIMIONATO (FRONT-END/ DESIGN)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
