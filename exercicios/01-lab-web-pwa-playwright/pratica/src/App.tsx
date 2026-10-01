import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { currentUser } from '@/store/auth';
import { testIDs } from '@/utils/testIDs';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineBanner from '@/components/OfflineBanner';
import Login from '@/screens/Login';
import MovieList from '@/screens/MovieList';

// Rotas secundárias em chunks separados (lazy loading — assunto da aula de SPA).
// Na primeira navegação o chunk é baixado e o fallback `route-loading` aparece.
const Search = lazy(() => import('@/screens/Search'));
const Favorites = lazy(() => import('@/screens/Favorites'));
const MovieDetail = lazy(() => import('@/screens/MovieDetail'));
const Discover = lazy(() => import('@/screens/Discover')); // 🎁 bônus — TMDB real

function RequireAuth({ children }: { children: JSX.Element }) {
  if (!currentUser()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  // Sinal de "app interativo": os testes esperam por este atributo em vez de
  // sleep arbitrário (estratégia de waiting — aula de SPA).
  useEffect(() => {
    document.documentElement.dataset.appReady = 'true';
  }, []);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <Suspense
        fallback={
          <div className="route-loading" data-testid={testIDs.shell.routeLoading}>
            Carregando…
          </div>
        }
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <MovieList />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />
          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <RequireAuth>
                <MovieDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/discover"
            element={
              <RequireAuth>
                <Discover />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
