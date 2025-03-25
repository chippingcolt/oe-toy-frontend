import OpenAI from 'openai';
import adData from '@/data/ads.json';

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

export type CategoryResult = {
  category: string;
  sponsor: string | null;
  confidence: number | null;
};

// Quickly match by keyword from ads.json (fast-path match)
export function matchCategoryFromKeywords(question: string): CategoryResult | null {
  const lowerQ = question.toLowerCase();

  for (const ad of adData) {
    if (ad.keywords.some((keyword) => lowerQ.includes(keyword))) {
      return {
        category: ad.category,
        sponsor: ad.sponsor,
        confidence: 100, // Guaranteed match
      };
    }
  }

  return null;
}

// Use GPT to classify when no keyword match found
export async function classifyCategoryWithGPT(question: string): Promise<CategoryResult | null> {
  const prompt = `
You are a medical question classifier. Given the question below, return the most relevant category it belongs to and a confidence score from 0 to 100.

Respond ONLY in this JSON format:
{
  "category": "your-category",
  "confidence": 75
}

Question: "${question}"
`.trim();

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = result.choices[0].message.content?.trim();
    if (!content) return null;

    let parsed: { category?: string; confidence?: number };
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse GPT response:', content);
      return null;
    }

    if (!parsed.category) return null;

    const category = parsed.category.toLowerCase();
    const matchedAd = adData.find((ad) => ad.category.toLowerCase() === category);

    return {
      category,
      sponsor: matchedAd?.sponsor ?? null,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : null,
    };
  } catch (err) {
    console.error('GPT classification error:', err);
    return null;
  }
}
