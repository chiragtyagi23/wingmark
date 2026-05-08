import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'wingsmark.visited.v1';
const EVENT_NAME = 'wingsmark-visited-changed';
const MAX_ENTRIES = 30;

function readStore() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(list) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore quota / private mode errors */
  }
}

/**
 * Push (or refresh) a visited listing entry. Newest visits float to the top.
 * Caller passes a stable `id` (e.g. `land/<slug>` or `plot/<slug>`).
 */
export function recordVisit(entry) {
  if (!entry || !entry.id) return;
  const cur = readStore();
  const filtered = cur.filter((e) => e.id !== entry.id);
  const next = [{ ...entry, visitedAt: Date.now() }, ...filtered].slice(
    0,
    MAX_ENTRIES
  );
  writeStore(next);
}

/**
 * React hook returning the visited list and mutators. The list updates live
 * across components (and across browser tabs via the storage event).
 */
export function useVisitedListings() {
  const [entries, setEntries] = useState(() => readStore());

  useEffect(() => {
    const sync = () => setEntries(readStore());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const remove = useCallback((ids) => {
    const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
    if (idSet.size === 0) return;
    const cur = readStore();
    writeStore(cur.filter((e) => !idSet.has(e.id)));
  }, []);

  const clear = useCallback(() => {
    writeStore([]);
  }, []);

  return { entries, remove, clear };
}
