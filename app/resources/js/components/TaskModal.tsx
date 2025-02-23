import React from 'react';
import SaveIcon from '@mui/icons-material/Save';

interface Task {
    id: string;
    content: string;
    status_id: string;
    status: { id: string, name: string };
    description?: string;
    due_date?: string;
    completed_at?: string; 
}

interface TaskModalProps {
    isOpen: boolean;
    task: Task | null;
    onClose: () => void;
    onSave: () => void;
    setTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, task, onClose, onSave, setTask }) => {
    if (!isOpen || !task) return null;

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return ''; 
        return new Date(dateString).toISOString().split('T')[0]; 
    };

    return (
        <div>
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: 'white', padding: '20px', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', zIndex: 1000, width: '500px'
            }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <button onClick={onClose} style={{ fontSize: '20px', background: 'transparent', border: 'none' }}>×</button>
                </div>
                <h2>タスク詳細</h2>
                <p><strong>ステータス:</strong> {task.status.name}</p>

                <div>
                    <strong>タスク名:</strong>
                    <textarea 
                        value={task.content} 
                        onChange={(e) => {
                            setTask(prevTask => prevTask ? { ...prevTask, content: e.target.value } : prevTask);
                        }}
                        rows={1} 
                        style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <strong>詳細情報:</strong>
                    <textarea 
                        value={task.description || ""} 
                        onChange={(e) => {
                            setTask(prevTask => prevTask ? { ...prevTask, description: e.target.value } : prevTask);
                        }}
                        rows={5} 
                        style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <strong>期限日:</strong>
                    <input
                        type="date"
                        value={task.due_date || ""}
                        onChange={(e) => {
                            setTask(prevTask => prevTask ? { ...prevTask, due_date: e.target.value } : prevTask);
                        }}
                        style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <strong>完了:</strong>
                    <input
                        type="checkbox"
                        checked={!!task.completed_at}
                        onChange={(e) => {
                            setTask(prevTask => prevTask ? { 
                                ...prevTask, 
                                completed_at: e.target.checked ? new Date().toISOString().split('T')[0] : "" 
                            } : prevTask);
                        }}
                    />

                    {task.completed_at && (
                        <input
                            type="date"
                            value={formatDate(task.completed_at)}
                            style={{ width: '85%', marginTop: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    )}
                </div>

                <button onClick={onSave} style={{ marginTop: '10px' }}>
                    <SaveIcon />
                </button>
            </div>
            <div onClick={onClose} style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999
            }}></div>
        </div>
    );
};

export default TaskModal;