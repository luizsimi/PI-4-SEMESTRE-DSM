<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PratoController;
use App\Http\Controllers\AvaliacaoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rotas para a API do LeveFit
|
*/

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas públicas para pratos
Route::get('/pratos', [PratoController::class, 'index']);
Route::get('/pratos/{id}', [PratoController::class, 'show']);

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Rotas de autenticação
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Rotas para pratos (fornecedor)
    Route::post('/pratos', [PratoController::class, 'store']);
    Route::put('/pratos/{id}', [PratoController::class, 'update']);
    Route::delete('/pratos/{id}', [PratoController::class, 'destroy']);
    
    // Rotas para avaliações
    Route::get('/pratos/{pratoId}/avaliacoes', [AvaliacaoController::class, 'index']);
    Route::post('/pratos/{pratoId}/avaliacoes', [AvaliacaoController::class, 'store']);
    Route::put('/avaliacoes/{id}', [AvaliacaoController::class, 'update']);
    Route::delete('/avaliacoes/{id}', [AvaliacaoController::class, 'destroy']);
});

// Rota de fallback para endpoints não encontrados
Route::fallback(function(){
    return response()->json([
        'message' => 'Endpoint não encontrado. Verifique a URL e o método HTTP.'
    ], 404);
}); 