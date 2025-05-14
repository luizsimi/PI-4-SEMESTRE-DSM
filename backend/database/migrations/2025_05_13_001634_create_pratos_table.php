<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePratosTable extends Migration
{
    public function up()
    {
        Schema::create('pratos', function (Blueprint $table) {
            $table->id();

            $table->string('nome');
            $table->text('descricao');
            $table->decimal('preco', 8, 2);

            $table->enum('categoria', [
                'LOWcarb',
                'vegetariano',
                'vegano',
                'proteico',
                'fitness',
                'detox'
            ]);

            $table->string('foto')->nullable();

            $table->float('calorias')->default(0);
            $table->float('proteinas')->default(0);
            $table->float('carboidratos')->default(0);
            $table->float('gorduras')->default(0);

            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pratos');
    }
}