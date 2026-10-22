# Seminário Técnico em Grupo — Projeto Final (50 pts)

**Disciplina:** Qualidade em Aplicações Web e Mobile
**Modalidade:** grupo de 3 a 4 alunos
**Apresentação:** ver Canvas (demo ao vivo + Q&A)
**Entrega (repositório + relatório):** ver Canvas

---

## O que é

Seminário técnico: cada grupo escolhe **um tema de testes atual**, constrói um **artefato pequeno e demonstrável**, e **apresenta** o que descobriu. Não é uma suíte gigante: é um recorte bem feito, com evidência.

**Regras de ouro**

- **Custo zero:** nada de serviço pago ou cartão de crédito. Navegador ou emulador bastam.
- **IA é permitida — declarando:** o README diz qual ferramenta usou e como. Cópia sem entendimento = zero.
- **Reprodutível:** outra pessoa roda o seu README e chega ao mesmo resultado.

## Escolha do tema

Escolham pela habilidade que o grupo quer mostrar. O app de referência é o **CineFav** (web, PWA ou mobile).

| Trilha | Exemplos de tema (2026) | Precisa de emulador? |
|---|---|---|
| 🤖 Agentes de IA | **Playwright Agents** (planner / generator / healer) · **Maestro MCP** com agente de código (Maestro Viewer) · crítica da geração de testes por LLM (*oracle problem*, taxa de acerto) | depende |
| 🔭 Shift-right | observabilidade como superfície de teste · feature flags e canary · falha em produção virando teste de regressão | não |
| 🧠 Testar app com LLM | *evals* e red-teaming de um recurso com LLM (GitHub Models, grátis) | não |
| 🌐 Web / PWA | Playwright visual regression · Lighthouse CI com budget · Service Worker/offline | não |
| 📱 Mobile | Maestro avançado + POM · visual testing · medir e reduzir flakiness | sim |
| 🏗️ Pipeline | CI/CD com sharding e quality gate · mutation testing (Stryker) | não |
| ♿ Acessibilidade / ⚡ Perf / 🔒 Segurança | auditoria WCAG 2.2 com axe-core · Flashlight/Reassure · OWASP MASVS | depende |

Tema próprio é bem-vindo: combine com o professor **antes** de começar.

**Pergunta-guia:** que *risco real* do CineFav o nosso projeto cobre?

**Tamanho certo:** ✅ 8 flows Maestro com `tags` + relatório JUnit + CI · ✅ regressão visual do CineFav Web em 3 viewports · ✅ axe-core com lista de violações e 3 correções (antes × depois). ❌ "testar tudo" em web + PWA + iOS + Android + IA.

## O que entregar

| # | Entregável | O que é |
|---|---|---|
| 1 | **Artefato técnico** | repositório (ou pasta no fork) com o que o grupo construiu/rodou; README com **comandos exatos** |
| 2 | **Apresentação** | ~10 min: problema → ferramenta → **demo** → achado → limite, + 5 min de Q&A. **Todos** do grupo falam |
| 3 | **Relatório** | 2 páginas: o que fez, evidências (prints/saída), o que **não** funcionou, conclusão |

**Como entregar:** 1 fork por grupo; um integrante abre o PR (ou envia o link do repositório no Canvas) com o nome dos integrantes no README. O histórico de commits mostra a contribuição de cada um.

## Critérios de avaliação (50 pts)

| Critério | Pontos |
|---|---|
| Artefato técnico funcional e reproduzível | 18 |
| Apresentação (clareza + demo ao vivo) | 10 |
| Relatório (evidência, honestidade sobre os limites) | 10 |
| Domínio conceitual no Q&A | 7 |
| Originalidade e profundidade | 5 |

- **Contribuição individual:** quem não contribuiu (histórico de commits e Q&A) tem nota diferente dentro do grupo.
- **Demo que falha ao vivo não zera:** tenha plano B (gravação ou print) e explique o que deu errado.
- **Originalidade:** fork direto sem alteração substantiva não vale.

## Roteiro da apresentação

1. **Problema** — que risco/bug o grupo quis pegar (1 min)
2. **Ferramenta** — por que esta e não outra (1 min)
3. **Demo ao vivo** — passando **e** falhando (4 min)
4. **Achado** — número, print ou comparação (3 min)
5. **Limite** — o que **não** funcionou ou não cobre (1 min)

## Leituras de apoio

- Maestro Docs — *Selectors* e *Best practices*; receita *Page Object Model*
- Playwright Docs — *Visual comparisons* e *Best practices*
- W3C WCAG 2.2 — Quick Reference
- Wang et al. (2023) e Lam et al. (2019, iDFlakies) — causas de testes flaky
