<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id()->comment('タスクID'); // 主キー
            $table->string('content')->comment('タスクの内容'); // タスクのタイトル
            $table->text('description')->nullable()->comment('タスクの詳細説明'); // 任意の詳細説明
            $table->date('due_date')->comment('タスクの期限日'); // 締切日
            $table->timestamp('completed_at')->nullable()->comment('タスクの完了日時'); // いつ完了したか
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
