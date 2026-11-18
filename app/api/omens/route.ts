import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase-server';
import { generateOmen, type Omen } from '@/lib/oracle';
import { makeSlug } from '@/lib/utils';

const schema = z.object({
  mood: z.string().min(2).max(40),
  name: z.string().max(32).optional().default(''),
  mode: z.enum(['self', 'friend']).optional().default('self'),
  subjectName: z.string().max(40).optional().default(''),
  relation: z.string().max(32).optional().default('friend'),
});

async function askOpenAI(input: z.infer<typeof schema>, fallback: Omen): Promise<Omen> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback;
  const subject = input.mode === 'friend' ? `${input.subjectName} (the user's ${input.relation})` : (input.name || 'the visitor');
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 1.05,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are the Oracle at The Oddity Department, a surreal comedy fortune-teller. Write an original, funny, oddly specific but harmless fictional prophecy. Never claim real supernatural knowledge, predict serious harm, make medical/legal/financial claims, or target protected traits. Make it feel witty, warm, slightly uncanny, and highly shareable. Return JSON with exactly: title (2-6 words, uppercase), prophecy (35-65 words, second-person, vivid and funny), classification (uppercase, 2-4 words), validity (short uppercase time window).' },
          { role: 'user', content: `Subject: ${subject}. Current mood: ${input.mood}. ${input.mode === 'friend' ? 'This is a playful roast-style prophecy about someone the visitor knows. Keep it affectionate, not cruel.' : 'Make it feel personal without inventing sensitive facts.'}` },
        ],
      }),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
    const payload = await response.json();
    const raw = payload.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Empty oracle response');
    const parsed = z.object({ title: z.string().min(2).max(80), prophecy: z.string().min(10).max(500), classification: z.string().min(2).max(80), validity: z.string().min(2).max(80) }).parse(JSON.parse(raw));
    return { ...fallback, ...parsed, generation_source: 'ai' };
  } catch (error) {
    console.error('AI oracle fallback:', error);
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  try {
    const input = schema.parse(await req.json());
    if (input.mode === 'friend' && input.subjectName.trim().length < 2) return NextResponse.json({ error: 'Give the department a name to investigate.' }, { status: 400 });
    const draft = generateOmen(input.mood, input.name, input.mode === 'friend' ? input.subjectName : '', input.relation);
    const generated = await askOpenAI(input, draft);
    const slug = makeSlug();
    const omen: Omen = { ...generated, slug, subject_name: input.mode === 'friend' ? input.subjectName.trim() : null, subject_relation: input.mode === 'friend' ? input.relation : null, generation_source: generated.generation_source || 'local', reactions: 0 };
    const db = createServerSupabase();
    if (!db) return NextResponse.json({ omen, persisted: false });
    const { data, error } = await db.from('omens').insert({ ...omen }).select('slug,title,prophecy,classification,validity,mood,created_at,reactions,subject_name,subject_relation,generation_source').single();
    if (error) throw error;
    return NextResponse.json({ omen: data, persisted: true });
  } catch (error) {
    console.error('omen create error', error);
    return NextResponse.json({ error: 'The department misplaced your paperwork.' }, { status: 400 });
  }
}

export async function GET() {
  const db = createServerSupabase();
  if (!db) return NextResponse.json({ omens: [] });
  const { data, error } = await db.from('omens').select('slug,title,prophecy,classification,validity,mood,created_at,reactions,subject_name,subject_relation,generation_source').order('created_at', { ascending: false }).limit(6);
  if (error) return NextResponse.json({ omens: [] });
  return NextResponse.json({ omens: data || [] });
}
