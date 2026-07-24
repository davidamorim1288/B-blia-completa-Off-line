import { useEffect, useState } from 'react';
import { Heart, Search as SearchIcon } from 'lucide-react';
import { BibleReader } from './components/BibleReader';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { ThemeToggle } from './components/ThemeToggle';
import { Favorites } from './components/Favorites';
import { initializeDatabase } from './services/indexedDbService';
import { getChapter, searchBible, books } from './services/bibleService';
import bibleData from './data/bible.json';
import './App.css';

interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [currentBook, setCurrentBook] = useState('Gênesis');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeDatabase();
        setDbInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (!dbInitialized) return;

    const loadChapter = async () => {
      try {
        const chapterVerses = await getChapter(currentBook, currentChapter);
        setVerses(chapterVerses as Verse[]);
        setIsSearching(false);
      } catch (error) {
        console.error('Error loading chapter:', error);
      }
    };

    loadChapter();
  }, [currentBook, currentChapter, dbInitialized]);

  const handleSearch = async (query: string) => {
    if (query.trim().length === 0) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const match = query.match(/^(.+?)\s+(\d+)$/);
    if (match) {
      const [, book, chapter] = match;
      const foundBook = books.find((b) => b.toLowerCase() === book.toLowerCase());
      if (foundBook) {
        setCurrentBook(foundBook);
        setCurrentChapter(parseInt(chapter, 10));
        setIsSearching(false);
        return;
      }
    }

    const results = await searchBible(query);
    setSearchResults(results as Verse[]);
    setIsSearching(true);
  };

  const handleSelectChapter = (book: string, chapter: number) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setIsSearching(false);
  };

  const handleSelectFromFavorites = (book: string, chapter: number) => {
    handleSelectChapter(book, chapter);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('light-theme');
  };

  const displayVerses = isSearching ? searchResults : verses;

  return (
    <div className={`app ${isDarkTheme ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>📖 Bíblia Completa</h1>
          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => setShowFavorites(!showFavorites)}
              title="Favoritos"
            >
              <Heart size={20} />
            </button>
            <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
          </div>
        </div>
      </header>

      <main className="app-main">
        <Sidebar onSelectChapter={handleSelectChapter} />
        <div className="main-content">
          <SearchBar onSearch={handleSearch} />
          {isLoading ? (
            <div className="loading">
              <p>Carregando Bíblia...</p>
            </div>
          ) : (
            <BibleReader
              book={currentBook}
              chapter={currentChapter}
              verses={displayVerses}
            />
          )}
        </div>
      </main>

      <Favorites
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        onSelectVerse={handleSelectFromFavorites}
      />
    </div>
  );
}

export default App;
