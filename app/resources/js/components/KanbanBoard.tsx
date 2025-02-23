import React, { useState, useEffect } from 'react';
import { CheckCircle, Edit } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';

interface Task {
    id: string;
    content: string;
    status_id: string;
    status: { id: string, name: string };
    description?: string;
    due_date?: string;
    completed_at?: string; 
}

interface Column {
    name: string;
    items: Task[];
}

interface Columns {
    [key: string]: Column;
}

interface KanbanBoardProps {
    isSelectionMode: boolean;
    searchQuery: string; 
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isSelectionMode, searchQuery }) => {
    const [columns, setColumns] = useState<Columns>({});
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

    useEffect(() => {
        Promise.all([
            fetch('/api/tasks').then(response => response.json()),
            fetch('/api/statuses').then(response => response.json())
        ])
        .then(([tasksData, statusesData]) => {
            const statusMap = statusesData.reduce((acc: { [key: string]: string }, status: { id: string, name: string }) => {
                acc[status.id] = status.name;
                return acc;
            }, {});

            const initialColumns: Columns = {};
            statusesData.forEach((status: { id: string, name: string }) => {
                initialColumns[status.id] = {
                    name: status.name,
                    items: tasksData.filter((task: Task) => String(task.status_id) === String(status.id))
                };
            });

            setColumns(initialColumns);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // 同じステータスにドラッグされた場合は何もしない
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        setColumns((prevColumns) => {
            const sourceColumn = prevColumns[source.droppableId];
            const destColumn = prevColumns[destination.droppableId];

            if (!sourceColumn || !destColumn) return prevColumns;

            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];

            const [movedItem] = sourceItems.splice(source.index, 1);
            movedItem.status = { id: destination.droppableId, name: destColumn.name };

            destItems.splice(destination.index, 0, movedItem);

            const updatedColumns = {
                ...prevColumns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            };

            fetch(`/api/tasks/${movedItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_id: destination.droppableId }),
            })
            .then(response => response.json())
            .catch(error => console.error('Error updating task status:', error));

            return updatedColumns;
        });
    };

    const addTask = () => {
        if (!newTask.trim()) return;

        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newTask, status_id: 1 })
        })
        .then(response => response.json())
        .then((newTaskObj) => {
            setColumns((prevColumns) => {
                const todoColumn = prevColumns[1] || { name: 1, items: [] };
                return {
                    ...prevColumns,
                    1: {
                        ...todoColumn,
                        items: [...todoColumn.items, newTaskObj],
                    },
                };
            });

            setNewTask("");
        })
        .catch(error => console.error('Error adding task:', error));
    };

    const addStatus = () => {
        if (!newStatus.trim()) return;

        fetch('/api/statuses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newStatus }),
        })
        .then(response => response.json())
        .then((newStatusObj) => {
            setColumns((prevColumns) => ({
                ...prevColumns,
                [newStatusObj.id]: { name: newStatusObj.name, items: [] },
            }));

            setNewStatus("");
        })
        .catch(error => console.error('Error adding status:', error));
    };

    const updateStatusName = (columnId: string, newName: string) => {
        if (!newName.trim()) return;
    
        fetch(`/api/statuses/${columnId}/name`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName }),
        })
        .then(response => response.json())
        .then(updatedStatus => {
            setColumns(prevColumns => ({
                ...prevColumns,
                [columnId]: {
                    ...prevColumns[columnId],
                    name: updatedStatus.name,
                },
            }));
        })
        .catch(error => console.error('Error updating status name:', error));
    };    

    const saveTaskDetails = () => {
        if (selectedTask && selectedTask.id) {
            const taskData = {
                content: selectedTask.content,
                description: selectedTask.description,
                due_date: selectedTask.due_date || null,
                completed_at: selectedTask.completed_at 
                    ? new Date(selectedTask.completed_at).toISOString().slice(0, 19).replace('T', ' ') 
                    : null, // "YYYY-MM-DD HH:MM:SS" に変換
            };
    
            console.log('Sending data:', taskData); // ログで確認
    
            fetch(`/api/tasks/${selectedTask.id}/details`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Task updated:', data);
    
                // Kanban の状態を更新
                setColumns(prevColumns => {
                    const updatedColumns = { ...prevColumns };
                    for (const columnId in updatedColumns) {
                        updatedColumns[columnId].items = updatedColumns[columnId].items.map(task =>
                            task.id === data.id ? { ...task, content: data.content, description: data.description } : task
                        );
                    }
                    return updatedColumns;
                });
    
                closeModal(); // 保存後にモーダルを閉じる
            })
            .catch(error => console.error('Error updating task:', error));
        }
    };

    const handleTaskSelection = (taskId: string) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const handleStatusSelection = (statusId: string) => {
        setSelectedStatuses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(statusId)) {
                newSet.delete(statusId);
            } else {
                newSet.add(statusId);
            }
            return newSet;
        });
    };
    
    const openModal = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);

        // 詳細情報を取得
        fetch(`/api/tasks/${task.id}`)
            .then(response => response.json())
            .then(data => {
                setSelectedTask(prevState => {
                    if (prevState) {
                        return { ...prevState, description: data.description }; // 詳細情報を更新
                    }
                    return prevState;
                });
            })
            .catch(error => console.error('Error fetching task details:', error));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const filteredColumns = Object.entries(columns).reduce((acc: Columns, [columnId, column]) => {
        const filteredItems = column.items.filter(item => item.content.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filteredItems.length > 0) {
            acc[columnId] = { ...column, items: filteredItems };
        }
        return acc;
    }, {});

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '16px' }}>
                {Object.entries(filteredColumns).map(([columnId, column]) => (
                    <Droppable key={columnId} droppableId={String(columnId)}>
                        {(provided, snapshot) => {
                            const [isEditing, setIsEditing] = useState(false);
                            const [statusName, setStatusName] = useState(column.name);

                            return (
                                <div 
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps} 
                                    style={{ 
                                        padding: 16, 
                                        background: snapshot.isDraggingOver ? '#d3d3d3' : '#f4f4f4',
                                        borderRadius: 8, 
                                        width: 250,
                                        minHeight: 200
                                    }}
                                >
                                    {/* ステータスのチェックボックス */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        {/* <h3>{column.name}</h3> */}
                                        {isSelectionMode && (
                                            <input 
                                                type="checkbox"
                                                checked={selectedStatuses.has(columnId)}
                                                onChange={() => handleStatusSelection(columnId)}
                                            />
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="text"
                                                value={statusName}
                                                onChange={(e) => setStatusName(e.target.value)}
                                                style={{ padding: "4px", flexGrow: 1 }}
                                            />
                                            <button onClick={() => {
                                                updateStatusName(columnId, statusName);
                                                setIsEditing(false);
                                            }} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                                                <SaveIcon />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h3>{column.name}</h3>
                                            <button onClick={() => setIsEditing(true)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                                                <Edit />
                                            </button>
                                        </div>
                                    )}

                                    {column.items.map((item, index) => (
                                        <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.draggableProps} 
                                                    {...provided.dragHandleProps} 
                                                    style={{
                                                        padding: 10,
                                                        margin: '0 0 10px 0',
                                                        background: snapshot.isDragging ? '#e0e0e0' : 'white',
                                                        borderRadius: 4,
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                        cursor: 'pointer',
                                                        ...provided.draggableProps.style
                                                    }}
                                                    onClick={() => openModal(item)} 
                                                >
                                                    {/* タスクのチェックボックス */}
                                                    {isSelectionMode && (
                                                        <input 
                                                            type="checkbox"
                                                            checked={selectedTasks.has(item.id)}
                                                            onChange={() => handleTaskSelection(item.id)}
                                                        />
                                                    )}

                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder} 
                                </div>
                            );
                        }}
                    </Droppable>
                ))}
                </div>
            </DragDropContext>

            <TaskModal 
                isOpen={isModalOpen} 
                task={selectedTask} 
                onClose={closeModal} 
                onSave={saveTaskDetails} 
                setTask={setSelectedTask} 
            />
        </div>
    );
}

export default KanbanBoard;