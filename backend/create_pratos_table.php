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
        Schema::create('pratos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fornecedor_id')->constrained('users')->onDelete('cascade');
            $table->string('nome');
            $table->text('descricao');
            $table->decimal('preco', 8, 2);
            $table->string('imagem')->nullable();
            $table->string('categoria');
            $table->integer('calorias');
            $table->decimal('proteinas', 5, 1);
            $table->decimal('carboidratos', 5, 1);
            $table->decimal('gorduras', 5, 1);
            $table->boolean('disponivel')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pratos');
    }
}; 