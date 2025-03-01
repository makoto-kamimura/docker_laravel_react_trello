import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';
import Edit from '@mui/icons-material/Edit';
import TaskItem from './TaskItem';
import AddTask from './AddTask';
import { Column, Task, Columns } from './types'; // Columns型をインポート

interface StatusColumnProps {
    columnId: string;
    column: Column;
    index: number;
    isSelectionMode: boolean;
    selectedStatuses: Set<string>;
    handleStatusSelection: (statusId: string) => void;
    selectedTasks: Set<string>;
    handleTaskSelection: (taskId: string) => void;
    addTask: (statusId: string, taskContent: string) => void;
    setColumns: React.Dispatch<React.SetStateAction<Columns>>;
    updateStatusName: (columnId: string, newName: string) => void;
    openModal: (task: Task) => void; // モーダルを開く関数を追加
}

const StatusColumn: React.FC<StatusColumnProps> = ({
    columnId,
    column,
    index,
    isSelectionMode,
    selectedStatuses,
    handleStatusSelection,
    selectedTasks,
    handleTaskSelection,
    addTask,
    setColumns,
    updateStatusName,
    openModal // モーダルを開く関数を受け取る
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [statusName, setStatusName] = useState(column.name);

    return (
        <Draggable key={columnId} draggableId={columnId} index={index}>
            {(provided) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    style={{ 
                        padding: 16, 
                        background: '#f4f4f4',
                        borderRadius: 8, 
                        width: 250,
                        minHeight: 200,
                        ...provided.draggableProps.style
                    }}
                >
                    {/* ステータスのチェックボックス */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {isEditing ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                                <input
                                    type="text"
                                    value={statusName}
                                    onChange={(e) => setStatusName(e.target.value)}
                                    style={{
                                        padding: "8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        flexGrow: 1,
                                        fontSize: "16px",
                                    }}
                                />
                                <button onClick={() => {
                                    updateStatusName(columnId, statusName);
                                    setIsEditing(false);
                                }} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                                    <SaveIcon />
                                </button>
                            </div>
                        ) : (
                            <>
                                <h3>{column.name}</h3>
                                {isSelectionMode ? (
                                    <Checkbox 
                                        checked={selectedStatuses.has(columnId)}
                                        onChange={() => handleStatusSelection(columnId)}
                                        color="primary"
                                    />
                                ) : (
                                    <button onClick={() => setIsEditing(true)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                                        <Edit />
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                    <Droppable droppableId={columnId} type="TASK">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '100px' }}>
                                {column.items.map((item, index) => (
                                    <TaskItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        isSelectionMode={isSelectionMode}
                                        selectedTasks={selectedTasks}
                                        handleTaskSelection={handleTaskSelection}
                                        openModal={openModal} // モーダルを開く関数を渡す
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    {/* タスク追加機能 */}
                    <AddTask statusId={columnId} addTask={addTask} setColumns={setColumns} />
                </div>
            )}
        </Draggable>
    );
};

export default StatusColumn;