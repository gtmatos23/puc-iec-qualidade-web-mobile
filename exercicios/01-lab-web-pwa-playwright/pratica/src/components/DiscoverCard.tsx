// src/components/DiscoverCard.tsx
//
// 🎁 BÔNUS — card de /discover com comentários reais do TMDB
// (GET /movie/:id/reviews). Expande sob demanda (não busca tudo de uma vez).

import { useState } from 'react';
import type { TMDBMovie, TMDBReview } from '@/services/tmdb';
import { getMovieReviews, posterUrl } from '@/services/tmdb';
import { testIDs } from '@/utils/testIDs';
import Poster from './Poster';

type ReviewsState = 'closed' | 'loading' | 'open' | 'error';

interface Props {
  movie: TMDBMovie;
}

export default function DiscoverCard({ movie }: Props) {
  const [reviewsState, setReviewsState] = useState<ReviewsState>('closed');
  const [reviews, setReviews] = useState<TMDBReview[]>([]);

  const toggleReviews = () => {
    if (reviewsState === 'open') {
      setReviewsState('closed');
      return;
    }
    setReviewsState('loading');
    getMovieReviews(movie.id)
      .then((data) => {
        setReviews(data);
        setReviewsState('open');
      })
      .catch(() => setReviewsState('error'));
  };

  const url = posterUrl(movie.poster_path);

  return (
    <article className="movie-card" data-testid={testIDs.discover.card(movie.id)}>
      {url ? (
        <img className="poster" src={url} alt={`Pôster de ${movie.title}`} loading="lazy" />
      ) : (
        <Poster title={movie.title} />
      )}
      <div className="movie-card-body">
        <h3 className="movie-card-title" data-testid={testIDs.discover.title(movie.id)}>
          {movie.title}
        </h3>
        <span>⭐ {movie.vote_average.toFixed(1)}</span>

        <button
          className="icon-button reviews-toggle"
          data-testid={testIDs.discover.reviewsButton(movie.id)}
          onClick={toggleReviews}
        >
          {reviewsState === 'open' ? '▲ Fechar comentários' : '💬 Ver comentários'}
        </button>

        {reviewsState === 'loading' && <p>Carregando comentários…</p>}

        {reviewsState === 'error' && <p>Não foi possível carregar os comentários.</p>}

        {reviewsState === 'open' && reviews.length === 0 && (
          <p data-testid={testIDs.discover.reviewsEmpty(movie.id)}>Sem comentários ainda nesse filme.</p>
        )}

        {reviewsState === 'open' && reviews.length > 0 && (
          <ul className="reviews-list" data-testid={testIDs.discover.reviewsList(movie.id)}>
            {reviews.slice(0, 3).map((r) => (
              <li key={r.id} data-testid={testIDs.discover.reviewItem(r.id)}>
                <strong>{r.author}</strong>
                {r.author_details.rating ? ` — ⭐ ${r.author_details.rating}` : ''}
                <p>{r.content.length > 240 ? `${r.content.slice(0, 240)}…` : r.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
