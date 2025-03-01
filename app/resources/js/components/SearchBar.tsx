import React from 'react';
import { Switch } from '@mui/material';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  showCompleted: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, showCompleted, setShowCompleted }) => {
  return (
    <div style={{ 
      padding: '10px', 
      background: '#f4f4f4', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      justifyContent: 'center' 
    }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
        <Switch 
          checked={showCompleted} 
          onChange={(e) => setShowCompleted(e.target.checked)} 
        />
        {/* <span>完了済みのみ表示</span> */}
      </label>

      <input
        type="text"
        placeholder="検索..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '8px',
          width: '60%', 
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      />
    </div>
  );
};

export default SearchBar;