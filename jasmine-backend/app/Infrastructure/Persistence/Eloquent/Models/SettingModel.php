<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

class SettingModel extends Model
{
    protected $table = 'settings';
    protected $primaryKey = 'key';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['key', 'value'];
}
