# CineFav Web — prática de Playwright, SPA e PWA

App de filmes **já implementado** (React + Vite + PWA). Você **não escreve UI** —
escreve os **testes**: os specs em `tests/e2e/` têm TODOs marcando o que falta.

**Duas áreas, propósitos diferentes:**

- **`/`** — tela principal, busca filmes de verdade no TMDB (pôster + comentários reais).
  Precisa de internet; dado muda (não é usada pelos specs avaliativos).
- **`/qa`** — o app original, mesmo produto do CineFav mobile (Lab Maestro): mesmas
  telas, mesmos `data-testid`, mesmo dataset mockado — **offline, sem token,
  determinístico**. É aqui que os specs 01-05 (avaliativos) rodam.

> Por quê a separação? Teste de verdade (visual regression, offline) precisa de dado
> fixo — ver comentário em `src/services/api.ts`. `/qa` garante isso; `/` é só pra
> mostrar a mesma UI com dado real.

## Setup

```bash
cd exercicios/01-lab-web-pwa-playwright/pratica

# confirme que está no lugar certo:
ls tests/e2e
# → deve mostrar: auth.setup.ts  01-login.spec.ts  02-busca-mock.spec.ts ...
```

> **Windows:** `cd exercicios\01-lab-web-pwa-playwright\pratica` e `dir tests\e2e`

```bash
npm install
npx playwright install chromium

# rodar o app (dev):
npm run dev          # http://localhost:5173  (login: aluno@puc.br / 1234)

# rodar a suíte E2E (builda e testa contra o preview — o SW só existe no build):
npm run test:e2e
```

> **Abra ESTA pasta no editor** (`code .` dentro de `pratica/`) — senão o TS e a
> extensão do Playwright não acham o projeto.

## Ordem dos specs (faça na ordem)

| Spec | Tema | Aula |
|------|------|------|
| `auth.setup.ts` | 📘 storageState (resolvido) | Playwright Avançado |
| `01-login.spec.ts` | 📘 locators + web-first assertions (resolvido) | Playwright Avançado |
| `02-busca-mock.spec.ts` | ✅ network mocking com `route()` | Playwright Avançado |
| `03-visual.spec.ts` | ✅ visual regression, 3 viewports | Visual Regression + CI |
| `04-spa.spec.ts` | ✅ app-ready, navegação client-side, lazy chunk | Testando SPAs |
| `05-pwa-offline.spec.ts` | ✅ SW ativo, manifest, `setOffline` | Testando PWAs |
| `06-discover-tmdb.spec.ts` | 🎁 mock de domínio externo real (TMDB) | Bônus — não pontua |
| `e2e-bonus/07-discover-loader.spec.ts` | 🔴 desafio: loader + rede real throttled (`npm run test:bonus`) | Bônus — não pontua |

📘 = modelo resolvido · ✅ = avaliativo (todo `it()` conta) · 🎁 = bônus, não pontua

## 🎁 Bônus — tela principal (`/`) com TMDB de verdade

A tela principal busca de verdade em `api.themoviedb.org` (pôster real + comentários
reais via `/movie/:id/reviews`). Pra usar manualmente (não precisa pra rodar os
testes — `06-discover-tmdb.spec.ts` intercepta a chamada):

```bash
cp .env.example .env.local
# edite .env.local com seu VITE_TMDB_TOKEN (veja instruções no arquivo)
npm run dev
# a tela principal já abre com os filmes reais
```

`06-discover-tmdb.spec.ts` roda sem token nenhum — `page.route('**/api.themoviedb.org/**', ...)`
intercepta a chamada antes dela sair pra rede de verdade. Diferença do spec 02: lá o mock é
same-origin (`/api/movies.json`, o próprio servidor); aqui é um domínio externo de verdade —
mais parecido com o que você vai mockar num app em produção.

## 🔴 Desafio difícil — loader + rede real throttled

Em `tests/e2e-bonus/` (pasta própria, config própria — veja `playwright.bonus.config.ts`).
Diferente do spec 06, este **não mocka o conteúdo** — intercepta a request real do TMDB,
espera um pouco (`setTimeout`) e só depois deixa ela seguir (`route.continue()`). Prova que
o loading state do `DiscoverDetail` aparece e depois some de verdade.

```bash
cp .env.example .env.local   # precisa de VITE_TMDB_TOKEN válido — sem token, TMDB responde 401
npm run test:bonus
```

Roda **separado** da suíte avaliativa — nunca entra no `npm run test:e2e` nem no CI que
corrige a Atividade (bate em rede real, não pode travar o critério eliminatório de ninguém).

## Visual regression

```bash
npm run test:visual:update   # 1ª vez: gera os baselines na SUA máquina
npm run test:visual          # depois: compara contra o baseline
```

## Lighthouse CI

```bash
npm run build
npm run lighthouse           # roda 3x contra ./dist com budgets do lighthouserc.json
```

## CI (GitHub Actions)

`.github/workflows/playwright.yml` — suíte com **sharding 2-way + blob reports
mesclados**. Habilite o Actions no seu fork pra rodar.
