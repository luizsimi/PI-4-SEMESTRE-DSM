# Instruções para Executar o Projeto LeveFit

Este documento contém as instruções detalhadas para configurar e executar tanto o backend Laravel quanto o frontend React do projeto LeveFit.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 14.x ou superior) e **npm**
2. **PHP** (versão 8.1 ou superior)
3. **Composer**
4. **MySQL**
5. **XAMPP, WAMP ou MAMP** (ou qualquer servidor Apache + MySQL)

## Configurando o Backend (Laravel)

1. **Inicie seu servidor MySQL**:

   - Se estiver usando XAMPP, inicie os módulos Apache e MySQL
   - Verifique se o MySQL está rodando na porta 3306 (padrão)

2. **Crie um banco de dados**:

   - Acesse o phpMyAdmin (geralmente em http://localhost/phpmyadmin)
   - Crie um novo banco de dados chamado `levefit`

3. **Configure o ambiente Laravel**:

   ```bash
   # Entre na pasta do backend
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
   - Acesse http://localhost:8000/api/pratos
   - Você deve receber uma resposta JSON (possivelmente um array vazio)

## Configurando o Frontend (React)

1. **Instale as dependências**:

   ```bash
   # Volte para a pasta raiz do projeto
   cd ..

   # Instale as dependências do React
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

3. **Acesse a aplicação**:
   - Abra seu navegador e acesse http://localhost:5173
   - A interface do LeveFit deve ser carregada

## Testando o Sistema

1. **Registre-se como fornecedor**:

   - Clique no botão de login/registro
   - Escolha a opção de registro
   - Preencha o formulário selecionando o tipo "fornecedor"
   - Envie o formulário

2. **Adicione pratos (como fornecedor)**:

   - Após o login, acesse o dashboard do fornecedor
   - Use o formulário de cadastro de pratos
   - Adicione imagem, descrição e dados nutricionais

3. **Visualize o catálogo (como cliente)**:
   - Faça logout e registre-se como cliente
   - Navegue pelo catálogo de pratos
   - Experimente os filtros por categoria

## Solução de Problemas

### Erro de conexão com o banco de dados

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados `levefit` foi criado

### Erro de CORS

- Verifique se o backend está rodando na porta 8000
- Confirme se o arquivo `config/cors.php` permite a origem do frontend

### Erro de upload de imagens

- Verifique se o link simbólico foi criado com `php artisan storage:link`
- Confirme se a pasta `storage/app/public` tem permissões de escrita

### Erro 404 nas rotas da API

- Verifique se está acessando com o prefixo correto `/api/`
- Confirme se as rotas estão definidas corretamente em `routes/api.php`
