import React, { useState } from 'react';
import LeftMenu from './LeftMenu';
import KanbanBoard from './KanbanBoard';
import GanttChart from './GanttChart';
import SearchBar from './SearchBar';
import AppButton from './AppButton';
import { Column } from './types'; // 追加

const App: React.FC = () => {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState<boolean>(true); // デフォルトをONに設定
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  const toggleSelectionMode = () => {
    setIsSelectionMode(prev => !prev);
    setSelectedTasks(new Set());
    setSelectedStatuses(new Set());
  };

  const selectAllItems = () => {
    setSelectedTasks(new Set(Object.keys(columns).flatMap(columnId => columns[columnId].items.map(task => task.id))));
    setSelectedStatuses(new Set(Object.keys(columns)));
  };

  const deselectAllItems = () => {
    setSelectedTasks(new Set());
    setSelectedStatuses(new Set());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ marginLeft: '60px' }}>
        <GanttChart searchQuery={searchQuery} showCompleted={showCompleted} />
      </div>

      <div
      //  style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}
       >
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
        />
      </div>

      <div style={{ display: 'flex', flexGrow: 1, overflowX: 'auto' }}>
        <LeftMenu 
          setColumns={setColumns} 
          isSelectionMode={isSelectionMode} 
          setIsSelectionMode={setIsSelectionMode} 
          selectedTasks={selectedTasks} 
          setSelectedTasks={setSelectedTasks} 
        />
        <div style={{ marginLeft: '80px', flexGrow: 1 }}>
          {/* Pass the isSelectionMode, searchQuery, and showCompleted to KanbanBoard */}
          <KanbanBoard 
            isSelectionMode={isSelectionMode} 
            searchQuery={searchQuery} 
            showCompleted={showCompleted}
          />
        </div>
      </div>

      <AppButton 
        isSelectionMode={isSelectionMode} 
        toggleSelectionMode={toggleSelectionMode} 
        selectAllItems={selectAllItems}
        deselectAllItems={deselectAllItems}
        columns={columns}
        setColumns={setColumns}
        selectedTasks={selectedTasks}
        setSelectedTasks={setSelectedTasks}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
      />
    </div>
  );
};

export default App;