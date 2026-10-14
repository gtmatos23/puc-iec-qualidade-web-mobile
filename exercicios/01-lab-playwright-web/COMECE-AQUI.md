# Comece aqui — Lab Playwright Web (busca + network mocking)

Detalhes do que fazer: [`enunciado.md`](enunciado.md). Aqui: **como**.

## 1. Baixar (clone novo, sem sincronizar fork)

```bash
git clone https://github.com/jacksonsmith/puc-iec-qualidade-web-mobile.git lab-web
cd lab-web
git switch -c lab-web
cd exercicios/01-lab-playwright-web/pratica
ls tests            # → busca-mock.spec.ts  (Windows: dir tests)
```

Seu fork é só para entregar. Se ainda não tem um, clique em **Fork** no GitHub; depois: `git remote add meu https://github.com/<seu-login>/puc-iec-qualidade-web-mobile.git`

## 2. Instalar (uma vez)

```bash
npm ci
npx playwright install chromium
```

- O `npm ci` pode terminar com **"vulnerabilities"** — é normal, ignore.
- Abra a pasta `pratica/` no VS Code (`code .`, ou *File → Open Folder*). Recomendo a extensão **Playwright Test for VS Code** (ela mostra ✓/✗ ao lado de cada teste).

## 3. Rodar

```bash
npx playwright test
```

Na 1ª vez o Playwright monta o app (leva alguns segundos). Resultado esperado agora: **4 testes vermelhos** com a mensagem "ainda não feito". Seu trabalho é fazê-los ficarem verdes.

| Quero… | Comando |
|---|---|
| ver passo a passo na tela (melhor debugger) | `npx playwright test --ui` |
| rodar um teste só | `npx playwright test -g "abrir"` |
| descobrir o seletor clicando | em um terminal `npm run build && npm run preview` (deixe aberto); em outro `npx playwright codegen http://localhost:4173/login` — entre com aluno@puc.br / 1234 e vá até Buscar |

> O recorder (`codegen`) escreve o código enquanto você clica — mas **não confere nada**; você sempre acrescenta o `expect`.

## 4. Estudar (links oficiais, grátis)
- Como escrever o `expect` e os matchers: https://playwright.dev/docs/test-assertions
- Achar elementos (`getByTestId`, `getByText`): https://playwright.dev/docs/locators
- Mock de rede (`page.route`, `fulfill`): https://playwright.dev/docs/mock

## 5. Entregar

```bash
npm run lint                      # sem avisos
npx playwright test               # 4 verdes
git add tests/busca-mock.spec.ts
git commit -m "lab playwright web: <seu nome>"
git push -u meu lab-web
```
No GitHub, abra o **Pull Request** da branch `lab-web` do seu fork para o `main` do repositório do professor, com o print dos 4 verdes. O bot comenta em 1–2 min; corrija e dê `push` para ele reavaliar.

## Deu erro?
- **`webServer was not able to start`** → rode `npm run build` sozinho: o erro de verdade aparece lá (falta `npm ci`? Node antigo? precisa de Node 20.19+ ou 22.13+).
- **Comando "falha do nada"** → você não está em `…/pratica`. Refaça o `cd` e confira com `ls tests`.
- **`CONFLICT` / `MERGING` no Git** → não resolva. Copie `busca-mock.spec.ts` para fora, clone de novo numa pasta nova (passo 1) e cole por cima.
