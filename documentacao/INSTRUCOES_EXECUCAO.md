# Instruções para Executar o Projeto LeveFit

Este documento contém as instruções detalhadas para configurar e executar tanto o backend Laravel quanto o frontend React integrado do projeto LeveFit.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18.x ou superior) e **npm**
2. **PHP** (versão 8.1 ou superior)
3. **Composer**
4. **MySQL**
5. **XAMPP, WAMP ou MAMP** (ou qualquer servidor Apache + MySQL)

## Configurando o Ambiente de Desenvolvimento

### 1. Instalando Dependências Globais

Recomendamos instalar o Vite globalmente para evitar problemas com paths:

```bash
npm install -g vite
```

### 2. Configurando o Backend (Laravel)

1. **Inicie seu servidor MySQL**:

   - Se estiver usando XAMPP, inicie os módulos Apache e MySQL
   - Verifique se o MySQL está rodando na porta 3306 (padrão)

2. **Crie um banco de dados**:

   - Acesse o phpMyAdmin (geralmente em http://localhost/phpmyadmin)
   - Crie um novo banco de dados chamado `levefit`

3. **Configure o ambiente Laravel**:

   ```bash
   # Entre na pasta do backend (importante estar na pasta correta)
   cd backend

   # Instale as dependências do projeto
   composer install

   # Copie o arquivo de ambiente e gere a chave da aplicação
   cp .env.example .env
   php artisan key:generate

   # Edite o arquivo .env se necessário (usuário/senha do banco)
   # DB_USERNAME=root
   # DB_PASSWORD=

   # Execute as migrações para criar as tabelas
   php artisan migrate

   # Crie o link simbólico para armazenamento de imagens
   php artisan storage:link

   # Inicie o servidor Laravel na porta 8000
   php artisan serve
   ```

4. **Verifique se o servidor está rodando**:
   - Acesse http://localhost:8000
   - A página inicial do Laravel deve ser exibida

## Configurando o Frontend

O frontend React está integrado ao Laravel usando Inertia.js. Isso significa que você não precisa executar um servidor React separado.

1. **Instale as dependências do Node**:

   ```bash
   # Certifique-se de estar na pasta backend
   cd backend

   # Instale as dependências do React/Vite
   npm install
   ```

2. **Inicie o servidor de desenvolvimento Vite**:

   ```bash
   # Na pasta backend
   npm run dev
   ```

   Se o comando acima falhar, tente usar:

   ```bash
   # Alternativa usando npx
   npx vite
   ```

3. **Acesse a aplicação completa**:
   - Abra seu navegador e acesse http://localhost:8000
   - A interface do LeveFit deve ser carregada com todos os recursos visuais

## Soluções para Problemas Comuns

### Erro "vite não é reconhecido como um comando"

Se você receber o erro `'vite' não é reconhecido como um comando interno ou externo...`:

1. Instale o Vite globalmente:

   ```bash
   npm install -g vite
   ```

2. Ou use npx para executar o Vite sem instalação global:
   ```bash
   npx vite
   ```

### Erro "Could not open input file: artisan"

Este erro indica que você não está na pasta correta. Certifique-se de estar na pasta `backend` antes de executar comandos Laravel:

```bash
cd backend
php artisan serve
```

### Erro de CORS ou Conexão com o Backend

Se o frontend não conseguir se comunicar com o backend:

1. Verifique se ambos os servidores estão rodando:

   - Laravel em http://localhost:8000
   - Vite em http://localhost:5173 (ou a porta indicada no terminal)

2. Certifique-se de que o arquivo `config/cors.php` no backend permite a origem do frontend:
   ```php
   'allowed_origins' => ['http://localhost:5173', 'http://localhost:8000'],
   ```

### Conflito de Portas

Se a porta 8000 estiver em uso:

```bash
# Use uma porta alternativa
php artisan serve --port=8080
```

## Características Visuais

O LeveFit possui diversas animações e efeitos visuais:

1. **Efeito de Digitação** - Na página inicial, o texto é digitado letra por letra
2. **Animações de Entrada** - Os componentes aparecem com efeitos suaves
3. **Carrossel de Restaurantes** - Apresentação elegante dos fornecedores parceiros
4. **Filtros Interativos** - Sistema de categorias com mudança visual ao selecionar

Se alguma animação não funcionar corretamente, verifique:

- Se seu navegador está atualizado
- Se o JavaScript está habilitado
- Se o CSS está sendo carregado corretamente

## Testando o Sistema

1. **Navegue pelo catálogo de pratos**:

   - Na página inicial, role até encontrar as diferentes categorias de pratos
   - Experimente filtrar por categoria (Aves, Bovina, Vegano, Peixes)
   - Veja os detalhes de cada prato, incluindo informações nutricionais

2. **Explore a seção de restaurantes parceiros**:

   - Navegue pelo carrossel de restaurantes
   - Veja as classificações e especialidades de cada fornecedor

3. **Teste o desempenho em dispositivos móveis**:
   - O design é totalmente responsivo e adaptado para todos os tamanhos de tela
   - As animações são otimizadas para melhor performance em dispositivos móveis
