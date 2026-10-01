// src/screens/Discover.tsx
//
// Tela PRINCIPAL do app (rota "/") — busca da API real do TMDB
// (src/services/tmdb.ts), com pôster e comentários reais. O catálogo
// mockado/offline original foi pra "/qa" (MovieList.tsx) — é lá que os
// specs 01-05 (avaliativos, deterministicos) continuam rodando.

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiscoverMovies, type TMDBMovie } from '@/services/tmdb';
import { testIDs } from '@/utils/testIDs';
import DiscoverCard from '@/components/DiscoverCard';

type Status = 'loading' | 'ready' | 'error';

export default function Discover() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(() => {
    setStatus('loading');
    setPage(1);
    getDiscoverMovies(1)
      .then(({ movies: data, hasMore: more }) => {
        setMovies(data);
        setHasMore(more);
        setStatus('ready');
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, []);

  const loadMore = useCallback(() => {
    const next = page + 1;
    setLoadingMore(true);
    getDiscoverMovies(next)
      .then(({ movies: data, hasMore: more }) => {
        setMovies((prev) => [...prev, ...data]);
        setHasMore(more);
        setPage(next);
      })
      .finally(() => setLoadingMore(false));
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main data-testid={testIDs.discover.screen}>
      <header className="app-header">
        <h1>
          <span className="logo-mark">★</span> CineFav
        </h1>
        <button className="icon-button" onClick={() => navigate('/qa')}>
          🧪 Ambiente QA (busca, favoritos, testes)
        </button>
      </header>

      <div className="screen-body">
        {status === 'loading' && (
          <div className="state-block" data-testid={testIDs.discover.loading}>
            Buscando no TMDB…
          </div>
        )}

        {status === 'error' && (
          <div className="state-block" data-testid={testIDs.discover.error}>
            <p>{errorMessage}</p>
            <button data-testid={testIDs.discover.retry} onClick={load}>
              Tentar de novo
            </button>
          </div>
        )}

        {status === 'ready' && (
          <>
            <div className="movie-grid" data-testid={testIDs.discover.grid}>
              {movies.map((movie) => (
                <DiscoverCard key={movie.id} movie={movie} />
              ))}
            </div>
            {hasMore && (
              <button
                className="load-more-button"
                data-testid={testIDs.discover.loadMore}
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Carregando…' : 'Carregar mais'}
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
