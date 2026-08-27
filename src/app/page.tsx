import { ArchiveProvider } from '@/state/archive';
import { Experience } from '@/components/Experience';

export default function Home() {
  return (
    <ArchiveProvider>
      <Experience />
    </ArchiveProvider>
  );
}
