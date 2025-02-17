import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

interface Task {
    id: string;
    content: string;
    status_id: string; // ← 追加
    status: { id: string, name: string }; // ← ステータス情報をオブジェクトとして持つ
}

interface Column {
    name: string;
    items: Task[];
}

interface Columns {
    [key: string]: Column;
}

function KanbanBoard() {
    const [columns, setColumns] = useState<Columns>({});
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        Promise.all([
            fetch('/api/tasks').then(response => response.json()),
            fetch('/api/statuses').then(response => response.json())
        ])
        .then(([tasksData, statusesData]) => {
            console.log("Tasks:", tasksData);
            console.log("Statuses:", statusesData);
    
            const statusMap = statusesData.reduce((acc: { [key: string]: string }, status: { id: string, name: string }) => {
                acc[status.id] = status.name;
                return acc;
            }, {});
    
            console.log("Status Map:", statusMap);
    
            const initialColumns: Columns = {};
            statusesData.forEach((status: { id: string, name: string }) => {
                initialColumns[status.id] = {
                    name: status.name,
                    items: tasksData.filter((task: Task) => String(task.status_id) === String(status.id))
                };
            });
    
            console.log("Initial Columns:", initialColumns);
            setColumns(initialColumns);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);
    

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
    
        const { source, destination } = result;
    
        setColumns((prevColumns) => {
            const sourceColumn = prevColumns[source.droppableId];
            const destColumn = prevColumns[destination.droppableId];
    
            if (!sourceColumn || !destColumn) return prevColumns;
    
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
    
            const [movedItem] = sourceItems.splice(source.index, 1);
            movedItem.status = { id: destination.droppableId, name: destColumn.name }; // ← 修正
    
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
            .then(data => console.log('Updated:', data))
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
                [newStatusObj.name]: { name: newStatusObj.name, items: [] },
            }));

            setNewStatus("");
        })
        .catch(error => console.error('Error adding status:', error));
    };

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <input 
                    type="text" 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)} 
                    placeholder="新しいステータスを入力..."
                    style={{ padding: 8, marginRight: 8 }}
                />
                <button onClick={addStatus} style={{ padding: 8 }}>ステータス追加</button>
            </div>

            <div style={{ marginBottom: 20 }}>
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="新しいタスクを入力..."
                    style={{ padding: 8, marginRight: 8 }}
                />
                <button onClick={addTask} style={{ padding: 8 }}>追加</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Droppable key={columnId} droppableId={String(columnId)}>
                            {(provided, snapshot) => (
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
                                    <h3>{column.name}</h3>
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
                                                        ...provided.draggableProps.style
                                                    }}
                                                >
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder} 
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

export default KanbanBoard;

if (document.getElementById('kanban-board')) {
    ReactDOM.render(<KanbanBoard />, document.getElementById('kanban-board'));
}
