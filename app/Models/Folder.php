<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Folder extends Model
{
    use SoftDeletes;
 
    protected $fillable = [
        'user_id', 'folder_type_id', 'name',
        'case_number', 'case_title', 'case_status', 'box_folder_id', 'parent_id'
    ];
 
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
 
    public function folderType(): BelongsTo
    {
        return $this->belongsTo(FolderType::class);
    }
 
    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    public function subfolders(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }
}
