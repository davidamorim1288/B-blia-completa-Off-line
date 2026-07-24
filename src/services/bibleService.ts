import { addVerses, getVersesByBook, searchVerses } from './indexedDbService';

export const books = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
  'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cântico dos Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
  'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque',
  'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João',
  'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas',
  'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses',
  '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus',
  'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João',
  '3 João', 'Judas', 'Apocalipse'
];

export const loadBibleData = async (bibleData: any[]): Promise<void> => {
  try {
    await addVerses(bibleData);
    console.log('Bible data loaded successfully');
  } catch (error) {
    console.error('Error loading bible data:', error);
    throw error;
  }
};

export const getChapter = async (book: string, chapter: number) => {
  try {
    return await getVersesByBook(book, chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return [];
  }
};

export const searchBible = async (query: string) => {
  if (query.trim().length < 2) return [];
  try {
    return await searchVerses(query);
  } catch (error) {
    console.error('Error searching bible:', error);
    return [];
  }
};

export const parseChapterReference = (reference: string): { book: string; chapter: number } | null => {
  const match = reference.match(/^(.+?)\s+(\d+)$/);
  if (!match) return null;

  const [, book, chapter] = match;
  const foundBook = books.find((b) => b.toLowerCase() === book.toLowerCase());

  if (!foundBook) return null;

  return { book: foundBook, chapter: parseInt(chapter, 10) };
};
