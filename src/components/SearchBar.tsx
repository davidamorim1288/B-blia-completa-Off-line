import { Search } from 'lucide-react';
import '../styles/SearchBar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <Search size={20} />
      <input
        type="text"
        placeholder="Buscar versículo ou livro..."
        onChange={handleChange}
      />
    </div>
  );
};
