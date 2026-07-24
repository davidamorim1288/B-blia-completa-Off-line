import { Heart, Copy, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isFavorite, addFavorite, removeFavorite, addNote, getNotesByVerse } from '../services/indexedDbService';
import '../styles/BibleReader.css';

interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleReaderProps {
  book: string;
  chapter: number;
  verses: Verse[];
}

export const BibleReader: React.FC<BibleReaderProps> = ({ book, chapter, verses }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      const favoriteStates = new Set<string>();
      for (const verse of verses) {
        if (await isFavorite(verse.id)) {
          favoriteStates.add(verse.id);
        }
      }
      setFavorites(favoriteStates);
    };

    loadFavorites();
  }, [verses]);

  useEffect(() => {
    const loadNotes = async () => {
      const allNotes: Record<string, string[]> = {};
      for (const verse of verses) {
        const verseNotes = await getNotesByVerse(verse.id);
        if (verseNotes.length > 0) {
          allNotes[verse.id] = verseNotes.map((n) => n.text);
        }
      }
      setNotes(allNotes);
    };

    loadNotes();
  }, [verses]);

  const toggleFavorite = async (verseId: string) => {
    const isFav = favorites.has(verseId);
    if (isFav) {
      await removeFavorite(verseId);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(verseId);
        return next;
      });
    } else {
      await addFavorite(verseId);
      setFavorites((prev) => new Set(prev).add(verseId));
    }
  };

  const handleAddNote = async () => {
    if (!selectedVerse || !newNote.trim()) return;
    await addNote(selectedVerse, newNote);
    setNotes((prev) => ({
      ...prev,
      [selectedVerse]: [...(prev[selectedVerse] || []), newNote],
    }));
    setNewNote('');
  };

  const copyVerse = (verse: Verse) => {
    const text = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;
    navigator.clipboard.writeText(text);
  };

  const shareVerse = (verse: Verse) => {
    const text = `Leia ${verse.book} ${verse.chapter}:${verse.verse} em Bíblia Completa Off-line`;
    if (navigator.share) {
      navigator.share({
        title: 'Bíblia',
        text: text,
      });
    }
  };

  if (verses.length === 0) {
    return (
      <div className="bible-reader">
        <div className="empty-state">
          <p>Nenhum versículo encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bible-reader">
      <div className="reader-header">
        <h1>
          {book} {chapter}
        </h1>
      </div>
      <div className="verses-container">
        {verses.map((verse) => (
          <div key={verse.id} className="verse-block">
            <div className="verse-content">
              <div className="verse-header">
                <span className="verse-ref">
                  {verse.verse}
                </span>
                <div className="verse-actions">
                  <button
                    className={`action-btn ${favorites.has(verse.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(verse.id)}
                    title="Adicionar aos favoritos"
                  >
                    <Heart size={16} />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => copyVerse(verse)}
                    title="Copiar versículo"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => shareVerse(verse)}
                    title="Compartilhar versículo"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
              <p className="verse-text">{verse.text}</p>
              {notes[verse.id] && notes[verse.id].length > 0 && (
                <div className="verse-notes">
                  <strong>Anotações:</strong>
                  <ul>
                    {notes[verse.id].map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="note-btn"
                onClick={() => setSelectedVerse(verse.id)}
              >
                Adicionar anotação
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedVerse && (
        <div className="note-input-modal">
          <div className="note-input-content">
            <h3>Adicionar anotação</h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Digite sua anotação..."
            />
            <div className="note-actions">
              <button className="btn-primary" onClick={handleAddNote}>
                Salvar
              </button>
              <button className="btn-secondary" onClick={() => setSelectedVerse(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
