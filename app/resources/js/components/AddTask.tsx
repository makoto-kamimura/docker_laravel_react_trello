import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { Column } from './types'; // ここでColumn型をインポート

interface AddTaskProps {
    statusId: string;
    addTask: (statusId: string, taskContent: string) => void;
    setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
}

const AddTask: React.FC<AddTaskProps> = ({ statusId, addTask, setColumns }) => {
    const [newTaskContent, setNewTaskContent] = useState("");

    const handleAddTask = () => {
        if (!newTaskContent.trim()) return;

        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newTaskContent, status_id: statusId })
        })
        .then(response => response.json())
        .then((newTaskObj) => {
            setColumns(prevColumns => {
                const updatedColumn = prevColumns[statusId] || { name: 'To Do', items: [] };
                return {
                    ...prevColumns,
                    [statusId]: {
                        ...updatedColumn,
                        items: [...updatedColumn.items, newTaskObj],
                    },
                };
            });

            setNewTaskContent('');
        })
        .catch(error => console.error('Error adding task:', error));
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
            <input
                type="text"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="新しいタスク"
                style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    flexGrow: 1,
                    fontSize: "16px",
                }}
            />
            <button onClick={handleAddTask} style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
            }}>
                <SaveIcon />
            </button>
        </div>
    );
};

export default AddTask;