import { Heart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite, getVersesByBook } from '../services/indexedDbService';
import '../styles/Favorites.css';

interface Favorite {
  id: string;
  verseId: string;
  timestamp: number;
}

interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface FavoritesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (book: string, chapter: number) => void;
}

export const Favorites: React.FC<FavoritesProps> = ({ isOpen, onClose, onSelectVerse }) => {
  const [favorites, setFavorites] = useState<Verse[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadFavorites = async () => {
      const favs = await getFavorites();
      const versesByBook: Record<string, Record<number, Verse[]>> = {};

      for (const fav of favs) {
        const parts = fav.verseId.split('_');
        const book = parts[0];
        const chapter = parseInt(parts[1], 10);

        if (!versesByBook[book]) versesByBook[book] = {};
        if (!versesByBook[book][chapter]) {
          const verses = await getVersesByBook(book, chapter);
          versesByBook[book][chapter] = verses;
        }
      }

      const versesArray: Verse[] = [];
      for (const book in versesByBook) {
        for (const chapter in versesByBook[book]) {
          versesArray.push(...versesByBook[book][chapter]);
        }
      }

      setFavorites(versesArray.sort((a, b) => a.id.localeCompare(b.id)));
    };

    loadFavorites();
  }, [isOpen]);

  const handleRemove = async (verseId: string) => {
    await removeFavorite(verseId);
    setFavorites((prev) => prev.filter((v) => v.id !== verseId));
  };

  if (!isOpen) return null;

  return (
    <div className="favorites-modal">
      <div className="favorites-content">
        <div className="favorites-header">
          <h2>
            <Heart size={20} /> Favoritos
          </h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <p className="empty-message">Nenhum favorito adicionado</p>
          ) : (
            favorites.map((verse) => (
              <div key={verse.id} className="favorite-item">
                <button
                  className="favorite-content"
                  onClick={() => {
                    onSelectVerse(verse.book, verse.chapter);
                    onClose();
                  }}
                >
                  <span className="favorite-ref">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </span>
                  <p className="favorite-text">{verse.text}</p>
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(verse.id)}
                  title="Remover dos favoritos"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
