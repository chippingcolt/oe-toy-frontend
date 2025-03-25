import path from 'path';
import { promises as fs } from 'fs';

const filePath = path.resolve(process.cwd(), 'data/potentialAdOpportunities.json');

type LogEntry = {
  category: string;
  question: string;
  confidence: number | null;
  usedAI: boolean;
  isNew: boolean;
  timestamp: string;
};

// Append new category matches to a JSON file if not already present
export async function logCategoryMatch(entry: Omit<LogEntry, 'timestamp'>) {
  let existing: LogEntry[] = [];

  try {
    const file = await fs.readFile(filePath, 'utf-8');
    existing = JSON.parse(file);
  } catch {
    existing = [];
  }

  const alreadyExists = existing.some(
    (e) => e.category === entry.category && e.question === entry.question
  );

  if (!alreadyExists) {
    const newEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };

    try {
      await fs.writeFile(filePath, JSON.stringify([...existing, newEntry], null, 2));
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }
}
