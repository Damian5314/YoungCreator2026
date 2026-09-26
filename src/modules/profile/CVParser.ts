import { CVData } from '../../shared/types/UserProfile';

// S: alleen verantwoordelijk voor het parsen van CV-bestanden
export class CVParser {
  async parseFromPDF(fileBuffer: Buffer): Promise<CVData> {
    // TODO: extraheer tekst uit PDF en parse naar CVData structuur via AI
    return {
      rawText: '',
      skills: [],
      education: [],
      experience: [],
      languages: [],
      summary: '',
    };
  }

  async parseFromText(text: string): Promise<CVData> {
    // TODO: parse vrije tekst naar CVData structuur via AI
    return {
      rawText: text,
      skills: [],
      education: [],
      experience: [],
      languages: [],
      summary: '',
    };
  }
}
