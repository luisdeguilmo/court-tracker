<?php

namespace App\Http\Requests;

use App\Models\Folder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreFileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
     
        //  $folderId = $this->input('folder_id');
 
        // if ($folderId) {
        //     return Folder::where('id', $folderId)
        //         ->where('user_id', Auth::id())
        //         ->exists();
        // }
 
        // // Root-level upload — just needs to be authenticated
        // return Auth::check();

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file'      => ['required', 'file', 'max:102400'], // 100 MB max
            'folder_id' => ['nullable', 'integer', 'exists:folders,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file'     => 'The uploaded item is not a valid file.',
            'file.max'      => 'The file may not be larger than 100 MB.',
            'folder_id.exists' => 'The selected folder does not exist.',
        ];
    }
}
