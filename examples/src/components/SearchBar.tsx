import React from 'react';
import Search from 'react-feather/dist/icons/search';

import './SearchBar.scss';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="SearchBar">
      <Search />
      <input
        className="SearchBar_input"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Try searching for something"
      />
    </div>
  );
};

export default SearchBar;
