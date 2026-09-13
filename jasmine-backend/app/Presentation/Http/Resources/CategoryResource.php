<?php

namespace App\Presentation\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this['id'] ?? $this->id,
            'name'        => $this['name'] ?? $this->name,
            'slug'        => $this['slug'] ?? $this->slug,
            'description' => $this['description'] ?? $this->description,
            'is_active'   => $this['is_active'] ?? $this->is_active,
        ];
    }
}
