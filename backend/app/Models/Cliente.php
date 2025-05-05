<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Cliente extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'nome_completo',
        'cpf',
        'telefone',
        'email',
        'data_nascimento',
        'endereco',
        'senha',
        'isProdutor',
    ];

    protected $hidden = [
        'senha',
    ];

    // não muda o nome dessa função, essa bosta é built-in no laravel.
    public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = bcrypt($value);
    }
}