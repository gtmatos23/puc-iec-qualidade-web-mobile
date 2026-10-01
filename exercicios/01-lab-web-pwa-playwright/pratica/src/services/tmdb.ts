// src/services/tmdb.ts
//
// 🎁 BÔNUS — ao contrário de services/api.ts (catálogo mockado local), este
// serviço bate numa API EXTERNA de verdade: api.themoviedb.org. Existe pra
// praticar network mocking "real" — interceptar um domínio de terceiro com
// page.route(), não um fetch same-origin. Precisa de VITE_TMDB_TOKEN (veja
// .env.example). Não faz parte da rubrica dos 20pts.

import type { Movie } from '@/types/movie';

const TMDB_BASE = 'https://api.themoviedb.org/3';

interface TMDBResponse {
  results: Movie[];
}

export async function getDiscoverMovies(): Promise<Movie[]> {
  // Sem VITE_TMDB_TOKEN: a chamada sai do mesmo jeito (sem Authorization) —
  // em uso manual real, o TMDB responde 401 e cai no !res.ok abaixo. Em
  // teste, o page.route() intercepta ANTES disso (não depende do token).
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

  const res = await fetch(`${TMDB_BASE}/movie/popular?language=pt-BR&page=1`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Token TMDB ausente ou inválido — veja .env.example.'
        : `TMDB respondeu HTTP ${res.status}`,
    );
  }

  const data: TMDBResponse = await res.json();
  return data.results;
}
