import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

/**
 * Serves a report for insights on category discoveries.
 */
export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), 'data/potentialAdOpportunities.json');
    const file = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(file || '[]');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading report data:', error);
    return NextResponse.json({ error: 'Failed to load report data.' }, { status: 500 });
  }
}
