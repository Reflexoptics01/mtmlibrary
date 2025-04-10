// Server Component
import RisalaDetailClient from './RisalaDetailClient';

// Define the proper types for Next.js 15 page props with async params
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RisalaPage({ params }: PageProps) {
  // Await the params promise to get the actual params object
  const resolvedParams = await params;
  return <RisalaDetailClient id={resolvedParams.id} />;
}
