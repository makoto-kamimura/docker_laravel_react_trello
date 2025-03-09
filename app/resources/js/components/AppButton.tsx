import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DoneIcon from '@mui/icons-material/Done';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Column } from './types';

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

  const toggleExpandCollapse = () => {
    setIsExpanded(prev => {
      const newState = !prev;
      toggleSelectionMode();
      return newState;
    });
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

    }
    setAllSelected(!allSelected);
  };

  const deleteSelectedItems = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map(taskId =>
          fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
            .catch(error => console.error('Error deleting task:', error))
        )
      );

      await Promise.all(
        Array.from(selectedStatuses).map(statusId =>
          fetch(`/api/statuses/${statusId}`, { method: 'DELETE' })
            .catch(error => console.error('Error deleting status:', error))
        )
      );

      setColumns(prevColumns => {
        const newColumns = { ...prevColumns };

        Object.keys(newColumns).forEach(columnId => {
          newColumns[columnId].items = newColumns[columnId].items.filter(task => !selectedTasks.has(task.id));
        });

        selectedStatuses.forEach(statusId => {
          delete newColumns[statusId];
        });

        return newColumns;
      });

      setSelectedTasks(new Set());
      setSelectedStatuses(new Set());
    } catch (error) {
      console.error('Error during delete operation:', error);
    }
  };

  const completeSelectedItems = async () => {
    try {
      await Promise.all(
        Array.from(selectedTasks).map(taskId =>
          fetch(`/api/tasks/${taskId}/complete`, { method: 'PATCH' })
            .catch(error => console.error('Error completing task:', error))
        )
      );

      setColumns(prevColumns => {
        const newColumns = { ...prevColumns };

        Object.keys(newColumns).forEach(columnId => {
          newColumns[columnId].items = newColumns[columnId].items.map(task =>
            selectedTasks.has(task.id) ? { ...task, completed_at: new Date().toISOString() } : task
          );
        });

        return newColumns;
      });

      setSelectedTasks(new Set());
      setSelectedStatuses(new Set());
    } catch (error) {
      console.error('Error during complete operation:', error);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
      {!isExpanded && (
        <button onClick={toggleExpandCollapse} style={{
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
          <button onClick={toggleExpandCollapse} style={{
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