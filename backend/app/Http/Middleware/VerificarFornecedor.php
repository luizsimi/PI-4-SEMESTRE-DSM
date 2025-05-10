<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

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
        
        // Log para debug
        Log::info('Verificando permissão de fornecedor', [
            'user_class' => get_class($user),
            'user_id' => $user->id,
            'is_produtor' => $user->isProdutor ?? null,
            'tipo' => $user->tipo ?? null
        ]);
        
        // Verificação para Cliente
        if (get_class($user) === 'App\\Models\\Cliente') {
            // Corrigido: verifica se isProdutor é true (1, true, "1")
            if ($user->isProdutor == true || $user->isProdutor == 1 || $user->isProdutor == "1") {
                return $next($request); // É fornecedor, permite acesso
            }
            return redirect()->route('not-authorized');
        }
        // Verificação para User (se existir)
        elseif (get_class($user) === 'App\\Models\\User') {
            // Corrigido: verifica se tipo é "fornecedor" (case insensitive)
            if (strtolower($user->tipo) === 'fornecedor') {
                return $next($request); // É fornecedor, permite acesso
            }
            return redirect()->route('not-authorized');
        }
        else {
            // Log para casos não previstos
            Log::warning('Tipo de usuário não previsto no middleware VerificarFornecedor', [
                'user_class' => get_class($user)
            ]);
            
            return redirect()->route('not-authorized');
        }
    }
} 