import 'server-only';
import { z } from 'zod';
import { generateStructured } from '@/lib/ai/generate';
import { OPPORTUNITY_TYPE_LABELS } from '@/shared/constants/opportunityTypes';
import type { OpportunityType } from '@/shared/types/OpportunityType';

export interface EmailContext {
  student: {
    name: string | null;
    degree: string | null;
    fieldOfStudy: string | null;
    university: string | null;
    skills: string[];
    interests: string[];
    ambitions: string | null;
    linkedinUrl: string | null;
    portfolioUrl: string | null;
  };
  opportunity: {
    title: string;
    type: OpportunityType;
    company: string;
    description: string | null;
    location: string | null;
    startsAt: string | null;
    signals: string[];
    url: string;
  };
  contact: { name: string | null; role: string | null };
  matchReasons: string[];
}

export interface DraftEmail {
  subject: string;
  body: string;
}

const draftSchema = z.object({ subject: z.string(), body: z.string() });

const SYSTEM_PROMPT = `You write first-contact emails for a student or recent graduate who is looking for work, internships and professional opportunities in the Netherlands.
Write one short, warm and specific email from the student to the contact person:
- Open by naming the specific opportunity, event, project or news that prompted the email.
- Connect it to one or two concrete things from the student's profile (skills, study, interests, ambitions).
- End with one low-effort ask: a short call, a coffee, or meeting at the event.
- 90 to 150 words, plain text, no bullet points, no placeholders like [name].
- Use only facts from the input. Never invent experience, projects or achievements.
- Write in English unless the opportunity text is clearly Dutch, then write in Dutch.
- Sign off with the student's name and, if present, their LinkedIn and portfolio URLs on separate lines.
Return a subject line (under 70 characters) and the body.`;

function firstName(name: string | null) {
  return name?.trim().split(/\s+/)[0] || null;
}

// Nette standaardtekst als er geen AI beschikbaar is
export function templateEmail({ student, opportunity, contact }: EmailContext): DraftEmail {
  const greeting = firstName(contact.name) ? `Hi ${firstName(contact.name)},` : 'Hi there,';
  const kind = OPPORTUNITY_TYPE_LABELS[opportunity.type].toLowerCase();
  const where = student.university ? ` at ${student.university}` : '';
  const who = student.fieldOfStudy
    ? `I'm studying ${student.fieldOfStudy}${student.degree ? ` (${student.degree})` : ''}${where}`
    : `I'm a student${where}`;
  const skills = student.skills.slice(0, 3).join(', ');
  const interest = student.interests[0];

  const lines = [
    greeting,
    '',
    `I came across ${opportunity.title} at ${opportunity.company} and it immediately caught my attention.`,
    `${who}${skills ? ` and I work with ${skills}` : ''}${interest ? `, with a strong interest in ${interest}` : ''}.`,
    '',
    ['event', 'hackathon', 'conference', 'networking'].includes(opportunity.type)
      ? `I'd love to join this ${kind} and meet the team. Would you be open to a short chat beforehand, or should I just say hello there?`
      : `I'd love to learn more about what you're working on and whether I could contribute. Would you be open to a short call in the coming weeks?`,
    '',
    'Best regards,',
    student.name ?? '',
    student.linkedinUrl ?? '',
    student.portfolioUrl ?? '',
  ];

  return {
    subject: `${opportunity.title} – ${student.name ?? 'introduction'}`.slice(0, 90),
    body: lines
      .filter((line, index, all) => line !== '' || (all[index - 1] !== '' && index > 0))
      .join('\n')
      .trim(),
  };
}

export async function writeOutreachEmail(context: EmailContext): Promise<DraftEmail> {
  const draft = await generateStructured({
    schema: draftSchema,
    system: SYSTEM_PROMPT,
    effort: 'medium',
    prompt: `<student>\n${JSON.stringify(context.student, null, 2)}\n</student>\n\n<opportunity>\n${JSON.stringify(
      { ...context.opportunity, type: OPPORTUNITY_TYPE_LABELS[context.opportunity.type], description: context.opportunity.description?.slice(0, 3000) },
      null,
      2,
    )}\n</opportunity>\n\n<contact>\n${JSON.stringify(context.contact)}\n</contact>\n\n<why_it_fits>\n${context.matchReasons.join('\n')}\n</why_it_fits>`,
  });

  if (draft && draft.subject.trim() && draft.body.trim()) {
    return { subject: draft.subject.trim().slice(0, 200), body: draft.body.trim() };
  }
  return templateEmail(context);
}
