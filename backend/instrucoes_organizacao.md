# Instruções para Organização do Backend Laravel

Para que os arquivos do backend Laravel estejam corretamente organizados, é necessário criar a estrutura de pastas adequada e mover os arquivos existentes para suas respectivas localizações. Abaixo está o guia para organizar a estrutura do projeto:

## Estrutura de Pastas a ser Criada

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PratoController.php
│   │   │   └── AvaliacaoController.php
│   │   ├── Middleware/
│   │   └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Prato.php
│   │   └── Avaliacao.php
│   └── ...
├── bootstrap/
├── config/
│   ├── app.php
│   ├── database.php
│   ├── auth.php
│   ├── cors.php
│   └── ...
├── database/
│   ├── migrations/
│   │   ├── xxxx_xx_xx_create_users_table.php
│   │   ├── xxxx_xx_xx_create_pratos_table.php
│   │   └── xxxx_xx_xx_create_avaliacoes_table.php
│   └── ...
├── public/
├── resources/
├── routes/
│   ├── api.php
│   └── web.php
├── storage/
├── .env.example
├── composer.json
└── artisan
```

## Como Organizar os Arquivos Atuais

1. **Crie a estrutura de pastas completa** utilizando o comando Laravel para criar um novo projeto:

```bash
composer create-project laravel/laravel temp-laravel
```

2. **Copie a estrutura base** do diretório temp-laravel para a pasta backend:

```bash
xcopy /E /I temp-laravel backend
```

3. **Mova os arquivos existentes** para suas localizações corretas:

   - **Modelos** para `app/Models/`:
     - User.php
     - Prato.php
     - Avaliacao.php
   - **Controladores** para `app/Http/Controllers/`:
     - AuthController.php
     - PratoController.php
     - AvaliacaoController.php
   - **Migrações** para `database/migrations/`:

     - create_users_table.php
     - create_pratos_table.php
     - create_avaliacoes_table.php

   - **Rotas API** para `routes/api.php`

   - **Arquivo de ambiente** para a raiz:
     - .env.example

4. **Atualize os namespaces nos arquivos** de acordo com seus novos locais. Por exemplo:

   - Nos modelos: `namespace App\Models;`
   - Nos controladores: `namespace App\Http\Controllers;`

5. **Configure o arquivo composer.json** para que o autoload funcione corretamente:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "Database\\Factories\\": "database/factories/",
        "Database\\Seeders\\": "database/seeders/"
    }
},
```

6. **Atualize o autoload** após a organização:

```bash
composer dump-autoload
```

## Notas Importantes

- Se você criou o projeto Laravel corretamente, esses arquivos já estarão nos lugares certos, apenas precisando de ajustes nos namespaces.

- Certifique-se de que todas as referências entre arquivos usem namespaces completos, e que as importações (use statements) no topo de cada arquivo estejam corretas.

- O arquivo `.env.example` está na raiz do projeto, mantenha-o lá. Copie-o para `.env` ao configurar o ambiente.

- Para as rotas API, o arquivo `api.php` deve estar na pasta `routes/`.

- Se você precisar adicionar novos pacotes ou modificar o composer.json, execute `composer update` para aplicar as mudanças.
