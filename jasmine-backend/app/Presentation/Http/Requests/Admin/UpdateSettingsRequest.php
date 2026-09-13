<?php

namespace App\Presentation\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'whatsapp_number'   => ['required', 'string', 'max:20'],
            'hero_title'        => ['nullable', 'string', 'max:200'],
            'hero_subtitle'     => ['nullable', 'string', 'max:500'],
            'hero_image'        => ['nullable', 'image', 'max:3072'],
            'store_name'        => ['nullable', 'string', 'max:100'],
            'store_description' => ['nullable', 'string'],
        ];
    }
}
