<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\VerificarFornecedor;

//Route::get('/', function () {
  //  return Inertia::render('Welcome', [
    //    'canLogin' => Route::has('login'),
      //  'canRegister' => Route::has('register'),
        //'laravelVersion' => Application::VERSION,
        //'phpVersion' => PHP_VERSION,
    //]);
//});

Route::get('/', function () {
    return Inertia::render('Home'); // Nome do arquivo: Home.jsx
});

// Página de não autorizado
Route::get('/not-authorized', function () {
    return Inertia::render('NotAuthorized');
})->name('not-authorized');

// Rota para fornecedores - apenas eles terão acesso ao dashboard
Route::get('/fornecedor/dashboard', function () {
    return Inertia::render('Fornecedor/NovoDashboard');
})->middleware(['auth', \App\Http\Middleware\VerificarFornecedor::class])->name('fornecedor.dashboard');

// Quando um cliente comum tenta acessar o dashboard, redireciona para a home
Route::get('/dashboard', function () {
    // Verificar se o usuário é um fornecedor
    if (auth()->check() && (auth()->user()->isProdutor == 1 || auth()->user()->tipo == 'fornecedor')) {
        return redirect()->route('fornecedor.dashboard');
    }
    
    // Se for cliente comum, redireciona para a página inicial
    return redirect('/');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
