import React, { HTMLAttributes } from 'react';
import Search from 'react-feather/dist/icons/search';

import './SearchBar.scss';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const SearchBar: React.FC<SearchBarProps & HTMLAttributes<HTMLInputElement>> = props => {
  return (
    <div className="SearchBar">
      <Search />
      <input className="SearchBar_input" type="search" placeholder="Try searching for something" {...props} />
    </div>
  );
};

export default SearchBar;
