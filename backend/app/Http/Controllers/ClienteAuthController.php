<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ClienteAuthController extends Controller
{
    /**
     * Login de cliente
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        Log::info('Tentativa de login:', $request->only('email'));

        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'senha' => 'required|string',
        ], [
            'email.required' => 'O email é obrigatório',
            'email.email' => 'Informe um email válido',
            'senha.required' => 'A senha é obrigatória',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        // Encontrar o cliente pelo email
        $cliente = Cliente::where('email', $request->email)->first();
        
        if (!$cliente) {
            return response()->json([
                'message' => 'Credenciais inválidas',
                'error' => 'Email não encontrado'
            ], 401);
        }
        
        // Verificar a senha
        if (!Hash::check($request->senha, $cliente->senha)) {
            return response()->json([
                'message' => 'Credenciais inválidas',
                'error' => 'Senha incorreta'
            ], 401);
        }

        // Gerar token para autenticação via API
        $token = $cliente->createToken('auth_token')->plainTextToken;
        
        // Determinar URL de redirecionamento com base no tipo de usuário
        $redirectUrl = $cliente->isProdutor ? '/fornecedor/dashboard' : '/';

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'cliente' => [
                'id' => $cliente->id,
                'nome' => $cliente->nome_completo,
                'email' => $cliente->email,
                'tipo' => $cliente->isProdutor ? 'fornecedor' : 'cliente',
                'logado' => true
            ],
            'token' => $token,
            'redirect' => $redirectUrl
        ]);
    }

    /**
     * Obter dados do cliente autenticado
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function me(Request $request)
    {
        $cliente = $request->user();
        
        return response()->json([
            'id' => $cliente->id,
            'nome' => $cliente->nome_completo,
            'email' => $cliente->email,
            'tipo' => $cliente->isProdutor ? 'fornecedor' : 'cliente',
            'logado' => true
        ]);
    }

    /**
     * Logout de cliente
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
} 