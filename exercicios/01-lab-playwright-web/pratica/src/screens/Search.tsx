import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { searchMovies } from '@/services/api';
import { testIDs } from '@/utils/testIDs';
import Poster from '@/components/Poster';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }
    // debounce curto: busca dispara enquanto digita, sem flood de fetch
    const t = setTimeout(() => {
      searchMovies(q).then((data) => {
        setResults(data);
        setSearched(true);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <main data-testid={testIDs.search.screen}>
      <header className="app-header">
        <h1>Buscar</h1>
        <button className="icon-button" onClick={() => navigate('/')}>
          ← Voltar
        </button>
      </header>

      <div className="screen-body">
        <div className="search-bar">
          <input
            data-testid={testIDs.search.input}
            placeholder="Título do filme…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="icon-button"
              data-testid={testIDs.search.clear}
              onClick={() => setQuery('')}
            >
              Limpar
            </button>
          )}
        </div>

        {searched && results.length === 0 && (
          <div className="state-block" data-testid={testIDs.search.empty}>
            Nenhum filme encontrado pra “{query}”.
          </div>
        )}

        <div className="row-list">
          {results.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="row-item"
              data-testid={testIDs.search.result(movie.id)}
            >
              <Poster title={movie.title} small />
              <span className="row-title">{movie.title}</span>
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
