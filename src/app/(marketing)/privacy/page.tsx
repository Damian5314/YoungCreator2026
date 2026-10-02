import type { Metadata } from 'next';
import { getT } from '@/i18n/server';
import { publicPageMetadata } from '@/lib/seo';
import { LegalPage } from '../_components/LegalPage';

export async function generateMetadata(): Promise<Metadata> {
  const { privacy } = (await getT()).legal;
  return publicPageMetadata('/privacy', { title: privacy.metaTitle, description: privacy.metaDescription });
}

export default async function PrivacyPage() {
  return <LegalPage doc={(await getT()).legal.privacy} path="/privacy" />;
}
