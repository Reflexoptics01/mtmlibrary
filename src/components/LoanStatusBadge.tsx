import type { LoanStatus } from '@/lib/types';

const styles: Record<LoanStatus, string> = {
  Borrowed: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
  Returned: 'bg-green-50 text-green-600',
  Lost: 'bg-amber-100 text-amber-800',
};

export default function LoanStatusBadge({ status }: { status: LoanStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
        styles[status] ?? 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
}
