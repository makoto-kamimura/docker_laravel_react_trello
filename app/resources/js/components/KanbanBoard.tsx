import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

interface Task {
    id: string;
    content: string;
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

    useEffect(() => {
        fetch('/api/tasks')
            .then(response => response.json())
            .then(data => setColumns(data.columns))
            .catch(error => console.error('Error fetching tasks:', error));
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
            destItems.splice(destination.index, 0, movedItem);
    
            const updatedColumns = {
                ...prevColumns,
                [source.droppableId]: { ...sourceColumn, items: sourceItems },
                [destination.droppableId]: { ...destColumn, items: destItems },
            };
    
            // API でステータスを更新
            fetch(`/api/tasks/${movedItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: destination.droppableId }),
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
            body: JSON.stringify({ content: newTask, status: "todo" })
        })
        .then(response => response.json())
        .then((newTaskObj) => {
            setColumns((prevColumns) => {
                const todoColumn = prevColumns["todo"] || { name: "To Do", items: [] };
                return {
                    ...prevColumns,
                    todo: {
                        ...todoColumn,
                        items: [...todoColumn.items, newTaskObj],
                    },
                };
            });

            setNewTask(""); // 入力欄をクリア
        })
        .catch(error => console.error('Error adding task:', error));
    };

    return (
        <div>
            {/* タスク追加フォーム */}
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

            {/* カンバンボード */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Droppable key={columnId} droppableId={columnId}>
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
