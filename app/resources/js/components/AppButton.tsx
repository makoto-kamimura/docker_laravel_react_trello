import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface AppButtonProps {
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  columns: { [key: string]: Column };
  setColumns: React.Dispatch<React.SetStateAction<{ [key: string]: Column }>>;
  selectedTasks: Set<string>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedStatuses: Set<string>;
  setSelectedStatuses: React.Dispatch<React.SetStateAction<Set<string>>>;
}

interface Column {
  name: string;
  items: any[];
}

const AppButton: React.FC<AppButtonProps> = ({
  isSelectionMode,
  toggleSelectionMode,
  selectAllItems,
  deselectAllItems,
  columns,
  setColumns,
  selectedTasks,
  setSelectedTasks,
  selectedStatuses,
  setSelectedStatuses
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      toggleSelectionMode();
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    toggleSelectionMode();
  };

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllItems();
    } else {
      const allTaskIds = new Set<string>();
      const allStatusIds = new Set<string>();

      Object.keys(columns).forEach(columnId => {
        allStatusIds.add(columnId);
        columns[columnId].items.forEach(task => {
          allTaskIds.add(task.id);
        });
      });

      setSelectedTasks(allTaskIds);
      setSelectedStatuses(allStatusIds);
    }
    setAllSelected(!allSelected);
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
      setSelectedTasks(new Set());
      setSelectedStatuses(new Set());
    } catch (error) {
      console.error('Error during delete operation:', error);
    }
  };

  const completeSelectedItems = async () => {
    try {
      // タスク完了処理
      await Promise.all(
        Array.from(selectedTasks).map(taskId =>
          fetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' })
            .catch(error => console.error('Error completing task:', error))
        )
      );

      // UI更新
      setColumns(prevColumns => {
        const newColumns = { ...prevColumns };

        // 選択されたタスクを完了
        Object.keys(newColumns).forEach(columnId => {
          newColumns[columnId].items = newColumns[columnId].items.map(task =>
            selectedTasks.has(task.id) ? { ...task, completed_at: new Date().toISOString() } : task
          );
        });

        return newColumns;
      });

      // 選択モード終了
      setSelectedTasks(new Set());
      setSelectedStatuses(new Set());
    } catch (error) {
      console.error('Error during complete operation:', error);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
      {!isExpanded && (
        <button onClick={handleExpand} style={{
          padding: "10px",
          borderRadius: "50%",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <AppsIcon />
        </button>
      )}
      {isExpanded && (
        <>
          <button onClick={handleCollapse} style={{
            padding: "10px",
            borderRadius: "50%",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <ArrowBackIcon />
          </button>
          <div style={{ display: 'flex', gap: '10px', transition: 'width 0.3s', overflow: 'hidden', width: '150px' }}>
            <button onClick={handleSelectAll} style={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <CheckBoxIcon />
            </button>
            <button onClick={deleteSelectedItems} style={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#FF0000",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <DeleteIcon />
            </button>
            <button onClick={completeSelectedItems} style={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: "#28A745",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <DoneIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppButton;