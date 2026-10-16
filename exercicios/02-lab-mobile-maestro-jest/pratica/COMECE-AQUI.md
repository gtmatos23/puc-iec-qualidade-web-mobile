# COMECE AQUI — Lab Mobile 🎬📱

Sequência mínima:

## 1. Clone e entre na pasta certa

```bash
git clone https://github.com/<SEU-USUARIO>/puc-iec-qualidade-web-mobile.git
cd puc-iec-qualidade-web-mobile/exercicios/02-lab-mobile-maestro-jest/pratica

ls flows __tests__    # prova de que está no lugar certo
```

> **Windows:** troque `ls` por `dir` e `/` por `\`.

## 2. Jest primeiro (sem emulador, feedback em segundos)

```bash
npm install
npm test
```

Verde? Os scaffolds passam **vazios** — abra `__tests__/unit/02-authStore.test.ts`
e complete os TODOs. Modelo resolvido: `01-favoritesStore.test.ts`.

## 3. Rode o app e explore

**Caminho rápido (recomendado) — APK pronto, com o emulador ligado:**

```bash
# baixe CineFav.apk em: https://github.com/jacksonsmith/puc-iec-testes-aplicacoes-mobile/releases
adb install CineFav.apk
adb devices          # confirme antes: tem que listar o emulador
```

> O Maestro **não lê o arquivo `.apk`**: ele controla o app **já instalado** no emulador. É o mesmo app deste lab (`com.puciec.cinefav`), com dados mockados.

**Alternativa — compilar do código** (mais demorado: a 1ª vez baixa o Gradle, 5 a 15 min):

```bash
npm run android      # compila e instala o CineFav no emulador Android
# iOS (só Mac): npm run ios
```

**Abra o CineFav no emulador** (ícone 🎬) e entre com `aluno@puc.br` / `1234`: tem que aparecer a lista de filmes. **Só siga para o Maestro depois disso.** É esse app que você testa.

## 4. Maestro

```bash
curl -Ls get.maestro.mobile.dev | bash    # Windows e outros: https://docs.maestro.dev/getting-started/installing-maestro
maestro test flows/01-launch.yaml          # modelo resolvido
```

Depois complete `flows/02-search.yaml` → `05-js-dynamic.yaml` (TODOs marcados).

**Maestro Studio (recomendado) — app desktop:** ele mostra o `id` de cada elemento clicando na tela do emulador. Desde 2026 não vem mais com o `maestro`: baixe em **studio.maestro.dev** (macOS `.dmg` ~700 MB · Windows `.exe` ~560 MB · Linux `.AppImage` ~630 MB). É um download grande, então baixe com antecedência. **Sem o Studio você não fica travado:** `maestro hierarchy` imprime os `id`s no terminal e todos estão em `src/utils/testIDs.ts`.

## 5. Assista o screencast

O screencast da unidade mostra o professor fazendo o primeiro exercício de cada
frente. Pause, rode, compare.

## Travou?

- Jest: extensão **Orta.vscode-jest** mostra ✓/✗ inline (recomendada em `.vscode/`)
- Maestro: o app **Maestro Studio** (baixe em studio.maestro.dev) ou `maestro hierarchy` mostram os testIDs
- Office hours semanal — link no Canvas
