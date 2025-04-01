<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prato extends Model
{
    use HasFactory;

    // Constantes para categorias
    const CATEGORIA_LOWCARB = 'lowcarb';
    const CATEGORIA_VEGETARIANO = 'vegetariano';
    const CATEGORIA_VEGANO = 'vegano';
    const CATEGORIA_PROTEICO = 'proteico';
    const CATEGORIA_FITNESS = 'fitness';
    const CATEGORIA_DETOX = 'detox';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fornecedor_id',
        'nome',
        'descricao',
        'preco',
        'imagem',
        'categoria',
        'calorias',
        'proteinas',
        'carboidratos',
        'gorduras',
        'disponivel'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'preco' => 'decimal:2',
        'calorias' => 'integer',
        'proteinas' => 'decimal:1',
        'carboidratos' => 'decimal:1',
        'gorduras' => 'decimal:1',
        'disponivel' => 'boolean',
    ];

    /**
     * Get the fornecedor that owns the prato.
     */
    public function fornecedor()
    {
        return $this->belongsTo(User::class, 'fornecedor_id');
    }

    /**
     * Get the avaliacoes for the prato.
     */
    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class);
    }

    /**
     * Calcula a média das avaliações do prato.
     *
     * @return float
     */
    public function notaMedia()
    {
        $avaliacoes = $this->avaliacoes;
        if ($avaliacoes->isEmpty()) {
            return 0;
        }
        
        return round($avaliacoes->avg('nota'), 1);
    }
    
    /**
     * Verifica se o prato pertence a um fornecedor específico.
     *
     * @param int $fornecedorId
     * @return bool
     */
    public function pertenceAoFornecedor($fornecedorId)
    {
        return $this->fornecedor_id == $fornecedorId;
    }

    /**
     * Obtém todas as categorias possíveis.
     *
     * @return array
     */
    public static function getCategorias()
    {
        return [
            self::CATEGORIA_LOWCARB,
            self::CATEGORIA_VEGETARIANO,
            self::CATEGORIA_VEGANO,
            self::CATEGORIA_PROTEICO,
            self::CATEGORIA_FITNESS,
            self::CATEGORIA_DETOX,
        ];
    }
} 