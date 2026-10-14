import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { getAllMovies } from '@/services/api';
import { toggleFavorite, useFavorites } from '@/store/favorites';
import { testIDs } from '@/utils/testIDs';
import Poster from '@/components/Poster';

export default function Favorites() {
  const navigate = useNavigate();
  const favoriteIds = useFavorites();
  const [catalog, setCatalog] = useState<Movie[]>([]);

  useEffect(() => {
    getAllMovies().then(setCatalog).catch(() => setCatalog([]));
  }, []);

  const favorites = catalog.filter((m) => favoriteIds.includes(m.id));

  return (
    <main data-testid={testIDs.favorites.screen}>
      <header className="app-header">
        <h1>Favoritos</h1>
        <button className="icon-button" onClick={() => navigate('/')}>
          ← Voltar
        </button>
      </header>

      <div className="screen-body">
        <p data-testid={testIDs.favorites.count}>
          {favorites.length} {favorites.length === 1 ? 'filme favorito' : 'filmes favoritos'}
        </p>

        {favorites.length === 0 && (
          <div className="state-block" data-testid={testIDs.favorites.empty}>
            Nada por aqui ainda — favorite um filme na lista. 🤍
          </div>
        )}

        <div className="row-list">
          {favorites.map((movie) => (
            <div key={movie.id} className="row-item" data-testid={testIDs.favorites.item(movie.id)}>
              <Poster title={movie.title} small />
              <Link to={`/movie/${movie.id}`} className="row-title">
                {movie.title}
              </Link>
              <button
                className="icon-button"
                data-testid={testIDs.favorites.removeItem(movie.id)}
                aria-label={`Remover ${movie.title} dos favoritos`}
                onClick={() => toggleFavorite(movie.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
