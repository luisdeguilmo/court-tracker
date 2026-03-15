<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFolderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name'           => ['required', 'string', 'max:255'],
            // 'case_number'    => ['nullable', 'string', 'max:100'],
            // 'case_title'     => ['nullable', 'string', 'max:255'],
            // 'case_status'    => ['nullable', 'string', 'max:100'],
            'folder_type_id' => ['nullable', 'integer', 'exists:folder_types,id'],
            'box_parent_id'  => ['nullable', 'string'], // Box parent folder ID; defaults to root
        ];
    }
}
