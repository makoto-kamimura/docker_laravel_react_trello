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
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
};
