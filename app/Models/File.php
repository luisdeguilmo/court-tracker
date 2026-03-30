<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use SoftDeletes;
 
    protected $fillable = [
        'uploaded_by', 'folder_id', 'name', 'extension',
        'size', 'box_file_id', 'document_type', 'is_sealed',
    ];
 
    protected $casts = ['is_sealed' => 'boolean'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
 
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
 
    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
