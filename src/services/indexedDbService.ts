interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface Favorite {
  id: string;
  verseId: string;
  timestamp: number;
}

interface Note {
  id: string;
  verseId: string;
  text: string;
  timestamp: number;
}

const DB_NAME = 'BibleAppDB';
const DB_VERSION = 1;
const VERSES_STORE = 'verses';
const FAVORITES_STORE = 'favorites';
const NOTES_STORE = 'notes';

let db: IDBDatabase | null = null;

export const initializeDatabase = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(VERSES_STORE)) {
        const versesStore = database.createObjectStore(VERSES_STORE, { keyPath: 'id' });
        versesStore.createIndex('book', 'book', { unique: false });
        versesStore.createIndex('book_chapter', ['book', 'chapter'], { unique: false });
      }

      if (!database.objectStoreNames.contains(FAVORITES_STORE)) {
        database.createObjectStore(FAVORITES_STORE, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(NOTES_STORE)) {
        database.createObjectStore(NOTES_STORE, { keyPath: 'id' });
      }
    };
  });
};

const getDatabase = async (): Promise<IDBDatabase> => {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
};

export const addVerses = async (verses: BibleVerse[]): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(VERSES_STORE, 'readwrite');
    const store = transaction.objectStore(VERSES_STORE);

    verses.forEach((verse) => {
      store.put(verse);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getVersesByBook = async (book: string, chapter: number): Promise<BibleVerse[]> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(VERSES_STORE, 'readonly');
    const store = transaction.objectStore(VERSES_STORE);
    const index = store.index('book_chapter');
    const range = IDBKeyRange.only([book, chapter]);
    const request = index.getAll(range);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const searchVerses = async (query: string): Promise<BibleVerse[]> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(VERSES_STORE, 'readonly');
    const store = transaction.objectStore(VERSES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const results = (request.result as BibleVerse[]).filter((verse) =>
        verse.text.toLowerCase().includes(query.toLowerCase()) ||
        verse.book.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results.slice(0, 50));
    };
    request.onerror = () => reject(request.error);
  });
};

export const addFavorite = async (verseId: string): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);
    const favorite: Favorite = {
      id: `fav_${verseId}`,
      verseId,
      timestamp: Date.now(),
    };

    store.put(favorite);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const removeFavorite = async (verseId: string): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FAVORITES_STORE, 'readwrite');
    const store = transaction.objectStore(FAVORITES_STORE);
    store.delete(`fav_${verseId}`);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getFavorites = async (): Promise<Favorite[]> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FAVORITES_STORE, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const isFavorite = async (verseId: string): Promise<boolean> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(FAVORITES_STORE, 'readonly');
    const store = transaction.objectStore(FAVORITES_STORE);
    const request = store.get(`fav_${verseId}`);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addNote = async (verseId: string, noteText: string): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    const note: Note = {
      id: `note_${Date.now()}`,
      verseId,
      text: noteText,
      timestamp: Date.now(),
    };

    store.put(note);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getNotesByVerse = async (verseId: string): Promise<Note[]> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readonly');
    const store = transaction.objectStore(NOTES_STORE);
    const request = store.getAll();

    request.onsuccess = () => {
      const notes = (request.result as Note[]).filter((note) => note.verseId === verseId);
      resolve(notes);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const database = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(NOTES_STORE, 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    store.delete(noteId);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};
