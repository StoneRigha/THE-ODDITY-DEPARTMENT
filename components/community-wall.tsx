import type { Omen } from "@/lib/oracle";
import { CommunityOmenCard } from "./community-omen-card";
const samples: Omen[] = [
  {
    slug: "the-quiet-alarm",
    title: "THE QUIET ALARM",
    prophecy:
      "You will remember something important at 2:13 AM. It will not be important in the morning. You will still write it down.",
    classification: "LOW-GRADE DESTINY",
    validity: "NEXT 72 HOURS",
    mood: "TIRED",
    reactions: 28,
  },
  {
    slug: "the-main-character-tax",
    title: "THE MAIN CHARACTER TAX",
    prophecy:
      "A minor inconvenience will humble you in public. You will recover with a level of dignity that surprises absolutely nobody.",
    classification: "MILDLY INCONVENIENT",
    validity: "UNTIL FURTHER NOTICE",
    mood: "UNHINGED",
    reactions: 19,
  },
  {
    slug: "the-unread-message",
    title: "THE UNREAD MESSAGE",
    prophecy:
      "Someone will type three paragraphs, delete them, and send “lol”. You will know exactly who it is.",
    classification: "SUSPICIOUSLY SPECIFIC",
    validity: "THE NEXT FULL MOON",
    mood: "CURIOUS",
    reactions: 43,
  },
];
export function CommunityWall({ omens = [] }: { omens?: Omen[] }) {
  const items = omens.length ? omens : samples;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.slice(0, 6).map((o, i) => (
        <CommunityOmenCard key={o.slug} omen={o} index={i} />
      ))}
    </div>
  );
}
