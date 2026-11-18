import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = createServerSupabase();
  if (!db) return NextResponse.json({ error: 'The public archive is offline.' }, { status: 503 });
  const { data, error } = await db.rpc('increment_omen_reactions', { omen_slug: slug });
  if (error) return NextResponse.json({ error: 'Could not record reaction.' }, { status: 404 });
  return NextResponse.json({ reactions: data });
}
