import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import TaskModal from './TaskModal';
import AddStatus from './AddStatus';
import StatusColumn from './StatusColumn';
import { Columns, Task } from './types';

interface KanbanBoardProps {
    isSelectionMode: boolean;
    searchQuery: string;
    showCompleted: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ isSelectionMode, searchQuery, showCompleted }) => {
    const [columns, setColumns] = useState<Columns>({});
    const [columnsOrder, setColumnsOrder] = useState<string[]>([]);
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
            const initialColumns: Columns = {};
            const initialColumnsOrder: string[] = [];
            statusesData.forEach((status: { id: string, name: string }) => {
                initialColumns[status.id] = {
                    name: status.name,
                    items: tasksData.filter((task: Task) => String(task.status_id) === String(status.id))
                };
                initialColumnsOrder.push(status.id);
            });

            setColumns(initialColumns);
            setColumnsOrder(initialColumnsOrder);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // ドロップ先がない場合は何もしない
        if (!destination) return;

        // ステータスの順序を変更する場合
        if (result.type === 'COLUMN') {
            const newColumnsOrder = Array.from(columnsOrder);
            const [removed] = newColumnsOrder.splice(source.index, 1);
            newColumnsOrder.splice(destination.index, 0, removed);

            setColumnsOrder(newColumnsOrder);
            return;
        }

        // タスクの順序を変更する場合
        if (source.droppableId !== destination.droppableId) {
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
        }
    };

    const addTask = (statusId: string, taskContent: string) => {
        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: taskContent, status_id: statusId })
        })
        .then(response => response.json())
        .then((newTaskObj) => {
            setColumns((prevColumns) => {
                const updatedColumn = prevColumns[statusId];
                return {
                    ...prevColumns,
                    [statusId]: {
                        ...updatedColumn,
                        items: [...updatedColumn.items, newTaskObj],
                    },
                };
            });

            // タスク作成後にモーダルを閉じる
            setSelectedTask(null);
            setIsModalOpen(false);
        })
        .catch(error => console.error('Error adding task:', error));
    };

    const addStatus = (newStatusObj: { id: string, name: string }) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [newStatusObj.id]: { name: newStatusObj.name, items: [] },
        }));
        setColumnsOrder((prevOrder) => [...prevOrder, newStatusObj.id]);
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
        if (!isSelectionMode) {
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
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const filteredColumns = Object.entries(columns).reduce((acc: Columns, [columnId, column]) => {
        const filteredItems = column.items.filter(item => {
            const matchesQuery = item.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCompleted = showCompleted ? !item.completed_at : true;
            return matchesQuery && matchesCompleted;
        });
        acc[columnId] = { ...column, items: filteredItems };
        return acc;
    }, {});

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div style={{ display: 'flex', gap: '16px' }} {...provided.droppableProps} ref={provided.innerRef}>
                                {columnsOrder.map((columnId, index) => (
                                    <StatusColumn
                                        key={columnId}
                                        columnId={columnId}
                                        column={filteredColumns[columnId]} // filteredColumnsを使用
                                        index={index}
                                        isSelectionMode={isSelectionMode}
                                        selectedStatuses={selectedStatuses}
                                        handleStatusSelection={handleStatusSelection}
                                        selectedTasks={selectedTasks}
                                        handleTaskSelection={handleTaskSelection}
                                        addTask={addTask}
                                        setColumns={setColumns}
                                        updateStatusName={updateStatusName}
                                        openModal={openModal} // モーダルを開く関数を渡す
                                    />
                                ))}
                                {provided.placeholder}
                                <AddStatus addStatus={addStatus} />
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {selectedTask && (
                <TaskModal 
                    isOpen={isModalOpen} 
                    task={selectedTask} 
                    onClose={closeModal} 
                    onSave={saveTaskDetails} 
                    setTask={setSelectedTask} 
                />
            )}
        </div>
    );
}

export default KanbanBoard;