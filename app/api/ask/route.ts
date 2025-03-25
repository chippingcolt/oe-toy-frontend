import { NextResponse } from 'next/server';
import { isRateLimited } from '@/utils/rateLimiter';
import {
  matchCategoryFromKeywords,
  classifyCategoryWithGPT,
  CategoryResult,
} from '@/utils/classifier';
import { logCategoryMatch } from '@/utils/logging';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

/**
 * Handles user questions:
 * - Has a simple rate limiting check
 * - Attempts keyword-based classification based on predifined values
 * - Falls back to GPT classification if needed
 * - Logs results to report
 * - Returns GPT-generated answer with ad metadata
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429 }
      );
    }

    const { question, history } = await request.json();

    // Try keyword match first
    let matched: CategoryResult | null = matchCategoryFromKeywords(question);
    const usedAI = !matched;

    // Fallback to GPT classification
    if (!matched) {
      matched = await classifyCategoryWithGPT(question);
    }

    if (matched) {
      await logCategoryMatch({
        category: matched.category,
        question,
        confidence: matched.confidence ?? (usedAI ? null : 100),
        usedAI,
        isNew: matched.sponsor === null,
      });
    }

    // Generate final answer
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...history, { role: 'user', content: question }],
    });

    const answer = chatCompletion.choices[0].message.content;

    return NextResponse.json({
      answer,
      matchedCategory: matched?.category ?? null,
      sponsor: matched?.sponsor ?? null,
      confidence: matched?.confidence ?? (usedAI ? null : 100),
      hasAd: Boolean(matched?.sponsor),
    });
  } catch (err: any) {
    console.error('Ask API error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
