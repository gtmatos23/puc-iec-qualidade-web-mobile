// src/store/favorites.ts
//
// Favoritos persistidos em localStorage, com useSyncExternalStore pra
// qualquer tela reagir a mudanças (mesma semântica do favoritesStore mobile).

import { useSyncExternalStore } from 'react';

const KEY = 'cinefav-favorites';

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): number[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as number[];
  } catch {
    return [];
  }
}

let snapshot: number[] = [];
let snapshotRaw = '';

function getSnapshot(): number[] {
  const raw = localStorage.getItem(KEY) ?? '[]';
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = read();
  }
  return snapshot;
}

function emit() {
  listeners.forEach((l) => l());
}

export function toggleFavorite(id: number): void {
  const ids = read();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

export function isFavorite(id: number): boolean {
  return read().includes(id);
}

export function useFavorites(): number[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot,
    getSnapshot,
  );
}
