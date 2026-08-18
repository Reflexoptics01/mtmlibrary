'use client';

import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/db';

export default function LibraryBrand({ fallback = 'Maktaba' }: { fallback?: string }) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((s) => {
        if (!cancelled && s.libraryName) setName(s.libraryName);
      })
      .catch(() => {
        // No config or offline: keep the fallback name.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{name}</>;
}
