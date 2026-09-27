# Roteiro guiado — Esquenta Aula 2 (30min, ao vivo, não avaliativo)

> **Não vale nota.** É esquenta pra Aula 2 (Playwright Avançado), antes do lab avaliativo `exercicios/01-lab-web-pwa-playwright/` (20pts).
>
> **Conecta direto com a Aula 1:** vocês acharam bugs no arngren.net na unha (Charter + FEW HICCUPPS). Hoje reproduzimos alguns desses bugs com código — e vemos isso rodando de verdade no GitHub Actions.
>
> Alvo: snapshot do arngren.net no Wayback Machine (`playwright.config.ts`) — o site real cai com frequência (caiu ao vivo na Aula 1). Mesmo HTML, sem depender dele estar no ar agora.

---

## Passo 0 — Setup (5min)

```bash
cd exercicios/00-warmup-aula1-playwright
npm install
npx playwright install chromium
```

**Checkpoint:** `npx playwright --version` — se aparecer uma versão, tá pronto.

---

## Passo 1 — Rodar a suíte que já reproduz 3 bugs (10min)

```bash
npx playwright test
```

Resultado esperado: **3 passed, 1 skipped** — mas reparem no ícone: cada teste mostra um `✘` antes de contar como "passed". Isso é `test.fail()`: marca "sei que essa asserção falha, é esperado" — documenta o bug sem deixar a esteira vermelha por algo que já sabemos que existe.

Abram `tests/01-reproduzir-bugs-arngren.spec.ts` e leiam os 3 testes:
- **BUG-001** — sem `<meta name="viewport">` (por isso o site não escala em mobile)
- **BUG-002** — 410 das 417 imagens sem `alt` (acessibilidade)
- **BUG-003** — `<html>` sem atributo `lang`

**Discussão:** o que acontece se o site corrigir um desses bugs amanhã? (Resposta: aquele teste específico vira **vermelho** — "unexpectedly passed" — e isso é o alerta certo: "hey, algo mudou, confirma".)

---

## Passo 2 — Ver isso no CI de verdade (5min)

No fork de vocês (o mesmo do lab avaliativo), copiem `.github/workflows/warmup-arngren.yml` do repo da disciplina, façam um commit qualquer nessa pasta e push. Abram a aba **Actions** do fork — a suíte roda na nuvem, mesmo resultado (`3 passed`) que rodou local.

> Se não quiser configurar agora, o professor mostra rodando no dele.

---

## Passo 3 — Trace viewer (5min)

```bash
npx playwright test --trace on
npx playwright show-trace test-results/*/trace.zip
```

Abre a timeline de um teste: DOM em cada passo, network, console. Mesmo pra um teste que "passou" (expected failure), dá pra ver exatamente o que o Playwright verificou.

---

## Passo 4 — Desafio: o bug de vocês (5min, ou pra terminar em casa)

Abram o `describe` **"DESAFIO"** no fim do spec. Peguem 1 bug que **vocês mesmos** encontraram no charter da Aula 1 (não os 3 que já estão prontos).

Não sabe o locator de cabeça? Usem o `codegen` (visto no início da aula) pra descobrir sem adivinhar:

```bash
npx playwright codegen "http://web.archive.org/web/20260826200139if_/http://www.arngren.net/"
```

Cliquem no elemento com problema — o Inspector mostra o locator recomendado. Copiem só o locator, não o fluxo inteiro (o teste continua sendo uma asserção de bug, não uma gravação).

Depois, escrevam o teste:

```typescript
test('BUG-00X: <descrição do bug de vocês>', async ({ page }) => {
  test.fail(); // mantém — o objetivo é documentar, não corrigir
  await page.goto('');
  // locator + expect que reproduz o problema
});
```

Usem o `pom/ArngrenPage.ts` como exemplo de Page Object — se o bug de vocês precisar de uma checagem nova, adicionem um método lá em vez de escrever o locator direto no teste.

---

## Fechamento

- Não vale nota — mas quem terminar o desafio pode mostrar pro professor.
- Aula 2 de verdade começa agora: `exercicios/01-lab-web-pwa-playwright/` (avaliativo, 20pts, fecha na Aula 3).
