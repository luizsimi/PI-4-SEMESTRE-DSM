<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarFornecedor
{
    /**
     * Verifica se o usuário logado é um fornecedor.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o usuário está logado
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Você precisa estar logado para acessar essa área.');
        }

        // Verifica se o usuário é um fornecedor
        $user = auth()->user();
        
        // Verificação para Cliente
        if (get_class($user) === 'App\\Models\\Cliente') {
            if ($user->isProdutor !== 1) {
                return redirect('/')->with('error', 'Você não tem permissão para acessar essa área.');
            }
        }
        // Verificação para User (se existir)
        elseif (get_class($user) === 'App\\Models\\User') {
            if ($user->tipo !== 'fornecedor') {
                return redirect('/')->with('error', 'Você não tem permissão para acessar essa área.');
            }
        }
        else {
            return redirect('/')->with('error', 'Você não tem permissão para acessar essa área.');
        }

        return $next($request);
    }
} 