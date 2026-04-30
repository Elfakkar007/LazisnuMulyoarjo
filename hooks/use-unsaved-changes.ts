// =====================================================
// UNSAVED CHANGES HOOK
// Warns users before leaving a page with unsaved changes
// =====================================================

'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect and warn about unsaved changes.
 * - Shows browser-native "Leave site?" dialog on refresh/close
 * - Tracks dirty state so components can display visual indicators
 * 
 * @param isDirty - Whether there are unsaved changes
 */
export function useUnsavedChanges(isDirty: boolean) {
  const isDirtyRef = useRef(isDirty);

  // Keep ref in sync
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // Browser beforeunload (refresh, close tab, navigate away)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      e.preventDefault();
      // Modern browsers ignore custom messages but still show the dialog
      e.returnValue = 'Perubahan belum disimpan. Yakin ingin meninggalkan halaman?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
}
