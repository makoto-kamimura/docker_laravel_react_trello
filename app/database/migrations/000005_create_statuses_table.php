<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id()->comment('ステータスID'); // 主キー
            $table->string('name')->unique()->comment('ステータス名'); // ユニークなステータス名
            $table->integer('sort_order')->unique()->default(0)->comment('ソート順'); // ソート順を管理するカラム
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
};