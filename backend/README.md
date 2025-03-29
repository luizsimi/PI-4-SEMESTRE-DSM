# LeveFit API - Backend Laravel

Este é o backend da aplicação LeveFit, desenvolvido com PHP Laravel e MySQL.

## Requisitos

- PHP >= 8.1
- Composer
- MySQL (XAMPP, WAMP, MAMP ou similar)
- Extensões PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## Instalação

1. Clone o repositório:

```bash
git clone <seu-repositorio>
cd backend
```

2. Instale as dependências:

```bash
composer install
```

3. Configure o ambiente:

```bash
cp .env.example .env
php artisan key:generate
```

4. Configure o banco de dados:

   - Inicie o XAMPP (Apache e MySQL)
   - Crie um banco de dados chamado `levefit`
   - Atualize as configurações de banco no arquivo `.env` se necessário

5. Execute as migrações:

```bash
php artisan migrate
```

6. Inicie o servidor de desenvolvimento:

```bash
php artisan serve
```

O servidor estará disponível em `http://localhost:8000`.

## Estrutura do Banco de Dados

### Users

- Armazena informações de usuários e fornecedores
- Campos: nome, email, senha, cpf, telefone, data_nascimento, endereço, tipo

### Pratos

- Armazena informações sobre os pratos oferecidos pelos fornecedores
- Campos: nome, descrição, preço, imagem, categoria, dados nutricionais, disponibilidade

### Avaliações

- Armazena avaliações e comentários dos usuários sobre os pratos
- Campos: user_id, prato_id, nota, comentário

## API Endpoints

### Autenticação

- `POST /api/register` - Registrar novo usuário
- `POST /api/login` - Fazer login
- `GET /api/user` - Obter dados do usuário logado
- `POST /api/logout` - Fazer logout

### Pratos

- `GET /api/pratos` - Listar pratos (com filtros e paginação)
- `GET /api/pratos/{id}` - Obter detalhes de um prato
- `POST /api/pratos` - Cadastrar novo prato (apenas fornecedores)
- `PUT /api/pratos/{id}` - Atualizar um prato (apenas fornecedor dono)
- `DELETE /api/pratos/{id}` - Excluir um prato (apenas fornecedor dono)

### Avaliações

- `GET /api/pratos/{pratoId}/avaliacoes` - Listar avaliações de um prato
- `POST /api/pratos/{pratoId}/avaliacoes` - Criar uma avaliação para um prato
- `PUT /api/avaliacoes/{id}` - Atualizar uma avaliação (apenas autor)
- `DELETE /api/avaliacoes/{id}` - Excluir uma avaliação (apenas autor)

## Integração com o Frontend

Para integrar com o frontend React, utilize o axios para fazer requisições à API:

```javascript
import axios from "axios";

// Configuração base
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Adicionar token de autenticação (após login)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## CORS e Segurança

O backend está configurado para permitir requisições do frontend em `http://localhost:3000`. Se precisar alterar as origens permitidas, edite o arquivo `config/cors.php`.
