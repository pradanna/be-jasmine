<?php

namespace App\Presentation\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:200'],
            'description'    => ['nullable', 'string'],
            'base_price'     => ['required', 'numeric', 'min:0'],
            'stock_status'   => ['required', 'in:available,out_of_stock,pre_order'],
            'preorder_days'  => ['nullable', 'integer', 'min:1', 'max:90'],
            'category_id'    => ['required', 'exists:categories,id'],
            'is_active'      => ['boolean'],
            'is_featured'    => ['boolean'],
            'new_images'     => ['nullable', 'array'],
            'new_images.*'   => ['image', 'max:2048'],
            'delete_image_ids' => ['nullable', 'array'],
            'delete_image_ids.*' => ['integer'],
            'primary_image_id'   => ['nullable', 'integer'],
            'variants'       => ['nullable', 'array'],
            'variants.*.id'   => ['nullable', 'integer'],
            'variants.*.label'          => ['required_with:variants', 'string', 'max:100'],
            'variants.*.price'          => ['nullable', 'numeric', 'min:0'],
            'variants.*.price_modifier' => ['nullable', 'numeric'],
        ];
    }
}
