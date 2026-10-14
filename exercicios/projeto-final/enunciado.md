# Projeto Final Individual (50 pts — eliminatório)

**Disciplina:** Qualidade em Aplicações Web e Mobile
**Entrega:** repositório GitHub próprio + relatório + vídeo demo
**Valor:** 50 pontos · **obrigatório pra aprovação**

---

## O desafio

Suíte completa de testes para um app de referência **web SPA + PWA + mobile RN**
(starter fornecido no Canvas — ou, mediante aprovação do professor, um app seu
com as mesmas superfícies). É a integração das 6 frentes do curso numa entrega só.

## Entregáveis

| # | Requisito | Pontos |
|---|-----------|--------|
| 1 | Suíte web Playwright: 10+ testes E2E + visual regression (3 viewports) | 12 |
| 2 | Suíte PWA: SW tests + offline + Lighthouse CI com budget | 9 |
| 3 | Suíte Maestro mobile: 5+ flows em iOS + Android | 11 |
| 4 | Componente IA não trivial (ver opções abaixo) | 10 |
| 5 | CI/CD funcional com sharding + quality gates | 5 |
| 6 | Relatório técnico (8 pgs) | 3 |

### Opções de componente IA (escolha UMA)

- **(a)** Pipeline test gen via Claude API **com healing loop**
- **(b)** Visual AI com baseline + análise de drift + classificação intencional/regressão
- **(c)** Agent de exploratory testing (Browser Use ou Computer Use) descobrindo bugs sem script

> **Não vale:** chamada simples à API sem loop ou análise.

### Entregáveis físicos

- Repositório GitHub público (ou privado convidando o professor) com README de execução completo
- Relatório técnico em `docs/RELATORIO.md` (8 páginas, ABNT ou IEEE)
- Vídeo demo de 5min: arquitetura + componente IA
- Workflow GitHub Actions verde com badge no README

## Critérios transversais

- **Reprodutibilidade:** README com comandos exatos. Falha de setup = -2 pts.
- **Ética em IA:** declare no README qual ferramenta usou e como. Cópia sem entendimento = zero.
- **Originalidade:** fork direto sem alteração substantiva não é aceito (30%+ diff + relatório original).

## Como entregar

Link do seu repositório + relatório + vídeo via **Canvas** (não é PR neste repo).
