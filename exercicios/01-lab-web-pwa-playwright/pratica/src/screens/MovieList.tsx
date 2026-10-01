import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { getPopularMovies } from '@/services/api';
import { testIDs } from '@/utils/testIDs';
import MovieCard from '@/components/MovieCard';

type Status = 'loading' | 'ready' | 'error';

export default function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  const load = useCallback(() => {
    setStatus('loading');
    getPopularMovies()
      .then((data) => {
        setMovies(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main data-testid={testIDs.movieList.screen}>
      <header className="app-header">
        <h1>
          <span className="logo-mark">★</span> CineFav
        </h1>
        <button
          className="icon-button"
          data-testid={testIDs.movieList.searchButton}
          onClick={() => navigate('/search')}
        >
          🔍 Buscar
        </button>
        <button
          className="icon-button"
          data-testid={testIDs.movieList.favoritesButton}
          onClick={() => navigate('/favorites')}
        >
          ❤️ Favoritos
        </button>
        <button className="icon-button" onClick={() => navigate('/discover')}>
          🌐 Descobrir (bônus)
        </button>
      </header>

      <div className="screen-body">
        {status === 'loading' && (
          <div className="state-block" data-testid={testIDs.movieList.loading}>
            Carregando filmes…
          </div>
        )}

        {status === 'error' && (
          <div className="state-block" data-testid={testIDs.movieList.error}>
            <p>Não foi possível carregar o catálogo.</p>
            <button data-testid={testIDs.movieList.retry} onClick={load}>
              Tentar de novo
            </button>
          </div>
        )}

        {status === 'ready' && (
          <div className="movie-grid" data-testid={testIDs.movieList.list}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
