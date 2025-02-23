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

    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
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

        public function delete(int $id): JsonResponse
    {
        $this->taskService->delete($id);

        return response()->json([
            'success' => true,
            'message' => "Task deleted successfully.",
        ], 201);
    }

    public function destroy($id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }

    public function updateDetail(Request $request, $id)
    {
        Log::info('Request Data:', $request->all()); // リクエスト内容をログに出力
    
        $task = Task::findOrFail($id);
        
        // content と description の両方を更新
        $task->update($request->only(['content', 'description', 'due_date', 'completed_at']));
        // $task->update([
        //     'content' => $request->content,
        //     'description' => $request->description,
        //     'due_date' => $request->due_date,
        //     'completed_at' => $request->completed_at ? Carbon::parse($request->completed_at)->format('Y-m-d H:i:s') : null,
        // ]);
        
    
        Log::info('Updated Task:', $task->toArray()); // 更新されたタスクをログに出力
    
        return response()->json($task);
    }

    public function updateStatusName(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $status = Status::findOrFail($id);
        $status->update(['name' => $request->name]);

        return response()->json($status);
    }

    

}
