<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prato extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descricao',
        'preco',
        'categoria',
        'foto',
        'calorias',
        'proteinas',
        'carboidratos',
        'gorduras',
        'cliente_id',
    ];

    protected $casts = [
        'preco' => 'float',
        'calorias' => 'float',
        'proteinas' => 'float',
        'carboidratos' => 'float',
        'gorduras' => 'float',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
} 