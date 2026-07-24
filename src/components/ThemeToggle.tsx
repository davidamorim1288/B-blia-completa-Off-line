import { Moon, Sun } from 'lucide-react';
import '../styles/ThemeToggle.css';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button className="theme-toggle" onClick={onToggle} title="Alternar tema">
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};
