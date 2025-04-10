<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avaliacao extends Model
{
    use HasFactory;
    
    /**
     * Nome da tabela
     *
     * @var string
     */
    protected $table = 'avaliacoes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'prato_id',
        'nota',
        'comentario',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'nota' => 'integer',
    ];

    /**
     * Get the user that owns the avaliacao.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the prato that owns the avaliacao.
     */
    public function prato()
    {
        return $this->belongsTo(Prato::class);
    }

    /**
     * Verifica se a avaliação pertence a um usuário específico.
     *
     * @param int $userId
     * @return bool
     */
    public function pertenceAoUsuario($userId)
    {
        return $this->user_id == $userId;
    }

    /**
     * Verifica se a nota está dentro do intervalo válido (1-5).
     *
     * @param int $nota
     * @return bool
     */
    public static function notaValida($nota)
    {
        return $nota >= 1 && $nota <= 5;
    }
} 