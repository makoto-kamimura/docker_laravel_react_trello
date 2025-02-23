import React, { useState } from 'react';
import LeftMenu from './LeftMenu';
import KanbanBoard from './KanbanBoard';
import GanttChart from './GanttChart';
import SearchBar from './SearchBar'; // 新しく作成したSearchBarコンポーネントをインポート

interface Column {
  name: string;
  items: any[];
}

const App: React.FC = () => {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({});
  const [searchQuery, setSearchQuery] = useState<string>(''); // 検索用の state を追加
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // 追加: `selectedTasks` の状態を管理
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ marginLeft: '50px' }}>
        <GanttChart searchQuery={searchQuery} />
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* メインレイアウト */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <LeftMenu 
          setColumns={setColumns} 
          isSelectionMode={isSelectionMode} 
          setIsSelectionMode={setIsSelectionMode} 
          selectedTasks={selectedTasks} 
          setSelectedTasks={setSelectedTasks} 
        />
        <div style={{ marginLeft: '80px', flexGrow: 1 }}>
          {/* Pass the isSelectionMode and searchQuery to KanbanBoard */}
          <KanbanBoard isSelectionMode={isSelectionMode} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default App;