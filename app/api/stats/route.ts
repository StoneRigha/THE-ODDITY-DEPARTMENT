import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const db = createServerSupabase();
  if (!db) return NextResponse.json({ total: 0, today: 0, reactions: 0, moods: [], connected: false });
  const since = new Date(); since.setHours(0, 0, 0, 0);
  const [{ count }, { count: today }, { data }] = await Promise.all([
    db.from('omens').select('*', { count: 'exact', head: true }),
    db.from('omens').select('*', { count: 'exact', head: true }).gte('created_at', since.toISOString()),
    db.from('omens').select('mood,reactions').limit(5000),
  ]);
  const moodCounts = new Map<string, number>(); let reactions = 0;
  for (const row of data || []) { moodCounts.set(row.mood, (moodCounts.get(row.mood) || 0) + 1); reactions += row.reactions || 0; }
  const moods = [...moodCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([mood, count]) => ({ mood, count }));
  return NextResponse.json({ total: count || 0, today: today || 0, reactions, moods, connected: true });
}
