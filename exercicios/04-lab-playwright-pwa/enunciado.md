# Lab Playwright PWA · 10 pts

**Disciplina:** Qualidade em Aplicações Web e Mobile · **Aulas 2–3 (Playwright)** · ≈ 3h (a missão livre e as respostas podem terminar em casa)
**Entrega:** Pull Request — prazo: **ver Canvas**

> **Dois labs, independentes:** o **Lab Playwright Web** (`exercicios/01-lab-playwright-web/`, 4 testes de busca + mock, 10 pts) é outro lab. Recomendo fazê-lo antes: este usa `await expect(...)` e `page.route`.

## O que é
**20 desafios + 1 missão livre** no CineFav Web, do básico ao intermediário. O app já está pronto — **você escreve só testes** (não mexa em `src/`; pode **ler** `src/utils/testIDs.ts`, que lista todos os testids).

| Bloco | Tema | Desafios | Nível |
|---|---|---|---|
| A | Locators | A1 A2 A3 | 🟢 🟡 🔴 |
| B | Expect e espera | B1 B2 B3 | 🟢 🟡 🔴 |
| C | Mock de rede | C1 C2 C3 C4 | 🟢 🟡 🟡 🔴 |
| D | Conta, Page Object, fixtures | D1 D2 D3 | 🟡 🟡 🔴 |
| E | SPA, PWA, offline | E1 E2 E3 E4 | 🟢 🟡 🔴 🔴 |
| F | Caçada ao teste instável | F1a F1b F1d (o F1c já está certo: serve de comparação) | conserto |
| Livre | você escolhe o fluxo | 3 testes | 🔴 |

🟢 o começo está pronto e você completa poucas linhas · 🟡 você monta a sequência (passo a passo no arquivo) · 🔴 você escreve o teste inteiro.
**Cada desafio traz, em comentário: o que você aprende, como fazer, dica e link de estudo.** A linha `falta('…')` é o "vermelho de propósito": apague-a quando escrever o teste.


## Como saber que está certo
1. `npx playwright test 01-locators` (arquivo do bloco) → **verde** · 2. `npm run check` → placar ✓/⬜/✗/🐛 · 3. o bot **J.A.R.V.I.S.** comenta no PR a nota automática (o *piso*: a nota mínima; a final sai no Canvas).

## O que entregar
Os 20 desafios + `pratica/tests/livre/missao-livre.spec.ts` (3 testes: `feliz:`, `negativo:`, `borda:`) + `pratica/RESPOSTAS.md` preenchido, com a suíte **verde 3 vezes seguidas**.

## Critérios (10 pts)
| Critério | Pts | Como |
|---|---|---|
| A Locators · B Expect e espera · D Conta/PO/fixtures · E SPA/PWA/offline | 1,5 cada | 🤖 automático (piso) |
| C Mock de rede | 2 | 🤖 |
| F Teste instável consertado | 0,5 | 🤖 |
| Missão livre (fluxo, 3 testes, risco coberto) | 1 | 📝 manual (Canvas) |
| `RESPOSTAS.md` (entendeu o porquê) | 0,5 | 📝 manual |

O piso automático soma **8,5 pts**; a missão livre e as respostas (1,5 pt) são corrigidas por mim no Canvas.

**Eliminatório, sobre o que você entregou:** os testes que você escreveu precisam passar **3 vezes seguidas** (`npm run test:e2e` três vezes; ou o CI do seu fork, que roda 3×). Teste instável é bug do teste, não azar. Desafio não feito vale 0 no seu bloco, mas não zera o lab. O bot comenta só o piso; a nota final sai no Canvas.

## Regras
IA é permitida, **esconder não é**: declare no `RESPOSTAS.md`. Não use `waitForTimeout`. Tudo roda local, sem token nem serviço pago.

➡️ **[`COMECE-AQUI.md`](COMECE-AQUI.md)** — instalar, rodar, entregar.
