import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BY_DAY } from '@/data/derived';
import { ERA_BY_ID } from '@/data/eras';
import { PROJECTS, TOTAL_DAYS } from '@/data/projects';
import { ArchiveProvider } from '@/state/archive';
import { Experience } from '@/components/Experience';

/** All 200 days are prerendered — deep links are static, not dynamic. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ day: String(p.day) }));
}

export const dynamicParams = false;

type Params = Promise<{ day: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { day } = await params;
  const project = BY_DAY.get(Number(day));
  if (!project) return { title: 'Not found' };

  const era = ERA_BY_ID[project.era];
  const title = `Day ${project.day} — ${project.title}`;
  const description = `${project.description} Era ${era.numeral}: ${era.name}. Build ${project.day} of ${TOTAL_DAYS}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `/day/${project.day}` },
  };
}

export default async function DayPage({ params }: { params: Params }) {
  const { day } = await params;
  const numeric = Number(day);
  if (!Number.isInteger(numeric) || !BY_DAY.has(numeric)) notFound();

  return (
    <ArchiveProvider initialDay={numeric}>
      <Experience initialDay={numeric} />
    </ArchiveProvider>
  );
}
