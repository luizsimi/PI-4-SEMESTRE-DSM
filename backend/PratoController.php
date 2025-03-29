<?php

namespace App\Http\Controllers;

use App\Models\Prato;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PratoController extends Controller
{
    /**
     * Listar pratos com filtragem e paginação
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Prato::with('fornecedor');

        // Filtro por categoria
        if ($request->has('categoria') && $request->categoria) {
            $query->where('categoria', $request->categoria);
        }

        // Filtro por disponibilidade
        if ($request->has('disponivel')) {
            $disponivel = filter_var($request->disponivel, FILTER_VALIDATE_BOOLEAN);
            $query->where('disponivel', $disponivel);
        }

        // Filtro por fornecedor
        if ($request->has('fornecedor_id') && $request->fornecedor_id) {
            $query->where('fornecedor_id', $request->fornecedor_id);
        }

        // Pesquisa por nome ou descrição
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nome', 'like', '%' . $request->search . '%')
                  ->orWhere('descricao', 'like', '%' . $request->search . '%');
            });
        }

        // Ordenação
        $orderBy = $request->input('order_by', 'created_at');
        $orderDirection = $request->input('order_direction', 'desc');
        
        // Definir campos permitidos para ordenação
        $allowedOrderFields = ['nome', 'preco', 'created_at'];
        
        if (in_array($orderBy, $allowedOrderFields)) {
            $query->orderBy($orderBy, $orderDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginação
        $perPage = $request->input('per_page', 10);
        return response()->json($query->paginate($perPage));
    }

    /**
     * Armazenar um novo prato
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Verificar se o usuário é fornecedor
        if (!$request->user()->isFornecedor()) {
            return response()->json([
                'message' => 'Apenas fornecedores podem cadastrar pratos'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string',
            'preco' => 'required|numeric|min:0',
            'imagem' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'categoria' => ['required', Rule::in(Prato::getCategorias())],
            'calorias' => 'required|integer|min:0',
            'proteinas' => 'required|numeric|min:0',
            'carboidratos' => 'required|numeric|min:0',
            'gorduras' => 'required|numeric|min:0',
            'disponivel' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        // Upload da imagem
        $imagemPath = null;
        if ($request->hasFile('imagem')) {
            $imagem = $request->file('imagem');
            $imagemNome = time() . '.' . $imagem->getClientOriginalExtension();
            $imagemPath = $imagem->storeAs('pratos', $imagemNome, 'public');
        }

        // Criar o prato
        $prato = new Prato($request->except('imagem'));
        $prato->fornecedor_id = $request->user()->id;
        $prato->imagem = $imagemPath;
        $prato->save();

        return response()->json([
            'message' => 'Prato cadastrado com sucesso',
            'prato' => $prato
        ], 201);
    }

    /**
     * Mostrar detalhes de um prato específico
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $prato = Prato::with(['fornecedor', 'avaliacoes.user'])->findOrFail($id);
        
        // Adicionar a nota média nas informações do prato
        $prato->nota_media = $prato->notaMedia();
        
        return response()->json($prato);
    }

    /**
     * Atualizar um prato existente
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $prato = Prato::findOrFail($id);
        
        // Verificar se o usuário é o fornecedor do prato
        if ($request->user()->id !== $prato->fornecedor_id) {
            return response()->json([
                'message' => 'Você não tem permissão para editar este prato'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'sometimes|required|string',
            'preco' => 'sometimes|required|numeric|min:0',
            'imagem' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'categoria' => ['sometimes', 'required', Rule::in(Prato::getCategorias())],
            'calorias' => 'sometimes|required|integer|min:0',
            'proteinas' => 'sometimes|required|numeric|min:0',
            'carboidratos' => 'sometimes|required|numeric|min:0',
            'gorduras' => 'sometimes|required|numeric|min:0',
            'disponivel' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }

        // Upload da nova imagem se fornecida
        if ($request->hasFile('imagem')) {
            // Remover imagem antiga se existir
            if ($prato->imagem) {
                Storage::disk('public')->delete($prato->imagem);
            }
            
            // Upload da nova imagem
            $imagem = $request->file('imagem');
            $imagemNome = time() . '.' . $imagem->getClientOriginalExtension();
            $imagemPath = $imagem->storeAs('pratos', $imagemNome, 'public');
            
            // Atualizar caminho da imagem no request
            $request->merge(['imagem' => $imagemPath]);
        }

        // Atualizar o prato
        $prato->update($request->all());

        return response()->json([
            'message' => 'Prato atualizado com sucesso',
            'prato' => $prato
        ]);
    }

    /**
     * Remover um prato
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $prato = Prato::findOrFail($id);
        
        // Verificar se o usuário é o fornecedor do prato
        if ($request->user()->id !== $prato->fornecedor_id) {
            return response()->json([
                'message' => 'Você não tem permissão para excluir este prato'
            ], 403);
        }

        // Remover imagem se existir
        if ($prato->imagem) {
            Storage::disk('public')->delete($prato->imagem);
        }

        $prato->delete();

        return response()->json([
            'message' => 'Prato excluído com sucesso'
        ]);
    }
} 