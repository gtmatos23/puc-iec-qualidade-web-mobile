// src/screens/Discover.tsx
//
// 🎁 BÔNUS — mesma estrutura de MovieList.tsx, mas busca da API real do TMDB
// (src/services/tmdb.ts) em vez do catálogo mockado local. O resto do app
// (tela principal, favoritos, busca) continua 100% offline/determinístico.

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDiscoverMovies, posterUrl, type TMDBMovie } from '@/services/tmdb';
import { testIDs } from '@/utils/testIDs';
import Poster from '@/components/Poster';

type Status = 'loading' | 'ready' | 'error';

export default function Discover() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(() => {
    setStatus('loading');
    getDiscoverMovies()
      .then((data) => {
        setMovies(data);
        setStatus('ready');
      })
      .catch((err: Error) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main data-testid={testIDs.discover.screen}>
      <header className="app-header">
        <h1>🌐 Descobrir (TMDB)</h1>
        <Link to="/" className="icon-button">
          ← Voltar
        </Link>
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
          <div className="movie-grid" data-testid={testIDs.discover.grid}>
            {movies.map((movie) => (
              <article
                key={movie.id}
                className="movie-card"
                data-testid={testIDs.discover.card(movie.id)}
              >
                {posterUrl(movie.poster_path) ? (
                  <img
                    className="poster"
                    src={posterUrl(movie.poster_path)!}
                    alt={`Pôster de ${movie.title}`}
                    loading="lazy"
                  />
                ) : (
                  <Poster title={movie.title} />
                )}
                <div className="movie-card-body">
                  <h3
                    className="movie-card-title"
                    data-testid={testIDs.discover.title(movie.id)}
                  >
                    {movie.title}
                  </h3>
                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
