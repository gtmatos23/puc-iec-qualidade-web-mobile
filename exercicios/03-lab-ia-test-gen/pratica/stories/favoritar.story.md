# User story — Favoritar um filme

**Como** usuário logado do CineFav
**Quero** favoritar um filme na lista e conferir na tela de favoritos
**Para** guardar os filmes que pretendo assistir

## Critérios de aceite

1. Após login, a lista de filmes aparece (`movielist-grid`) com o card do Matrix (`movie-card-603`).
2. Clicar no coração do Matrix (`movie-card-heart-603`) favorita o filme.
3. Clicar no botão de favoritos (`movielist-favorites-button`) abre a tela `favorites-screen` e o item `favorites-item-603` está visível.
4. O contador `favorites-count` mostra o texto "1 filme favorito".

## Contexto técnico (pro gerador)

- App em http://localhost:4174 · login: aluno@puc.br / 1234 (tela `/login`)
- Seletores via `data-testid` — convenção `<tela>-<elemento>` (ver testIDs do app)
- login: `login-email-input`, `login-password-input`, `login-submit-button`
- lista: `movielist-screen`, `movielist-grid`, `movielist-favorites-button`
- favoritos: `favorites-screen`, `favorites-count`, `favorites-item-<id>`
