import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/PasswordResetForms';
import { getT } from '@/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).auth.reset.metaTitle };
}

// ?expired=1: de resetlink uit de mail werkte niet (verlopen, al gebruikt of andere browser)
export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  const { expired } = await searchParams;
  return <ForgotPasswordForm expired={expired === '1'} />;
}
