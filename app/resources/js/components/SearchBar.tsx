import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ padding: '10px', background: '#f4f4f4', textAlign: 'center' }}>
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
