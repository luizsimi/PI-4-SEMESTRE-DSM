<?php

namespace App\Http\Controllers;
use App\Models\Cliente;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClienteController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Dados recebidos:', $request->all());
            
            // Mensagens de erro personalizadas
            $mensagens = [
                'required' => 'O campo :attribute é obrigatório.',
                'string' => 'O campo :attribute deve ser um texto.',
                'max' => 'O campo :attribute não pode ter mais que :max caracteres.',
                'min' => 'O campo :attribute deve ter pelo menos :min caracteres.',
                'email' => 'O email informado não é válido.',
                'unique' => 'Este :attribute já está sendo usado.',
                'date' => 'A data informada não é válida.',
                'confirmed' => 'A confirmação de senha não corresponde.',
                'accepted' => 'Você precisa aceitar os :attribute.',
                'in' => 'O valor selecionado é inválido.',
                'required_if' => 'Este campo é obrigatório para fornecedores.',
            ];
            
            // Nomes mais amigáveis para os campos
            $atributos = [
                'nome_completo' => 'nome completo',
                'cpf' => 'CPF',
                'telefone' => 'telefone',
                'email' => 'e-mail',
                'data_nascimento' => 'data de nascimento',
                'cep' => 'CEP',
                'rua' => 'rua',
                'numero' => 'número',
                'complemento' => 'complemento',
                'bairro' => 'bairro',
                'cidade' => 'cidade',
                'estado' => 'estado',
                'senha' => 'senha',
                'termos_uso' => 'termos de uso',
                'politica_privacidade' => 'política de privacidade',
                'tipoUsuario' => 'tipo de usuário',
                'numero_cartao' => 'número do cartão',
                'nome_titular' => 'nome do titular',
                'validade_cartao' => 'validade do cartão',
                'cvv' => 'código de segurança',
            ];
            
            $validator = Validator::make($request->all(), [
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
        
                // Parte 4 (apenas para fornecedor)
                'numero_cartao' => 'nullable|required_if:tipoUsuario,fornecedor|string',
                'nome_titular' => 'nullable|required_if:tipoUsuario,fornecedor|string',
                'validade_cartao' => 'nullable|required_if:tipoUsuario,fornecedor|string',
                'cvv' => 'nullable|required_if:tipoUsuario,fornecedor|string|max:4',
            ], $mensagens, $atributos);
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $validated = $validator->validated();
        
            $validated['isProdutor'] = $validated['tipoUsuario'] === 'fornecedor';
            unset($validated['tipoUsuario']);
        
            $cliente = Cliente::create($validated);
            
            Log::info('Cliente criado com sucesso:', ['id' => $cliente->id]);

            return response()->json([
                'message' => 'Cadastro realizado com sucesso!',
                'cliente' => $cliente
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erro de validação:', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erro ao criar cliente:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Erro ao cadastrar cliente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
