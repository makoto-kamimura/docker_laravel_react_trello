<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Status;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('status')->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:255',
            'status_id' => 'required|exists:statuses,id'
        ]);

        $task = Task::create([
            'content' => $request->content,
            'status_id' => $request->status_id
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, $id)
    {
        // タスクIDを使って、タスクをデータベースから取得
        $task = Task::findOrFail($id); // タスクが見つからなければ404を返す
    
        $request->validate([
            'status_id' => 'required|exists:statuses,id'
        ]);
    
        $task->update([
            'status_id' => $request->status_id
        ]);
    
        return response()->json($task);
    }    
    
}
