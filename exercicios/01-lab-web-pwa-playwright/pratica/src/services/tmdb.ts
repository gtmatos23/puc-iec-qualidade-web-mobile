// src/services/tmdb.ts
//
// Ao contrário de services/api.ts (catálogo mockado local, usado em /qa),
// este serviço bate numa API EXTERNA de verdade: api.themoviedb.org — é o
// que alimenta a tela principal ("/"). Também serve pra praticar network
// mocking "real": interceptar um domínio de terceiro com page.route(), não
// um fetch same-origin. Precisa de VITE_TMDB_TOKEN (veja .env.example) pra
// uso manual; os specs (06-discover-tmdb.spec.ts) nunca dependem do token,
// pois mockam a chamada antes dela sair pra rede. Não faz parte da rubrica
// dos 20pts (que roda em /qa).

import type { Movie } from '@/types/movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const POSTER_BASE = 'https://image.tmdb.org/t/p/w342';

// Tipo próprio (não o Movie mockado) — TMDB real traz poster_path, que
// vira a URL do pôster de verdade (/discover é a única tela com imagem
// real; o resto do app usa Poster.tsx por design — ver comentário lá).
export interface TMDBMovie extends Movie {
  poster_path: string | null;
}

interface TMDBMoviesResponse {
  results: TMDBMovie[];
  page?: number;
  total_pages?: number;
}

export interface DiscoverPage {
  movies: TMDBMovie[];
  hasMore: boolean;
}

export interface TMDBReview {
  id: string;
  author: string;
  content: string;
  author_details: { rating: number | null };
}

interface TMDBReviewsResponse {
  results: TMDBReview[];
}

export function posterUrl(path: string | null): string | null {
  return path ? `${POSTER_BASE}${path}` : null;
}

// Sem VITE_TMDB_TOKEN: a chamada sai do mesmo jeito (sem auth) — em uso
// manual real, o TMDB responde 401 e cai no !res.ok de quem chama. Em
// teste, o page.route() intercepta ANTES disso (não depende do token).
//
// TMDB tem 2 formatos de credencial (a página de Settings → API mostra os
// dois): "API Read Access Token" (v4, JWT longo, começa com eyJ) vai no
// header Authorization; "API Key" (v3, 32 chars hex) vai como query param
// ?api_key=. Detecta automaticamente pra aceitar qualquer um que o aluno
// copiar.
async function tmdbFetch(path: string, page = 1): Promise<Response> {
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;
  const isV4 = !!token && token.startsWith('eyJ');

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('page', String(page));
  if (token && !isV4) url.searchParams.set('api_key', token);

  const res = await fetch(url.toString(), {
    headers: isV4 ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Token TMDB ausente ou inválido — veja .env.example.'
        : `TMDB respondeu HTTP ${res.status}`,
    );
  }
  return res;
}

export async function getDiscoverMovies(page = 1): Promise<DiscoverPage> {
  const res = await tmdbFetch('/movie/popular', page);
  const data: TMDBMoviesResponse = await res.json();
  const totalPages = data.total_pages ?? 1;
  return { movies: data.results, hasMore: page < totalPages };
}

export async function getMovieReviews(id: number): Promise<TMDBReview[]> {
  const res = await tmdbFetch(`/movie/${id}/reviews`);
  const data: TMDBReviewsResponse = await res.json();
  return data.results;
}

export async function getMovieDetail(id: number): Promise<TMDBMovie> {
  const res = await tmdbFetch(`/movie/${id}`);
  return res.json();
}
