<?php

namespace App\Http\Controllers;
use App\Models\Cliente;

use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Parte 1
            'nome_completo' => 'required|string|max:255',
            'cpf' => 'required|string|max:14|unique:clientes',
            'telefone' => 'required|string|max:15',
            'email' => 'required|email|unique:clientes',
            'data_nascimento' => 'required|date',
    
            // Parte 2 
            'cep' => 'required|string|max:9',
            'rua' => 'required|string|max:255',
            'numero' => 'required|string|max:10',
            'complemento' => 'nullable|string|max:255',
            'bairro' => 'required|string|max:100',
            'cidade' => 'required|string|max:100',
            'estado' => 'required|string|max:2',
    
            // Parte 3 
            'senha' => 'required|string|min:8|confirmed',
            'termos_uso' => 'accepted',
            'politica_privacidade' => 'accepted',
            'tipoUsuario' => 'required|string|in:cliente,fornecedor',
    
            // Parte 5 
            'numero_cartao' => 'nullable|required_if:tipoUsuario,fornecedor|string',
            'nome_titular' => 'nullable|required_if:tipoUsuario,fornecedor|string',
            'validade_cartao' => 'nullable|required_if:tipoUsuario,fornecedor|string',
            'cvv' => 'nullable|required_if:tipoUsuario,fornecedor|string|max:4',
        ]);
    
       
        $validated['isProdutor'] = $validated['tipoUsuario'] === 'fornecedor';
        unset($validated['tipoUsuario']);
    
        
        Cliente::create($validated);

    

    return redirect()->back()->with('sucess', 'Cadastro realizado com sucesso! cheque seu e-mail otário');
} 
}
