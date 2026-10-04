export type Testament = 'OT' | 'NT';

export type BookGenre =
  | 'Law'
  | 'History'
  | 'Poetry'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'Church History'
  | 'Pauline Epistles'
  | 'General Epistles'
  | 'Prophecy';

export interface BibleBook {
  id: string;
  name: string;
  testament: Testament;
  chaptersCount: number;
  genre: BookGenre;
  abbreviation: string;
}

export const BIBLE_BOOKS: BibleBook[] = [
  // --- Old Testament (39 books, 929 chapters) ---
  // Law (Pentateuch)
  { id: 'genesis', name: 'Genesis', testament: 'OT', chaptersCount: 50, genre: 'Law', abbreviation: 'Gen' },
  { id: 'exodus', name: 'Exodus', testament: 'OT', chaptersCount: 40, genre: 'Law', abbreviation: 'Exod' },
  { id: 'leviticus', name: 'Leviticus', testament: 'OT', chaptersCount: 27, genre: 'Law', abbreviation: 'Lev' },
  { id: 'numbers', name: 'Numbers', testament: 'OT', chaptersCount: 36, genre: 'Law', abbreviation: 'Num' },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'OT', chaptersCount: 34, genre: 'Law', abbreviation: 'Deut' },

  // History
  { id: 'joshua', name: 'Joshua', testament: 'OT', chaptersCount: 24, genre: 'History', abbreviation: 'Josh' },
  { id: 'judges', name: 'Judges', testament: 'OT', chaptersCount: 21, genre: 'History', abbreviation: 'Judg' },
  { id: 'ruth', name: 'Ruth', testament: 'OT', chaptersCount: 4, genre: 'History', abbreviation: 'Ruth' },
  { id: '1samuel', name: '1 Samuel', testament: 'OT', chaptersCount: 31, genre: 'History', abbreviation: '1Sam' },
  { id: '2samuel', name: '2 Samuel', testament: 'OT', chaptersCount: 24, genre: 'History', abbreviation: '2Sam' },
  { id: '1kings', name: '1 Kings', testament: 'OT', chaptersCount: 22, genre: 'History', abbreviation: '1Kgs' },
  { id: '2kings', name: '2 Kings', testament: 'OT', chaptersCount: 25, genre: 'History', abbreviation: '2Kgs' },
  { id: '1chronicles', name: '1 Chronicles', testament: 'OT', chaptersCount: 29, genre: 'History', abbreviation: '1Chr' },
  { id: '2chronicles', name: '2 Chronicles', testament: 'OT', chaptersCount: 36, genre: 'History', abbreviation: '2Chr' },
  { id: 'ezra', name: 'Ezra', testament: 'OT', chaptersCount: 10, genre: 'History', abbreviation: 'Ezra' },
  { id: 'nehemiah', name: 'Nehemiah', testament: 'OT', chaptersCount: 13, genre: 'History', abbreviation: 'Neh' },
  { id: 'esther', name: 'Esther', testament: 'OT', chaptersCount: 10, genre: 'History', abbreviation: 'Esth' },

  // Poetry & Wisdom
  { id: 'job', name: 'Job', testament: 'OT', chaptersCount: 42, genre: 'Poetry', abbreviation: 'Job' },
  { id: 'psalms', name: 'Psalms', testament: 'OT', chaptersCount: 150, genre: 'Poetry', abbreviation: 'Ps' },
  { id: 'proverbs', name: 'Proverbs', testament: 'OT', chaptersCount: 31, genre: 'Poetry', abbreviation: 'Prov' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'OT', chaptersCount: 12, genre: 'Poetry', abbreviation: 'Eccl' },
  { id: 'songofsolomon', name: 'Song of Solomon', testament: 'OT', chaptersCount: 8, genre: 'Poetry', abbreviation: 'Song' },

  // Major Prophets
  { id: 'isaiah', name: 'Isaiah', testament: 'OT', chaptersCount: 66, genre: 'Major Prophets', abbreviation: 'Isa' },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'OT', chaptersCount: 52, genre: 'Major Prophets', abbreviation: 'Jer' },
  { id: 'lamentations', name: 'Lamentations', testament: 'OT', chaptersCount: 5, genre: 'Major Prophets', abbreviation: 'Lam' },
  { id: 'ezekiel', name: 'Ezekiel', testament: 'OT', chaptersCount: 48, genre: 'Major Prophets', abbreviation: 'Ezek' },
  { id: 'daniel', name: 'Daniel', testament: 'OT', chaptersCount: 12, genre: 'Major Prophets', abbreviation: 'Dan' },

  // Minor Prophets
  { id: 'hosea', name: 'Hosea', testament: 'OT', chaptersCount: 14, genre: 'Minor Prophets', abbreviation: 'Hos' },
  { id: 'joel', name: 'Joel', testament: 'OT', chaptersCount: 3, genre: 'Minor Prophets', abbreviation: 'Joel' },
  { id: 'amos', name: 'Amos', testament: 'OT', chaptersCount: 9, genre: 'Minor Prophets', abbreviation: 'Amos' },
  { id: 'obadiah', name: 'Obadiah', testament: 'OT', chaptersCount: 1, genre: 'Minor Prophets', abbreviation: 'Obad' },
  { id: 'jonah', name: 'Jonah', testament: 'OT', chaptersCount: 4, genre: 'Minor Prophets', abbreviation: 'Jonah' },
  { id: 'micah', name: 'Micah', testament: 'OT', chaptersCount: 7, genre: 'Minor Prophets', abbreviation: 'Mic' },
  { id: 'nahum', name: 'Nahum', testament: 'OT', chaptersCount: 3, genre: 'Minor Prophets', abbreviation: 'Nah' },
  { id: 'habakkuk', name: 'Habakkuk', testament: 'OT', chaptersCount: 3, genre: 'Minor Prophets', abbreviation: 'Hab' },
  { id: 'zephaniah', name: 'Zephaniah', testament: 'OT', chaptersCount: 3, genre: 'Minor Prophets', abbreviation: 'Zeph' },
  { id: 'haggai', name: 'Haggai', testament: 'OT', chaptersCount: 2, genre: 'Minor Prophets', abbreviation: 'Hag' },
  { id: 'zechariah', name: 'Zechariah', testament: 'OT', chaptersCount: 14, genre: 'Minor Prophets', abbreviation: 'Zech' },
  { id: 'malachi', name: 'Malachi', testament: 'OT', chaptersCount: 4, genre: 'Minor Prophets', abbreviation: 'Mal' },

  // --- New Testament (27 books, 260 chapters) ---
  // Gospels
  { id: 'matthew', name: 'Matthew', testament: 'NT', chaptersCount: 28, genre: 'Gospels', abbreviation: 'Matt' },
  { id: 'mark', name: 'Mark', testament: 'NT', chaptersCount: 16, genre: 'Gospels', abbreviation: 'Mark' },
  { id: 'luke', name: 'Luke', testament: 'NT', chaptersCount: 24, genre: 'Gospels', abbreviation: 'Luke' },
  { id: 'john', name: 'John', testament: 'NT', chaptersCount: 21, genre: 'Gospels', abbreviation: 'John' },

  // Church History
  { id: 'acts', name: 'Acts', testament: 'NT', chaptersCount: 28, genre: 'Church History', abbreviation: 'Acts' },

  // Pauline Epistles
  { id: 'romans', name: 'Romans', testament: 'NT', chaptersCount: 16, genre: 'Pauline Epistles', abbreviation: 'Rom' },
  { id: '1corinthians', name: '1 Corinthians', testament: 'NT', chaptersCount: 16, genre: 'Pauline Epistles', abbreviation: '1Cor' },
  { id: '2corinthians', name: '2 Corinthians', testament: 'NT', chaptersCount: 13, genre: 'Pauline Epistles', abbreviation: '2Cor' },
  { id: 'galatians', name: 'Galatians', testament: 'NT', chaptersCount: 6, genre: 'Pauline Epistles', abbreviation: 'Gal' },
  { id: 'ephesians', name: 'Ephesians', testament: 'NT', chaptersCount: 6, genre: 'Pauline Epistles', abbreviation: 'Eph' },
  { id: 'philippians', name: 'Philippians', testament: 'NT', chaptersCount: 4, genre: 'Pauline Epistles', abbreviation: 'Phil' },
  { id: 'colossians', name: 'Colossians', testament: 'NT', chaptersCount: 4, genre: 'Pauline Epistles', abbreviation: 'Col' },
  { id: '1thessalonians', name: '1 Thessalonians', testament: 'NT', chaptersCount: 5, genre: 'Pauline Epistles', abbreviation: '1Thess' },
  { id: '2thessalonians', name: '2 Thessalonians', testament: 'NT', chaptersCount: 3, genre: 'Pauline Epistles', abbreviation: '2Thess' },
  { id: '1timothy', name: '1 Timothy', testament: 'NT', chaptersCount: 6, genre: 'Pauline Epistles', abbreviation: '1Tim' },
  { id: '2timothy', name: '2 Timothy', testament: 'NT', chaptersCount: 4, genre: 'Pauline Epistles', abbreviation: '2Tim' },
  { id: 'titus', name: 'Titus', testament: 'NT', chaptersCount: 3, genre: 'Pauline Epistles', abbreviation: 'Titus' },
  { id: 'philemon', name: 'Philemon', testament: 'NT', chaptersCount: 1, genre: 'Pauline Epistles', abbreviation: 'Phlm' },

  // General Epistles
  { id: 'hebrews', name: 'Hebrews', testament: 'NT', chaptersCount: 13, genre: 'General Epistles', abbreviation: 'Heb' },
  { id: 'james', name: 'James', testament: 'NT', chaptersCount: 5, genre: 'General Epistles', abbreviation: 'Jas' },
  { id: '1peter', name: '1 Peter', testament: 'NT', chaptersCount: 5, genre: 'General Epistles', abbreviation: '1Pet' },
  { id: '2peter', name: '2 Peter', testament: 'NT', chaptersCount: 3, genre: 'General Epistles', abbreviation: '2Pet' },
  { id: '1john', name: '1 John', testament: 'NT', chaptersCount: 5, genre: 'General Epistles', abbreviation: '1John' },
  { id: '2john', name: '2 John', testament: 'NT', chaptersCount: 1, genre: 'General Epistles', abbreviation: '2John' },
  { id: '3john', name: '3 John', testament: 'NT', chaptersCount: 1, genre: 'General Epistles', abbreviation: '3John' },
  { id: 'jude', name: 'Jude', testament: 'NT', chaptersCount: 1, genre: 'General Epistles', abbreviation: 'Jude' },

  // Prophecy
  { id: 'revelation', name: 'Revelation', testament: 'NT', chaptersCount: 22, genre: 'Prophecy', abbreviation: 'Rev' }
];

export const TOTAL_BIBLE_CHAPTERS = 1189;
export const TOTAL_OT_CHAPTERS = 929;
export const TOTAL_NT_CHAPTERS = 260;

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id.toLowerCase() === id.toLowerCase());
}
