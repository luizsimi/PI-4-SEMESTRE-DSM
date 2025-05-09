<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Cliente extends Authenticatable
{
    use Notifiable, HasApiTokens;

    protected $fillable = [
        //Parte1
        'nome_completo',
        'cpf',
        'telefone',
        'email',
        'data_nascimento',

        //Parte2
        'cep',
        'rua',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
      
        //Parte3
        'senha',
        'termos_uso',
        'politica_privacidade',
        'isProdutor',

        //Parte4-Produtor
        'numero_cartao',
        'nome_titular',
        'validade_cartao',
        'cvv'
    ];

    protected $hidden = [
        'senha',
    ];

    protected $casts = [
        'termos_uso' => 'boolean',
        'politica_privacidade' => 'boolean',
        'isProdutor' => 'boolean',
    ];

    // não muda o nome dessa função, essa bosta é built-in no laravel.
    public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = bcrypt($value);
    }

    /**
     * Configure o nome do campo senha para auth
     */
    public function getAuthPassword()
    {
        return $this->senha;
    }
}