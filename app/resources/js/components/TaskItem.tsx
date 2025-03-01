import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Checkbox from '@mui/material/Checkbox';
import { Task } from './types';

interface TaskItemProps {
    item: Task;
    index: number;
    isSelectionMode: boolean;
    selectedTasks: Set<string>;
    handleTaskSelection: (taskId: string) => void;
    openModal: (task: Task) => void; // モーダルを開く関数を追加
}

const TaskItem: React.FC<TaskItemProps> = ({
    item,
    index,
    isSelectionMode,
    selectedTasks,
    handleTaskSelection,
    openModal // モーダルを開く関数を受け取る
}) => {
    return (
        <Draggable key={String(item.id)} draggableId={String(item.id)} index={index}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps} 
                    {...provided.dragHandleProps} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 10,
                        margin: '0 0 10px 0',
                        background: snapshot.isDragging ? '#e0e0e0' : 'white',
                        borderRadius: 4,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        ...provided.draggableProps.style
                    }}
                    onClick={() => openModal(item)} // タスク全体をクリックしてモーダルを開く
                >
                    {/* タスクのチェックボックス */}
                    {isSelectionMode && (
                        <Checkbox 
                            checked={selectedTasks.has(item.id)}
                            onChange={() => handleTaskSelection(item.id)}
                            color="primary"
                            style={{ marginRight: '10px' }}
                        />
                    )}

                    {item.content}
                </div>
            )}
        </Draggable>
    );
};

export default TaskItem;