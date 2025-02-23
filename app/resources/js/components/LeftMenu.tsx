import React, { useState } from 'react';
import { Add } from '@mui/icons-material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';

interface Column {
  name: string;
  items: any[];
}

interface LeftMenuProps {
  setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTasks: Set<string>; // ← 追加
  setSelectedTasks: React.Dispatch<React.SetStateAction<Set<string>>>; // ← 追加
}

const LeftMenu: React.FC<LeftMenuProps> = ({ setColumns, isSelectionMode, setIsSelectionMode, selectedTasks, setSelectedTasks }) => {
  const [newStatus, setNewStatus] = useState('');
  const [newTask, setNewTask] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  const addStatus = () => {
    if (!newStatus.trim()) return;

    fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newStatus }),
    })
    .then(response => response.json())
    .then((newStatusObj) => {
      setColumns(prevColumns => ({
        ...prevColumns,
        [newStatusObj.id]: { name: newStatusObj.name, items: [] },
      }));

      setNewStatus('');
    })
    .catch(error => console.error('Error adding status:', error));
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
      setColumns(prevColumns => {
        const todoColumn = prevColumns[1] || { name: 'To Do', items: [] };
        return {
          ...prevColumns,
          1: {
            ...todoColumn,
            items: [...todoColumn.items, newTaskObj],
          },
        };
      });

      setNewTask('');
    })
    .catch(error => console.error('Error adding task:', error));
  };

  const toggleSelectionMode = () => {
    if (isSelectionMode) {
        deleteSelectedItems(); // 選択モードが終了する際に削除処理を呼び出し
    }
    setIsSelectionMode(prev => !prev);
    setSelectedTasks(new Set());
    setSelectedStatuses(new Set());
  };

  const deleteSelectedItems = async () => {
      try {
          // タスク削除処理
          await Promise.all(
              Array.from(selectedTasks).map(taskId =>
                  fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
                      .catch(error => console.error('Error deleting task:', error))
              )
          );
  
          // ステータス削除処理
          await Promise.all(
              Array.from(selectedStatuses).map(statusId =>
                  fetch(`/api/statuses/${statusId}`, { method: 'DELETE' })
                      .catch(error => console.error('Error deleting status:', error))
              )
          );
  
          // UI更新
          setColumns(prevColumns => {
              const newColumns = { ...prevColumns };
  
              // 選択されたタスクを削除
              Object.keys(newColumns).forEach(columnId => {
                  newColumns[columnId].items = newColumns[columnId].items.filter(task => !selectedTasks.has(task.id));
              });
  
              // 選択されたステータスを削除
              selectedStatuses.forEach(statusId => {
                  delete newColumns[statusId];
              });
  
              return newColumns;
          });
  
          // 選択モード終了
          setIsSelectionMode(false);
          setSelectedTasks(new Set());
          setSelectedStatuses(new Set());
      } catch (error) {
          console.error('Error during delete operation:', error);
      }
  };

  return (
    <div
      style={{
        width: '70px', // 初期の幅
        backgroundColor: '#f4f4f4',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        top: '0',
        left: '0',
        borderRight: '2px solid #ddd',
        transition: 'width 0.3s',
      }}
      className="left-menu"
      onMouseEnter={(e) => e.currentTarget.style.width = '200px'} // ホバー時に幅を広げる
      onMouseLeave={(e) => e.currentTarget.style.width = '70px'} // ホバー外で元に戻す
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="新しいステータスを入力..."
              style={{ padding: 8, marginRight: 8, width: '100%' }}
            />
            <button onClick={addStatus} style={{ padding: 8, width: '100%' }}>
              <Add />
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="新しいタスクを入力..."
              style={{ padding: 8, marginRight: 8, width: '100%' }}
            />
            <button onClick={addTask} style={{ padding: 8, width: '100%' }}>
              <Add />
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <button onClick={toggleSelectionMode} style={{ padding: 8, width: '100%' }}>
              {isSelectionMode ? <DeleteIcon /> : <CheckBoxIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;