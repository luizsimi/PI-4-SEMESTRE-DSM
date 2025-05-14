<?php

namespace App\Http\Controllers;

use App\Models\Prato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PratoController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Dados recebidos para novo prato:', $request->all());

            $mensagens = [
                'required' => 'O campo :attribute é obrigatório.',
                'string' => 'O campo :attribute deve ser um texto.',
                'numeric' => 'O campo :attribute deve ser numérico.',
                'min' => 'O campo :attribute deve ser no mínimo :min.',
                'max' => 'O campo :attribute não pode ter mais que :max.',
                'in' => 'O valor selecionado para :attribute é inválido.',
                'image' => 'O campo :attribute deve ser uma imagem.',
                'mimes' => 'A imagem deve estar no formato: :values.',
                'exists' => 'O :attribute informado é inválido.'
            ];

            $atributos = [
                'nome' => 'nome do prato',
                'descricao' => 'descrição',
                'preco' => 'preço',
                'categoria' => 'categoria',
                'foto' => 'foto',
                'calorias' => 'calorias',
                'proteinas' => 'proteínas',
                'carboidratos' => 'carboidratos',
                'gorduras' => 'gorduras',
                'cliente_id' => 'cliente',
            ];

            $validator = Validator::make($request->all(), [
                'nome' => 'required|string|max:255',
                'descricao' => 'required|string',
                'preco' => 'required|numeric|min:0',
                'categoria' => 'required|string|in:LOWcarb,vegetariano,vegano,proteico,fitness,detox',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'calorias' => 'required|numeric|min:0',
                'proteinas' => 'required|numeric|min:0',
                'carboidratos' => 'required|numeric|min:0',
                'gorduras' => 'required|numeric|min:0',
                'cliente_id' => 'required|exists:clientes,id',
            ], $mensagens, $atributos);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            if ($request->hasFile('foto')) {
                $path = $request->file('foto')->store('pratos', 'public');
                $validated['foto'] = $path;
            }

            $prato = Prato::create($validated);

            Log::info('Prato criado com sucesso:', ['id' => $prato->id]);

            return response()->json([
                'message' => 'Prato cadastrado com sucesso!',
                'prato' => $prato
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erro ao criar prato:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Erro ao cadastrar prato',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}