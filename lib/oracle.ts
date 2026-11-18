export type Omen = {
  slug: string;
  title: string;
  prophecy: string;
  classification: string;
  validity: string;
  mood: string;
  created_at?: string;
  reactions?: number;
  subject_name?: string | null;
  subject_relation?: string | null;
  generation_source?: 'ai' | 'local';
};

const titles = ['THE RELUCTANT PROTAGONIST','THE UNFINISHED BUSINESS','THE COSMIC INTERN','THE ACCIDENTAL ICON','THE PROFESSIONAL OVERTHINKER','THE PLOT TWIST MAGNET','THE TEMPORARY LEGEND','THE SIDE-QUEST SPECIALIST','THE HUMAN LOADING SCREEN','THE UNPAID PHILOSOPHER','THE UNEXPECTED EMAIL','THE DEPARTMENT FAVORITE'];
const openings = ['A forgotten thing will find its way back to you.','Someone will say your name in a room you are not in.','An opportunity will arrive wearing the disguise of an inconvenience.','You will receive a message at precisely the wrong moment.','A small decision will have an unnecessarily cinematic consequence.','The universe has reviewed your recent activity and would like a word.','Something you have been postponing is about to become surprisingly urgent.','A stranger will unknowingly confirm a theory you have had for years.'];
const turns = ['Unfortunately, it will require you to act like you have your life together.','You will pretend this was part of the plan. It was not.','Do not ask follow-up questions. The paperwork is already complicated.','Your response will be: “That is actually so weird.” It will be.','You will tell exactly one person, who will not believe you.','The timing will be suspicious enough to make you briefly spiritual.','There is no lesson here. Some things are simply ridiculous.'];
const endings = ['Trust the process. Distrust the group chat.','Remain calm. Look busy.','Proceed with unreasonable confidence.','This is not a drill. It is barely an event.','You were warned by a website. What more do you want?'];
const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length];
export function generateOmen(mood: string, name = '', subjectName = '', relation = ''): Omen {
  const seed = Math.floor(Math.random() * 1000000);
  const first = pick(openings, seed), second = pick(turns, seed >> 2), third = pick(endings, seed >> 4);
  const subject = subjectName.trim() ? `${subjectName.trim()}, ` : name.trim() ? `${name.trim()}, ` : '';
  const relationshipLine = subjectName.trim() && relation ? `The department has reviewed your ${relation.toLowerCase()}'s recent behaviour. ` : '';
  return { slug: '', title: pick(titles, seed >> 5), prophecy: `${relationshipLine}${subject}${first} ${second} ${third}`, classification: pick(['MILDLY INCONVENIENT','SUSPICIOUSLY SPECIFIC','COSMIC ADMINISTRATION','LOW-GRADE DESTINY','UNNECESSARY FORESHADOWING'], seed >> 7), validity: pick(['UNTIL FURTHER NOTICE','NEXT 72 HOURS','THE NEXT FULL MOON','WHEN YOU LEAST NEED IT'], seed >> 9), mood };
}
