import type { Metadata } from 'next';
import { getT } from '@/i18n/server';
import { publicPageMetadata } from '@/lib/seo';
import { LegalPage } from '../_components/LegalPage';

export async function generateMetadata(): Promise<Metadata> {
  const { terms } = (await getT()).legal;
  return publicPageMetadata('/terms', { title: terms.metaTitle, description: terms.metaDescription });
}

export default async function TermsPage() {
  return <LegalPage doc={(await getT()).legal.terms} path="/terms" />;
}
