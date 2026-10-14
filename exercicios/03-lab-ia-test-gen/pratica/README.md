# Pipeline IA de geração de testes — prática

Pipeline **user story → LLM gera teste Playwright → executa → healing loop**,
rodando contra o CineFav Web (Lab Playwright PWA). Você completa os TODOs de
`src/02-healing-loop.ts` e `src/03-visual-diff.ts`; o gerador (`src/01-gen-test.ts`)
já vem resolvido.

> **Custo pro aluno: ZERO.** O default é o **GitHub Models** — LLM grátis usando
> um token da conta GitHub que você já tem. O free tier impõe um limite diário
> de requisições (o lab usa poucas); anotar como isso te afetou é observação
> válida pro relatório.

## Setup

```bash
cd exercicios/03-lab-ia-test-gen/pratica

# confirme que está no lugar certo:
ls src
# → 01-gen-test.ts  02-healing-loop.ts  03-visual-diff.ts  lib

npm install
cp .env.example .env    # cole seu token do GitHub (instruções no arquivo)
```

> **Token GitHub (grátis):** Settings → Developer settings → Fine-grained tokens
> → Generate new → em *Account permissions* marque só **Models: Read** → Generate.

> **Pré-requisito:** o Lab Playwright PWA instalado (o app alvo dos testes gerados):
> `cd ../../04-lab-playwright-pwa/pratica && npm ci`

## Os 3 passos

```bash
# 1. 📘 resolvido — gera o teste a partir da user story e roda:
npm run gen -- stories/favoritar.story.md

# 2. ✅ você completa — healing loop (re-prompt em falha, máx 3 tentativas):
npm run heal -- generated/favoritar.spec.ts stories/favoritar.story.md

# 3. ✅ você completa — visual diff com pixelmatch:
npm run visual-diff -- screenshots/baseline.png screenshots/atual.png
```

## Dicas pro modelo grátis

- **Story curta gera teste melhor**: 3–4 critérios de aceite, cada um citando o
  `data-testid` exato. Story longa/vaga → teste ruim (e isso é dado de relatório!).
- O pipeline imprime `[tokens] in/out` a cada chamada — colete pro relatório.
- Na aula, o professor roda o MESMO pipeline com **Claude** (preset 3 do
  `.env.example`) e compara a qualidade — é demonstração, **não é cobrado**.

## Pra provocar o healing (exercício da aula)

Edite `generated/favoritar.spec.ts` e sabote um seletor
(ex.: `movie-card-heart-603` → `movie-card-like-603`), depois rode o `heal`.
**Audite o diff**: o modelo corrigiu o seletor ou enfraqueceu a asserção?

## Entrega (ver enunciado.md)

- `src/02-healing-loop.ts` e `src/03-visual-diff.ts` completos
- Uma story **sua** em `stories/` + o spec gerado commitado em `generated/`
- Relatório crítico (3 pgs) — limites reais: oracle problem, custo/limites, falsos positivos
