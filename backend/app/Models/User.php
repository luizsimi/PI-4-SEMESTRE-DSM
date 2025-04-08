<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Constantes para tipo de usuário
    const TIPO_CLIENTE = 'cliente';
    const TIPO_FORNECEDOR = 'fornecedor';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nome',
        'email',
        'senha',
        'cpf',
        'telefone',
        'data_nascimento',
        'cep',
        'rua',
        'numero',
        'complemento',
        'tipo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'senha',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'data_nascimento' => 'date',
    ];

    /**
     * Get the pratos for the fornecedor.
     */
    public function pratos()
    {
        return $this->hasMany(Prato::class, 'fornecedor_id');
    }

    /**
     * Get the avaliacoes for the user.
     */
    public function avaliacoes()
    {
        return $this->hasMany(Avaliacao::class);
    }

    /**
     * Verifica se o usuário é fornecedor.
     *
     * @return bool
     */
    public function isFornecedor()
    {
        return $this->tipo === self::TIPO_FORNECEDOR;
    }

    /**
     * Verifica se o usuário é cliente.
     *
     * @return bool
     */
    public function isCliente()
    {
        return $this->tipo === self::TIPO_CLIENTE;
    }

    /**
     * Modifica o campo senha para utilizar hash automaticamente.
     *
     * @param  string  $value
     * @return void
     */
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