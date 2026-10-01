# Lab Web + PWA — Playwright + Lighthouse (20 pts)

**Disciplina:** Qualidade em Aplicações Web e Mobile
**Aulas:** Aula 2 — Playwright Avançado + Aula 3 — SPA & PWA Testing
**Entrega:** fork + Pull Request no repositório da disciplina
**Valor:** 20 pontos

---

## Contexto

Você recebe o **CineFav Web** — SPA React + PWA **já implementada** (login, busca,
favoritos, detalhe, Service Worker, manifest). Seu trabalho é a **suíte de testes**:
completar os specs Playwright de `pratica/tests/e2e/` e configurar o Lighthouse CI.

Regra de ouro da disciplina: **o app vem pronto; você escreve só os testes.**

> ⚠️ **Os specs avaliativos rodam contra `/qa`, não `/`.** A tela principal (`/`) busca
> filmes de verdade no TMDB — ótima pra ver a UI com dado real, mas inútil pra teste
> determinístico (visual regression, offline). `/qa` é o catálogo fixo/mockado — é lá
> que o critério eliminatório (3 runs consecutivos 100% verde) precisa passar.

As Aulas 2 e 3 demonstram cada técnica ao vivo, e o screencast mostra o
professor resolvendo o primeiro spec de cada tema.

## Antes de começar

```bash
cd exercicios/01-lab-web-pwa-playwright/pratica

# Confirme que está no lugar certo
ls tests/e2e
# → auth.setup.ts  01-login.spec.ts  02-busca-mock.spec.ts ...
```

> **Windows:** `cd exercicios\01-lab-web-pwa-playwright\pratica` e `dir tests\e2e`

```bash
npm install
npx playwright install chromium
npm run test:e2e     # a suíte roda — specs com TODO ainda passam "vazios"
```

## O que você entrega

1. **Specs 02–05 completos** — todos os TODOs resolvidos, todo `it()` com asserção real.
2. **Baselines de visual regression** commitados (`tests/e2e/03-visual.spec.ts-snapshots/`).
3. **Workflow de CI verde** no seu fork (`.github/workflows/playwright.yml` já fornecido —
   habilite o Actions e anexe o link da run verde no PR).
4. **Lighthouse CI** rodando com os 3 budgets do `lighthouserc.json` (print ou log no PR).

## Critérios de avaliação (20 pts)

| # | Critério | Pontos |
|---|----------|--------|
| 1 | Auth state reuse correto (`storageState` entre testes) | 3 |
| 2 | Network mocking (`route()` — fulfill, abort, unroute) | 3 |
| 3 | Visual regression em 3 viewports com baseline versionado | 4 |
| 4 | SW lifecycle testado (registrado e ativo) | 3 |
| 5 | Offline mode test (`context.setOffline(true)`) | 3 |
| 6 | Lighthouse CI com 3 budgets configurados e rodando | 4 |

**Critério eliminatório:** a suíte deve passar 100% em 3 runs consecutivos
(flakiness é bug do teste, não azar).

## Como entregar

1. Faça **fork** do repositório da disciplina.
2. Trabalhe em `exercicios/01-lab-web-pwa-playwright/pratica/` (edite os specs in-place).
3. Abra um **Pull Request** pro repositório da disciplina.
4. O bot corretor comenta a **nota parcial automática** a cada push; critérios manuais
   (CI verde no fork, Lighthouse) entram na nota final no Canvas.

## Dica de fluxo

- Faça na ordem: 02 → 03 → 04 → 05 (cada spec usa técnicas do anterior).
- `npm run test:e2e:ui` abre o modo UI do Playwright — o melhor debugger da ferramenta.
- Travou num seletor? Todos os `data-testid` estão centralizados em `src/utils/testIDs.ts`.

## 🎁 Bônus (não pontua)

- **Tela principal (`/`) com TMDB de verdade** (`06-discover-tmdb.spec.ts`): pôster real,
  dado real, e um botão "Ver comentários" por filme que busca `/movie/:id/reviews` de
  verdade. O spec mocka **2 domínios externos reais** com `page.route()` (popular +
  reviews), diferente do mock same-origin do spec 02. Não precisa de token pra rodar o
  teste (o route() intercepta antes da chamada sair pra rede); só pra usar a tela
  manualmente. Detalhes em `pratica/README.md`.
