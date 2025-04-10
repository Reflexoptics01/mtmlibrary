import BorrowingDetailClient from './BorrowingDetailClient';

interface PageProps {
  params: {
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function BorrowingDetail({ params, searchParams }: PageProps) {
  return <BorrowingDetailClient params={params} />;
}

