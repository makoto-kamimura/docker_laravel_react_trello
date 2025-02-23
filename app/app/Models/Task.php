<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'status_id', 'description', 'due_date', 'completed_at'];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}