import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompanyDetail } from '@/components/companies/CompanyDetail';
import { getT } from '@/i18n/server';
import { getActivity, getCompany, getProfile } from '@/lib/data/queries';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const [{ id }, t] = await Promise.all([params, getT()]);
  const company = await getCompany(decodeURIComponent(id));
  return { title: company?.name ?? t.companies.meta.title };
}

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [company, profile, activity] = await Promise.all([getCompany(decodeURIComponent(id)), getProfile(), getActivity()]);
  if (!company) notFound();

  return <CompanyDetail company={company} activity={activity} studentSkills={profile?.skills ?? []} />;
}