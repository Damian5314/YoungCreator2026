import type { Metadata } from 'next';
import { CircleCheck, MailX, TriangleAlert } from 'lucide-react';
import { StatusPage } from '@/components/layout/StatusPage';
import { ButtonLink } from '@/components/ui/Button';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { getT } from '@/i18n/server';
import { NO_INDEX } from '@/lib/seo';
import { isValidUnsubscribeToken } from '@/modules/outreach/unsubscribe';
import { confirmUnsubscribe } from './actions';

export async function generateMetadata(): Promise<Metadata> {
  return { ...NO_INDEX, title: (await getT()).support.unsubscribe.metaTitle };
}

// Afmelden voor outreach-mails via de ondertekende link onder elke mail die Unlisted verstuurt
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ e?: string; t?: string; done?: string }> }) {
  const t = await getT();
  const u = t.support.unsubscribe;
  const { e = '', t: token = '', done } = await searchParams;

  if (done === '1') {
    return (
      <StatusPage
        icon={CircleCheck}
        title={u.doneTitle}
        body={u.doneBody}
        actions={<ButtonLink href="/" variant="secondary" shape="pill" size="lg">{t.common.states.toHome}</ButtonLink>}
      />
    );
  }

  const email = e.trim().toLowerCase();
  if (!email || !token || !isValidUnsubscribeToken(email, token)) {
    return (
      <StatusPage
        icon={TriangleAlert}
        title={u.invalidTitle}
        body={u.invalidBody}
        actions={<ButtonLink href="/contact" shape="pill" size="lg">{t.common.states.contactSupport}</ButtonLink>}
      />
    );
  }

  return (
    <StatusPage
      icon={MailX}
      title={u.title}
      body={u.body(email)}
      actions={
        <form action={confirmUnsubscribe}>
          <input type="hidden" name="e" value={email} />
          <input type="hidden" name="t" value={token} />
          <SubmitButton size="lg">{u.button}</SubmitButton>
        </form>
      }
    />
  );
}
