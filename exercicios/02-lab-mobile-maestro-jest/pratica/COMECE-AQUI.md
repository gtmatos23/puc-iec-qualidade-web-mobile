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

**macOS / Linux:**

```bash
curl -Ls get.maestro.mobile.dev | bash
source ~/.zshrc                            # (ou ~/.bashrc) — ou abra um terminal novo
```

**Windows** (terminal nativo, não WSL): baixe o `maestro.zip` em <https://github.com/mobile-dev-inc/Maestro/releases/latest>, extraia em `C:\maestro` e acrescente **`C:\maestro\bin`** ao **Path**. O Maestro precisa de Java: defina **`JAVA_HOME`** = `C:\Program Files\Android\Android Studio\jbr` (o Java do Android Studio). Feche e reabra o terminal.

> **Java 17+ é obrigatório:** `java -version`. Java mais velho (comum em Linux) → instale o JDK 17 e aponte o `JAVA_HOME`.
> **Pré-requisito do passo 3:** `adb` precisa funcionar em qualquer pasta. Se `adb` "não existe", acrescente `<Android SDK Location>/platform-tools` ao Path. Copie o caminho em Android Studio → *Settings → Android SDK* (quem instalou em outra pasta tem outro caminho). Depois de editar o Path, **abra um terminal novo** (macOS/Linux: `source ~/.zshrc` ou `~/.bashrc`).

Confira e rode o modelo (**com o emulador ligado**):

```bash
maestro --version
maestro test flows/01-launch.yaml          # modelo resolvido (Windows: flows\01-launch.yaml)
```

> `maestro` não achou o device? O emulador precisa estar **ligado e com o Android carregado**; `adb devices` tem que listá-lo.
> Apareceu um aviso cinza de compatibilidade no emulador? Toque em **OK** e rode o flow de novo.

Depois complete `flows/02-search.yaml` e `flows/03-favorite.yaml` (TODOs marcados): **são os dois flows da entrega**. `04-detail.yaml` e `05-js-dynamic.yaml` são **opcionais** (prática extra, não valem nota).

> **YAML indenta com espaços, nunca com Tab** (o `.editorconfig` já converte para 2 espaços). `tapOn:` seguido de `id:` → o `id:` fica 2 espaços à direita.
> **Repetiu o login em vários flows?** Extraia para um arquivo e chame com `- runFlow: file: _fragments/login.yaml` (veja o slide *Fragmento* da aula).

**Maestro Studio (recomendado) — app desktop:** ele mostra o `id` de cada elemento clicando na tela do emulador. Desde 2026 não vem mais com o `maestro`: baixe em **studio.maestro.dev** (macOS `.dmg` ~700 MB · Windows `.exe` ~560 MB · Linux `.AppImage` ~630 MB). É um download grande, então baixe com antecedência. **Sem o Studio você não fica travado:** `maestro hierarchy` imprime os `id`s no terminal e todos estão em `src/utils/testIDs.ts`.

## 5. Assista o screencast

O screencast da unidade mostra o professor fazendo o primeiro exercício de cada
frente. Pause, rode, compare.

## Não consegue instalar na sua máquina? (PC corporativo sem permissão de administrador)

Faça o setup e a execução do emulador **em dupla**, no computador de um colega (compartilhando a tela). Avise o professor — a entrega no PR continua **individual**.

## Travou?

- Jest: extensão **Orta.vscode-jest** mostra ✓/✗ inline (recomendada em `.vscode/`)
- Maestro: o app **Maestro Studio** (baixe em studio.maestro.dev) ou `maestro hierarchy` mostram os testIDs
- Office hours semanal — link no Canvas
