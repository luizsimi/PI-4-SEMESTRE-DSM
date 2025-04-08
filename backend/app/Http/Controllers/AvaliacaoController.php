<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Prato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AvaliacaoController extends Controller
{
    /**
     * Listar todas as avaliações de um prato
     *
     * @param  int  $pratoId
     * @return \Illuminate\Http\Response
     */
    public function index($pratoId)
    {
        $prato = Prato::findOrFail($pratoId);
        $avaliacoes = $prato->avaliacoes()->with('user')->get();
        
        return response()->json($avaliacoes);
    }

    /**
     * Armazenar uma nova avaliação para um prato
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $pratoId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $pratoId)
    {
        // Verificar se o prato existe
        $prato = Prato::findOrFail($pratoId);
        
        $validator = Validator::make($request->all(), [
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Verificar se o usuário já avaliou este prato
        $userId = $request->user()->id;
        $avaliacaoExistente = Avaliacao::where('user_id', $userId)
                                      ->where('prato_id', $pratoId)
                                      ->first();
        
        if ($avaliacaoExistente) {
            return response()->json([
                'message' => 'Você já avaliou este prato anteriormente'
            ], 409);
        }
        
        // Criar a avaliação
        $avaliacao = new Avaliacao([
            'user_id' => $userId,
            'prato_id' => $pratoId,
            'nota' => $request->nota,
            'comentario' => $request->comentario,
        ]);
        
        $avaliacao->save();
        
        return response()->json([
            'message' => 'Avaliação registrada com sucesso',
            'avaliacao' => $avaliacao
        ], 201);
    }

    /**
     * Atualizar uma avaliação existente
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $avaliacao = Avaliacao::findOrFail($id);
        
        // Verificar se o usuário é o autor da avaliação
        if ($request->user()->id !== $avaliacao->user_id) {
            return response()->json([
                'message' => 'Você não tem permissão para editar esta avaliação'
            ], 403);
        }
        
        $validator = Validator::make($request->all(), [
            'nota' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422);
        }
        
        // Atualizar a avaliação
        $avaliacao->update([
            'nota' => $request->nota,
            'comentario' => $request->comentario,
        ]);
        
        return response()->json([
            'message' => 'Avaliação atualizada com sucesso',
            'avaliacao' => $avaliacao
        ]);
    }

    /**
     * Remover uma avaliação
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $avaliacao = Avaliacao::findOrFail($id);
        
        // Verificar se o usuário é o autor da avaliação
        if ($request->user()->id !== $avaliacao->user_id) {
            return response()->json([
                'message' => 'Você não tem permissão para excluir esta avaliação'
            ], 403);
        }
        
        $avaliacao->delete();
        
        return response()->json([
            'message' => 'Avaliação excluída com sucesso'
        ]);
    }
} 