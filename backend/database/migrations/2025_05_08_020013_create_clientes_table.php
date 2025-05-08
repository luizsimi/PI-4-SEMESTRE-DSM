<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();

            // Parte 1
            $table->string('nome_completo');
            $table->string('cpf')->unique();
            $table->string('telefone');
            $table->string('email')->unique();
            $table->date('data_nascimento');

            // Parte 2
            $table->string('cep');
            $table->string('rua');
            $table->string('numero');
            $table->string('complemento')->nullable();
            $table->string('bairro');
            $table->string('cidade');
            $table->string('estado', 2);

            // Parte 3
            $table->string('senha');
            $table->boolean('termos_uso')->default(false);
            $table->boolean('politica_privacidade')->default(false);
            $table->boolean('isProdutor')->default(false);

            // Parte 4 (só produtor)
            $table->string('numero_cartao')->nullable();
            $table->string('nome_titular')->nullable();
            $table->string('validade_cartao')->nullable();
            $table->string('cvv', 4)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};