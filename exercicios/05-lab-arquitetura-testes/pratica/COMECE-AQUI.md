# COMECE AQUI — Lab Arquitetura de Testes

Você organiza e **reaproveita** flows Maestro: fragmentos, fragmento parametrizado (`env`) e Page Object (POM). **Sem Jest, sem npm, sem mexer no app.**

Precisa do **emulador ligado com o CineFav instalado** (igual à Aula 4) para *rodar*. Para *escrever* o YAML não precisa — dá pra editar sem emulador e rodar depois.

```bash
# 1. ENTRE na pasta (sempre daqui — o Maestro precisa enxergar flows/):
cd exercicios/05-lab-arquitetura-testes/pratica

# 2. Confirme que está no lugar certo:
ls flows            # Windows (PowerShell): dir flows

# 3. Rode o modelo (emulador ligado) — deve passar:
maestro test flows/01-smoke.yaml
```

> **Abra a pasta `pratica/` direto no editor** (`code .`).

## Ordem dos níveis

| Nível | Arquivo(s) | O que fazer |
|---|---|---|
| 1 *(juntos, antes do intervalo)* | `flows/00-refatorar.yaml` + `flows/_fragments/favoritar.yaml` | refatorar um flow cheio de "cheiros" |
| 2 | `flows/_fragments/abrir-busca.yaml` + `flows/02-busca.yaml` | fragmento que reaproveita o login |
| 3 | `flows/_fragments/buscar.yaml` + `flows/03-busca-parametrizada.yaml` | fragmento com `env`, chamado 2× |
| 4 🔴 | `flows/elements/*.js` + `flows/04-pom-login.yaml` | Page Object: nenhum `id` escrito no flow |
| 5 🔴🔴 | `flows/05-favoritos-composto.yaml` | flow longo compondo tudo |

📘 **MODELO** (já prontos — leia antes): `_fragments/login.yaml`, `flows/01-smoke.yaml`.

```bash
maestro test flows/00-refatorar.yaml                 # um flow
maestro test --include-tags=regressao flows/         # todos os de regressão
maestro hierarchy                                    # lista os testIDs da tela atual
```

## Como entregar (PR) — sem conflito possível

```bash
# clone NOVO (nunca "sincronize seu fork antigo"), numa pasta nova:
git clone https://github.com/jacksonsmith/puc-iec-qualidade-web-mobile.git lab-arquitetura
cd lab-arquitetura
git switch -c lab-arquitetura
git remote add meu https://github.com/<SEU-USUARIO>/puc-iec-qualidade-web-mobile.git   # seu fork
# ... edite os flows em exercicios/05-lab-arquitetura-testes/pratica/ ...
git add exercicios/05-lab-arquitetura-testes
git commit -m "lab arquitetura: <seu nome>"
git push -u meu lab-arquitetura
```
Abra o **Pull Request** dessa branch do seu fork para o `main` do repositório do professor. O bot comenta a nota mínima a cada `push`.

## Deu erro?

- **"Maestro Android driver did not start up in time"**: emulador lento — feche programas e `adb kill-server`.
- **Não acha o fragmento**: o caminho do `runFlow` é **relativo ao arquivo que chama** (dentro de `_fragments/`, o login é só `login.yaml`).
- **`tapOn` não acha o elemento**: rode `maestro hierarchy` e confira o `id`.
- **Deu conflito no git? Não resolva** — baixe o repo de novo numa pasta nova e copie só os arquivos que você editou.
