import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NewPasswordForm } from '@/components/auth/PasswordResetForms';
import { getT } from '@/i18n/server';
import { getCurrentUser } from '@/lib/data/queries';

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getT()).auth.reset.newMetaTitle };
}

// Alleen bereikbaar met de sessie die /auth/callback van de resetlink maakt
export default async function ResetPasswordPage() {
  if (!(await getCurrentUser())) redirect('/forgot-password?expired=1');
  return <NewPasswordForm />;
}
