import { ChevronDown, Book } from 'lucide-react';
import { useState } from 'react';
import { books } from '../services/bibleService';
import '../styles/Sidebar.css';

interface SidebarProps {
  onSelectChapter: (book: string, chapter: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectChapter }) => {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const chapterCounts: Record<string, number> = {
    'Gênesis': 50, 'Êxodo': 40, 'Levítico': 27, 'Números': 36, 'Deuteronômio': 34,
    'Josué': 24, 'Juízes': 21, 'Rute': 4, '1 Samuel': 31, '2 Samuel': 24,
    '1 Reis': 22, '2 Reis': 25, '1 Crônicas': 29, '2 Crônicas': 36, 'Esdras': 10,
    'Neemias': 13, 'Ester': 10, 'Jó': 42, 'Salmos': 150, 'Provérbios': 31,
    'Eclesiastes': 12, 'Cântico dos Cânticos': 8, 'Isaías': 66, 'Jeremias': 52, 'Lamentações': 5,
    'Ezequiel': 48, 'Daniel': 12, 'Oséias': 14, 'Joel': 3, 'Amós': 9,
    'Obadias': 1, 'Jonas': 4, 'Miqueias': 7, 'Naum': 3, 'Habacuque': 3,
    'Sofonias': 3, 'Ageu': 2, 'Zacarias': 14, 'Malaquias': 4,
    'Mateus': 28, 'Marcos': 16, 'Lucas': 24, 'João': 21,
    'Atos': 28, 'Romanos': 16, '1 Coríntios': 16, '2 Coríntios': 13, 'Gálatas': 6,
    'Efésios': 6, 'Filipenses': 4, 'Colossenses': 4, '1 Tessalonicenses': 5, '2 Tessalonicenses': 3,
    '1 Timóteo': 6, '2 Timóteo': 4, 'Tito': 3, 'Filemom': 1, 'Hebreus': 13,
    'Tiago': 5, '1 Pedro': 5, '2 Pedro': 3, '1 João': 5, '2 João': 1,
    '3 João': 1, 'Judas': 1, 'Apocalipse': 22
  };

  const toggleBook = (book: string) => {
    setExpandedBook(expandedBook === book ? null : book);
  };

  const handleChapterClick = (book: string, chapter: number) => {
    onSelectChapter(book, chapter);
    setIsOpen(false);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        <Book size={20} />
      </button>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Bíblia</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          {books.map((book) => (
            <div key={book} className="book-item">
              <button
                className="book-toggle"
                onClick={() => toggleBook(book)}
              >
                <ChevronDown
                  size={16}
                  style={{
                    transform: expandedBook === book ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s',
                  }}
                />
                {book}
              </button>
              {expandedBook === book && (
                <div className="chapters">
                  {Array.from({ length: chapterCounts[book] || 1 }, (_, i) => i + 1).map((chapter) => (
                    <button
                      key={`${book}-${chapter}`}
                      className="chapter-link"
                      onClick={() => handleChapterClick(book, chapter)}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
