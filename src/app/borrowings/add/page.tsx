'use client';

import { Suspense } from 'react';
import Layout from '@/components/layout/Layout';
import AddBorrowingForm from './AddBorrowingForm';

export default function AddBorrowingPage() {
  return (
    <Suspense fallback={<Layout><p className="text-center py-8">Loading...</p></Layout>}>
      <AddBorrowingForm />
    </Suspense>
  );
}
