// Server Component
import RisalaDetailClient from './RisalaDetailClient';

// This follows the exact pattern for Next.js App Router dynamic routes
export default function RisalaPage({ params }: { params: { id: string } }) {
  return <RisalaDetailClient id={params.id} />;
}
