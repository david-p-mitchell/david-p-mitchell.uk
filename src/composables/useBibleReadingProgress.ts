export interface Reading {
  book: string;
  progress: number; // percentage 0 - 100
}

export interface BibleBook {
  bookName: string;
  abbreviation?: string;
  verses: number[];
}

export interface BookProgressResult {
  book: BibleBook;
  short: string;
  progress: number;
  totalVerses: number;
}

export type BookOverallProgress = {
    overallProgress: BookProgressResult[];
    totalVerses: number;
    totalVersesRead: number;
    totalProgress: string;
}

import readings from '../data/bibleReading.ts';
import { bibleBookReadingTimes } from '../data/bibleBookData.ts';

export function calculateBibleProgress  (
): BookOverallProgress {

    
  const progressMap = new Map(
    readings.map(r => [r.book.toLowerCase(), r.progress])
  );

  const booksWithProgress: BookProgressResult[] = bibleBookReadingTimes.map(book => {
    const totalVerses = book.verses.reduce((sum, count) => sum + count, 0);
    const progress = progressMap.get(book.bookName.toLowerCase()) ?? 0;

    return {
      book,
      short: book.abbreviation ?? book.bookName.slice(0, 3),
      progress,
      totalVerses,
    };
  });

  const totalVerses = booksWithProgress.reduce(
    (sum, item) => sum + item.totalVerses,
    0
  );

  const totalVersesRead = booksWithProgress.reduce(
    (sum, item) => sum + (item.progress * item.totalVerses) / 100,
    0
  );

  const totalProgress =
    totalVerses === 0
      ? '0.00'
      : ((totalVersesRead / totalVerses) * 100).toFixed(2);

  return {
    overallProgress: booksWithProgress,
    totalVerses,
    totalVersesRead,
    totalProgress,
  };
}