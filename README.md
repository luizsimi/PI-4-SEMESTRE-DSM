# LeveFit - Sistema de Delivery de Comida Saudável

## Sobre o Projeto

O LeveFit é uma plataforma de delivery de comida saudável que conecta fornecedores e clientes. O sistema permite que fornecedores cadastrem seus pratos saudáveis com informações nutricionais, enquanto os clientes podem navegar pelo catálogo, filtrar por categorias, e realizar pedidos via WhatsApp diretamente com o restaurante.

## Características Visuais

- **Design Moderno e Responsivo** - Interface limpa e intuitiva adaptada para todos os dispositivos
- **Animações Fluidas** - Efeitos de digitação, transições suaves e componentes animados
- **Carrossel Otimizado** - Apresentação elegante de restaurantes parceiros e pratos em destaque
- **Filtros Interativos** - Sistema dinâmico de categorias para facilitar a navegação

## Tecnologias Utilizadas

### Frontend

- **React.js** - Biblioteca para construção de interfaces
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **React Router Dom** - Gerenciamento de rotas da aplicação
- **React Icons** - Biblioteca de ícones
- **React Slick** - Implementação do carrossel
- **Inertia.js** - Integração frontend-backend sem APIs

### Backend

- **Laravel 10** - Framework PHP
- **MySQL** - Banco de dados relacional
- **Laravel Sanctum** - Autenticação da API
- **Laravel Breeze** - Scaffolding de autenticação

## Estrutura do Projeto

- `/backend` - Aplicação Laravel com API e recursos
  - `/resources/js` - Frontend React integrado com Inertia.js
  - `/resources/css` - Estilos e configurações do Tailwind
  - `/app/Http/Controllers` - Controladores da aplicação
  - `/routes` - Rotas da API e web
- `/src` - Código fonte React para desenvolvimento independente
- `/public` - Arquivos estáticos e imagens

## Funcionalidades Principais

### Para Clientes

- Registro e login de usuários
- Navegação no catálogo de pratos com animações
- Filtros por categoria de alimentos (Aves, Bovina, Vegano, Peixes)
- Visualização de informações nutricionais e calorias
- Contato direto com fornecedores via WhatsApp

### Para Fornecedores

- Dashboard administrativo
- Cadastro e gerenciamento de produtos
- Upload de imagens de pratos
- Estatísticas de visualizações

## Execução do Projeto

Para instruções detalhadas sobre como executar o projeto, consulte o arquivo [INSTRUCOES_EXECUCAO.md](./INSTRUCOES_EXECUCAO.md).

### Requisitos Básicos

- Node.js 18.x ou superior
- PHP 8.1 ou superior
- Composer
- MySQL
- XAMPP, WAMP ou similar (opcional)

### Comandos Rápidos

**Backend:**

```bash
cd backend
composer install
php artisan serve
```

**Frontend:**

```bash
cd backend
npm install
npm run dev
```

## Otimizações de Performance

O LeveFit possui diversas otimizações para garantir uma experiência fluida:

- Carregamento de imagens otimizado
- Animações CSS para melhor performance visual
- Implementação de efeitos visuais com baixo impacto no desempenho
- Estilização avançada do carrossel para evitar problemas de layout

## Desenvolvedores

- ABNER DE SOUZA (DOCUMENTAÇÃO/DESIGN)
- DARLAN DOS SANTOS (BACK-END)
- LUIZ HENRIQUE SIMIONATO (FRONT-END/DESIGN)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
