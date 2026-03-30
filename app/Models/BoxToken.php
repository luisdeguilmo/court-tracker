<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoxToken extends Model
{
    // protected $fillable = [
    //     'access_token',
    //     'refresh_token',
    //     'expires_at'
    // ];

    // protected $casts = [
    //     'expires_at' => 'datetime',
    //     'access_token' => 'encrypted',
    //     'refresh_token' => 'encrypted',
    // ];

    protected $fillable = [
        'user_id',
        'access_token',
        'refresh_token',
        'expires_at',
    ];

    protected $casts = [
        // 'access_token' => 'encrypted',
        // 'refresh_token' => 'encrypted',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return now()->gte($this->expires_at);
    }
}
