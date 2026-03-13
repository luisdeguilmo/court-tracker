<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FolderType extends Model
{
    protected $fillable = ['name'];


    public function folders()
    {
        return $this->hasMany(Folder::class);
    }
}
