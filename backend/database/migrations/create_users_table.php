<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('senha');
            $table->string('cpf', 14)->unique();
            $table->string('telefone', 15);
            $table->date('data_nascimento');
            $table->string('cep', 9);
            $table->string('rua');
            $table->string('numero', 10);
            $table->string('complemento')->nullable();
            $table->enum('tipo', ['usuario', 'fornecedor'])->default('usuario');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}; 