import { SiteHeader } from "@/components/site-header";
import { OracleMachine } from "@/components/oracle-machine";
import { CommunityWall } from "@/components/community-wall";
import { DepartmentStats } from "@/components/department-stats";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Omen } from "@/lib/oracle";
import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
export const revalidate = 30;
async function getOmens(): Promise<Omen[]> {
  const db = createServerSupabase();
  if (!db) return [];
  const { data } = await db
    .from("omens")
    .select(
      "slug,title,prophecy,classification,validity,mood,created_at,reactions",
    )
    .order("created_at", { ascending: false })
    .limit(6);
  return (data || []) as Omen[];
}
export default async function Home() {
  const omens = await getOmens();
  return (
    <main>
      <SiteHeader />
      <section className="relative overflow-hidden px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="absolute -right-40 top-0 h-[560px] w-[560px] rounded-full border border-[#a47d55]/10" />
        <div className="absolute -right-24 top-16 h-[400px] w-[400px] rounded-full border border-[#a47d55]/10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3 font-mono text-[10px] tracking-[.2em] text-[#b58b60]">
            <span className="h-px w-8 bg-[#a47d55]" /> AN UNNECESSARY INTERNET
            EXPERIMENT <span className="text-[#777568]">№ 001</span>
          </div>
          <h1 className="max-w-5xl font-display text-[clamp(3.6rem,9vw,8.7rem)] font-medium leading-[.88] tracking-[-.065em]">
            THE UNIVERSE
            <br />
            <span className="text-[#a47d55]">HAS A WEIRD</span>
            <br />
            SENSE OF HUMOUR.
          </h1>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-lg text-base leading-7 text-[#b0ada2] md:text-lg">
              A highly unofficial department for extremely specific predictions
              about your otherwise ordinary existence. We have no credentials.
              We do have a machine.
            </p>
            <a
              href="#oracle"
              className="flex items-center gap-3 font-mono text-[10px] tracking-[.16em] text-[#d4b58c] transition hover:gap-5"
            >
              SUBMIT TO THE INEVITABLE <ArrowDown size={15} />
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-8 right-10 hidden font-display text-7xl italic text-[#a47d55]/20 lg:block">
          ∴
        </div>
      </section>
      <section
        id="oracle"
        className="border-y hairline bg-[#20211d] px-5 py-16 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 font-mono text-[9px] tracking-[.22em] text-[#a47d55]">
                01 / THE CONSULTATION
              </p>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Let&apos;s see what happens.
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[9px] leading-relaxed tracking-[.1em] text-[#888477]">
              THE FOLLOWING IS NOT LEGALLY BINDING, SPIRITUALLY VERIFIED, OR
              PARTICULARLY USEFUL.
            </p>
          </div>
          <OracleMachine />
        </div>
      </section>
      <section id="how-it-works" className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 font-mono text-[9px] tracking-[.22em] text-[#a47d55]">
              02 / PROCEDURE
            </p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              A process of questionable science.
            </h2>
          </div>
          <div className="grid gap-7 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Declare your vibe",
                d: "Tell the machine what kind of day your soul is having. No context required.",
              },
              {
                n: "02",
                t: "Receive your omen",
                d: "Our highly dubious algorithm assembles a prediction with unsettling confidence.",
              },
              {
                n: "03",
                t: "Make it everyone’s problem",
                d: "Save your card. Send it to a friend. Let them wonder why it is so accurate.",
              },
            ].map((x) => (
              <div key={x.n} className="border-t border-[#a47d55]/50 pt-4">
                <span className="font-mono text-xs text-[#a47d55]">{x.n}</span>
                <h3 className="mt-5 font-display text-xl">{x.t}</h3>
                <p className="mt-3 text-sm leading-6 text-[#a9a496]">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="community"
        className="border-y hairline bg-[#20211d] px-5 py-20 md:px-10 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 font-mono text-[9px] tracking-[.22em] text-[#a47d55]">
                03 / THE PUBLIC RECORD
              </p>
              <h2 className="font-display text-4xl md:text-5xl">
                Other people’s problems.
              </h2>
              <p className="mt-3 max-w-md text-sm text-[#a9a496]">
                A growing archive of things the universe apparently felt you
                needed to hear.
              </p>
            </div>
            <span className="flex items-center gap-2 font-mono text-[9px] tracking-[.14em] text-[#a47d55]">
              <Asterisk size={15} />{" "}
              {omens.length ? `${omens.length} RECENT FILES` : "SELECTED FILES"}
            </span>
          </div>
          <CommunityWall omens={omens} />
          <div className="mt-7 flex justify-end">
            <a
              href="#oracle"
              className="flex items-center gap-2 font-mono text-[9px] tracking-[.16em] text-[#d4b58c] hover:text-white"
            >
              ADD YOURS TO THE RECORD <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </section>
      <section id="statistics" className="px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <DepartmentStats />
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 font-mono text-[9px] tracking-[.14em] text-[#858276] sm:flex-row sm:items-center sm:justify-between md:px-10">
        <span>© 2026 THE ODDITY DEPARTMENT. ALL OMENS RESERVED.</span>
        <span>BUILT ON CURIOSITY & QUESTIONABLE CERTAINTY.</span>
        <a href="#top" className="text-[#b58b60]">
          BACK TO THE TOP ↑
        </a>
      </footer>
    </main>
  );
}
