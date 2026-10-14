// src/services/api.ts
//
// O catálogo vem de UMA rota HTTP real: GET /api/movies.json (arquivo estático
// servido junto com o app). Por que assim, e não um array importado?
//
//   1. Requisição de verdade → o Playwright consegue interceptar com
//      page.route() (network mocking — Prática 2).
//   2. O Service Worker consegue cachear a rota → o app funciona offline
//      (Prática 5).
//   3. Zero dependência externa: sem token, sem rate-limit, determinístico.

import type { Movie } from '@/types/movie';

const API_URL = '/api/movies.json';
export const PAGE_SIZE = 12;

async function fetchCatalog(): Promise<Movie[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Falha ao carregar catálogo (HTTP ${res.status})`);
  return res.json();
}

export interface PagedMovies {
  movies: Movie[];
  hasMore: boolean;
}

// Paginação CLIENT-SIDE: /api/movies.json é 1 arquivo estático só (o Service
// Worker cacheia essa única rota pra funcionar offline — Prática 5). "Página"
// aqui é um recorte do array já em memória, não uma nova requisição de rede.
export async function getPopularMovies(page = 1): Promise<PagedMovies> {
  const all = await fetchCatalog();
  const start = (page - 1) * PAGE_SIZE;
  const movies = all.slice(start, start + PAGE_SIZE);
  return { movies, hasMore: start + PAGE_SIZE < all.length };
}

// Catálogo completo, sem paginação — usado por Favorites (um favorito pode
// ter sido marcado em qualquer página, precisa do array inteiro pra resolver
// pelo id) e por busca/detalhe.
export async function getAllMovies(): Promise<Movie[]> {
  return fetchCatalog();
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = await fetchCatalog();
  return all.filter((m) => m.title.toLowerCase().includes(q));
}

export async function getMovieById(id: number): Promise<Movie | undefined> {
  const all = await fetchCatalog();
  return all.find((m) => m.id === id);
}
