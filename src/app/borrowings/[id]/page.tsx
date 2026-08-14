import BorrowingDetailClient from './BorrowingDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BorrowingDetail({ params }: PageProps) {
  const { id } = await params;
  return <BorrowingDetailClient id={id} />;
}
