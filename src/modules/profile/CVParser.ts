import 'server-only';
import { z } from 'zod';
import { extractText, getDocumentProxy } from 'unpdf';
import { generateStructured } from '@/lib/ai/generate';
import { CVData } from '../../shared/types/UserProfile';

// Een cv is een paar pagina's; alles daarboven is waarschijnlijk geen cv
const MAX_CV_CHARS = 60_000;

const cvSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
  education: z.array(
    z.object({ institution: z.string(), degree: z.string(), field: z.string(), graduationYear: z.number().int().nullable() }),
  ),
  experience: z.array(
    z.object({ company: z.string(), role: z.string(), from: z.string(), to: z.string().nullable(), description: z.string() }),
  ),
});

const SYSTEM_PROMPT = `You extract structured data from a CV for a career matching engine.
- summary: two sentences in English describing who this person is professionally.
- skills: concrete hard skills, tools and methods (max 25), as short names ("Python", "Figma", "SQL").
- languages: spoken languages, with level if stated ("Dutch (B1)").
- interests: topics and sectors the person seems drawn to, based on projects, study and hobbies (max 10).
- education and experience: as listed. Use "" for unknown text fields and null for unknown years or end dates.
Only use information that is in the CV.`;

// S: alleen verantwoordelijk voor het parsen van CV-bestanden
export class CVParser {
  async parseFromPDF(fileBuffer: ArrayBuffer): Promise<CVData> {
    // Kopie: pdf.js kan de buffer overdragen (detached), terwijl we hem daarna nog uploaden
    const pdf = await getDocumentProxy(new Uint8Array(fileBuffer).slice());
    const { text } = await extractText(pdf, { mergePages: true });
    return this.parseFromText(text);
  }

  async parseFromText(text: string): Promise<CVData> {
    const rawText = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim().slice(0, MAX_CV_CHARS);
    const empty: CVData = { rawText, skills: [], education: [], experience: [], languages: [], interests: [], summary: '' };
    if (!rawText) return empty;

    const parsed = await generateStructured({
      schema: cvSchema,
      system: SYSTEM_PROMPT,
      effort: 'low',
      prompt: `<cv>\n${rawText}\n</cv>`,
    });
    if (!parsed) return empty;

    return {
      rawText,
      summary: parsed.summary.trim(),
      skills: parsed.skills.map((skill) => skill.trim()).filter(Boolean).slice(0, 25),
      languages: parsed.languages.map((language) => language.trim()).filter(Boolean),
      interests: parsed.interests.map((interest) => interest.trim()).filter(Boolean).slice(0, 10),
      education: parsed.education.map((entry) => ({ ...entry, graduationYear: entry.graduationYear ?? 0 })),
      experience: parsed.experience.map((entry) => ({
        company: entry.company,
        role: entry.role,
        from: new Date(entry.from),
        to: entry.to ? new Date(entry.to) : undefined,
        description: entry.description,
      })),
    };
  }
}
