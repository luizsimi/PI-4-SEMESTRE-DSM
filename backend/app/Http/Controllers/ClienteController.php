<?php

namespace App\Http\Controllers;
use App\Models\Cliente;

use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'nome_completo' => 'required|string|max:255',
        'cpf' => 'required|string|max:14|unique:clientes',
        'telefone' => 'required|string|max:15',
        'email' => 'required|email|unique:clientes',
        'data_nascimento' => 'required|date',
        'endereco' => 'required|string|max:255',
        'senha' => 'required|string|min:8',
        'isProdutor' => 'boolean',
    ]);

    $validated['isProdutor'] = $validated['tipoUsuario'] === 'fornecedor';
    unset($validated['tipoUsuario']); 


    Cliente::create($validated);

    return redirect()->back()->with('sucess', 'Cadastro realizado com sucesso! cheque seu e-mail otário');
} 
}
