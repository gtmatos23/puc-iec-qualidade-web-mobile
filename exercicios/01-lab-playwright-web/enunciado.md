# Lab Playwright Web — busca + network mocking · 10 pts

**Disciplina:** Qualidade em Aplicações Web e Mobile · **Aula 2** · ≈ 45 min
**Valor:** 10 pontos · **Prazo:** ver Canvas ("Lab Playwright Web")

## O que fazer
O CineFav Web já está pronto — você escreve só **testes**. Em `pratica/tests/busca-mock.spec.ts`, complete **4 testes**, trocando a linha `falta('…')` por um `await expect(…)`:

| # | Teste | Você aprende | Nível | Pontos |
|---|---|---|---|---|
| 1 | abrir a tela de busca | `expect` + "está visível" | 🟢 | 2 |
| 2 | o título "Buscar" aparece | achar elemento por **texto** | 🟢 | 2 |
| 3 | buscar "Matrix" mostra o resultado | digitar e esperar o resultado | 🟢 | 2 |
| 4 | **mock**: o "backend" devolve um filme inventado | `page.route` + `route.fulfill` | 🟡 | 4 |

## Como saber que está certo
- `npx playwright test` → os **4 ficam verdes** (e nenhum `falta(…)` sobra).
- `npm run lint` → **sem avisos**. Aviso "Test has no assertions" = teste sem `expect` (verde de mentira).
- No Pull Request, o bot **J.A.R.V.I.S.** comenta a **nota automática (x/10)** e o que falta em cada teste. Ela é a nota do lab, confirmada no Canvas.

## O que entregar
1. O `busca-mock.spec.ts` com os 4 testes completos.
2. Um **print** dos 4 testes verdes.
3. **Pull Request** (preferencial) ou `.zip` da pasta `pratica/` (sem `node_modules`) no Canvas.

➡️ Instalação, comandos e entrega passo a passo: **[`COMECE-AQUI.md`](COMECE-AQUI.md)**.

> ⚠️ `expect` sobre locator/página **precisa de `await`**. Sem ele o teste termina antes de conferir e fica verde "de mentira".
>
> **Lab Playwright PWA:** é outro lab (10 pts), da Aula 3, em `exercicios/04-lab-playwright-pwa/`. Recomendo fazer este antes.
