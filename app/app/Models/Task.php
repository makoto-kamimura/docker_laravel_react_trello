<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Task extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'status_id', 'description', 'due_date', 'completed_at'];

    // モデルの作成イベント
    protected static function booted()
    {
        parent::booted();

        static::creating(function ($task) {
            // `due_date` が指定されていない場合に、3日後を設定
            if (!$task->due_date) {
                $task->due_date = Carbon::now()->addDays(3);
            }
        });
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
