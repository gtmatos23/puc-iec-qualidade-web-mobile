# Lab Mobile — Jest + Maestro · CineFav

App **CineFav** (filmes) já implementado e funcionando. **Você não mexe no app** — sua entrega são os **testes**: Jest/RNTL em `__tests__/` e os **flows Maestro** em `flows/`.

Um app só, três níveis: **unit** (Jest), **integração** (RNTL) e **E2E** (Maestro).

> Dados **mockados** (sem token TMDB, sem rede) → os flows são determinísticos.

---

## Comece aqui

👉 **Setup:** [`COMECE-AQUI.md`](COMECE-AQUI.md) — instalar app e Maestro (por SO).
📄 **Enunciado + rubrica:** [`enunciado.md`](https://github.com/jacksonsmith/puc-iec-qualidade-web-mobile/blob/main/exercicios/02-lab-mobile-maestro-jest/enunciado.md)

```bash
# 1. ENTRE nesta pasta (rode o Maestro SEMPRE daqui — não da raiz do repo):
cd exercicios/02-lab-mobile-maestro-jest/pratica

# 2. Confirme que está no lugar certo — deve listar os flows (01-launch.yaml, ...):
ls flows            # Windows (PowerShell): dir flows
#   se NÃO aparecer os .yaml, você está na pasta errada — refaça o passo 1

# 3. Rode (precisa de emulator/device + app CineFav instalado):
maestro test flows/01-launch.yaml   # modelo resolvido — deve passar
maestro test flows/                  # todos
maestro hierarchy                    # lista os testIDs da tela (o app Maestro Studio faz o mesmo, visual)
```

> 📁 **Erro mais comum:** rodar `maestro` da raiz do repo. O comando precisa enxergar a pasta `flows/` — por isso entre em `exercicios/02-lab-mobile-maestro-jest/pratica` antes.

---

## Os flows (entrega: **02 e 03** · 04 e 05 são opcionais)

| Arquivo | O que testa | Status |
|---|---|---|
| `flows/01-launch.yaml` | login + lista de filmes | ✅ modelo resolvido |
| `flows/02-search.yaml` | busca (usa `env:`) | ✅ entrega — você completa |
| `flows/03-favorite.yaml` | favoritar → Favoritos | ✅ entrega — você completa |
| `flows/04-detail.yaml` | detalhe + favoritar | ⭐ opcional (não vale nota) |
| `flows/05-js-dynamic.yaml` | busca via JS (`evalScript`) | ⭐ opcional (não vale nota) |

Cada flow tem comentários `# TODO` guiando. **Bônus:** extraia `flows/_fragments/login.yaml` e chame com `runFlow:`.

Os testIDs do app estão no `enunciado.md` (tabela completa) e em `src/utils/testIDs.ts`.

---

## Entrega

PR no seu fork: testes Jest completos + os flows 02 e 03 completos (04 e 05 são opcionais). O bot (J.A.R.V.I.S.) comenta a nota mínima a cada commit; a final sai no Canvas.
