# Comece aqui — Lab Playwright PWA

O que fazer e como é avaliado: [`enunciado.md`](enunciado.md). Aqui: **como**.

## 1. Baixar (clone novo — não sincronize fork)

```bash
git clone https://github.com/jacksonsmith/puc-iec-qualidade-web-mobile.git lab-pwa
cd lab-pwa
git switch -c lab-pwa
cd exercicios/04-lab-playwright-pwa/pratica
ls tests/desafios     # Windows: dir tests\desafios  → deve listar 01-locators.spec.ts …
npm ci
npx playwright install chromium
```
Seu fork é só para entregar: sem fork, clique em **Fork** no GitHub; depois `git remote add meu https://github.com/<seu-login>/puc-iec-qualidade-web-mobile.git`.
Use pasta simples e sem acento (ex.: `C:\dev\lab-pwa`) e abra `pratica/` no VS Code (`code .` ou *File → Open Folder*) com a extensão **Playwright Test for VS Code**. Node 20.19+ ou 22.13+.
O `npm ci` pode mostrar "vulnerabilities" — normal, ignore.

## 2. Rodar
```bash
npm run check
```
O esperado agora: **⬜ "ainda não feito"** nos blocos A–E e na missão livre; e **✗ / 🐛 no Bloco F** — esses testes já vêm escritos, com defeitos de propósito (consertá-los é o desafio). O app sobe sozinho na porta 4174 (a 1ª vez demora um pouco). Seu trabalho: transformar tudo em ✓.

| Quero… | Comando |
|---|---|
| um bloco | `npx playwright test 01-locators` |
| um desafio | `npx playwright test -g "A1"` |
| ver o navegador | `npx playwright test 01-locators --headed` |
| passo a passo na tela (melhor debugger) | `npx playwright test -g "B2" --ui` |

## 3. Gravar com o recorder
```bash
npm run build && npm run preview          # terminal 1 (deixe rodando)
npx playwright codegen http://localhost:4174/login      # terminal 2
```
O código aparece na janela **Playwright Inspector** (pode abrir *atrás* do VS Code — `Cmd+Tab`/`Alt+Tab`). Copie, **limpe** (cliques repetidos, `Tab` sobrando) e **acrescente o `expect`**: o recorder não confere nada. Para salvar direto: `codegen -o rascunho.spec.ts …` (fora de `tests/`: copie o que prestar para o seu teste e apague o rascunho).

## 4. Quando falha
Leia a mensagem inteira (ela diz o que esperava × recebeu) → rode só o teste com `--ui` → ou `--trace on` e `npx playwright show-report`.

| Sintoma | O que fazer |
|---|---|
| `webServer was not able to start` | rode `npm run build` sozinho — o erro real aparece lá |
| navegador não encontrado | `npx playwright install chromium` |
| `Port 4174 is already in use` | feche o preview antigo ou `npx kill-port 4174` |
| falha rodando sozinho (`-g`) | o teste supõe algo que outro teste fez; cada teste nasce com navegador zerado (Bloco F) |
| comando "falha do nada" | você não está em `…/pratica` (`ls tests/desafios`) |

## 5. Entregar
`npm run check` tudo ✓ · `npm run lint` sem erros · `npm run test:e2e` **3 vezes seguidas** verde · `RESPOSTAS.md` preenchido. (Opcional: habilite o *Actions* no seu fork — o CI roda a suíte 3× a cada `push`.) Volte à raiz do clone e entregue:
```bash
cd ../../..       # raiz do clone (ls deve mostrar a pasta exercicios)
git add exercicios/04-lab-playwright-pwa/pratica/tests exercicios/04-lab-playwright-pwa/pratica/RESPOSTAS.md
git commit -m "lab playwright pwa: <seu nome>"
git push -u meu lab-pwa
```
No GitHub: **Pull Request** da branch `lab-pwa` do seu fork → `main` do repositório do professor. O bot comenta em 1–2 min; novo `push` reavalia.

## Deu `CONFLICT` / `MERGING`? Não resolva
Copie `pratica/tests/` e `RESPOSTAS.md` para fora, **clone de novo numa pasta nova** (passo 1) e cole por cima.
