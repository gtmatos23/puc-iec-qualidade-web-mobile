# RESPOSTAS — Lab Playwright PWA

**Nome:** <Gustavo Matos>
**Login do GitHub:** <gtmatos23>
**Usei IA?** Sim — assistente de IA no VS Code para acelerar a escrita e revisão dos testes E2E, consultar seletores e estruturar estas explicações técnicas, conforme permitido pelas regras da disciplina.

---

### 1. Bloco A — Locators

`getByRole` e `getByLabel` localizam controles pela forma como usuários e tecnologias assistivas os identificam; `getByTestId` oferece um contrato explícito e estável quando não há um seletor semântico apropriado. Esses seletores resistem melhor a mudanças de estrutura ou classes CSS do que expressões como `div > div.btn` ou XPath, que dependem de detalhes de implementação. No bloco, a navegação usou o nome do botão, o login usou labels e o card foi localizado pelo título antes de interagir com seu botão.

### 2. Bloco B — Expect e Espera

As web-first assertions, como `await expect(locator).toHaveCount(24)`, repetem a verificação até o estado esperado aparecer ou expirar o timeout; leituras síncronas como `.count()` e `.innerText()` retornam imediatamente e podem observar a tela antes da atualização. `expect.poll` repete a leitura de valores fora do DOM — no teste, o conteúdo do `localStorage` — até corresponder ao esperado. `expect.soft` acumula falhas sem interromper as verificações seguintes, permitindo conferir todos os corações após o reload.

### 3. Bloco C — Mock de Rede

O `page.route` foi registrado antes do `goto` ou da digitação que dispara a busca, para garantir que a requisição não escape antes da interceptação. Em C1 e C2, `route.fulfill` fornece, respectivamente, um catálogo controlado e um erro HTTP; em C2, `unroute` permite testar a recuperação com a resposta real. C3 usa `route.fetch()` para obter o catálogo e alterar só os três primeiros títulos, sem recriar todo o payload. Isso testa o comportamento do cliente de forma determinística, mas não valida o contrato completo nem disponibilidade, autenticação ou latência de um backend real.

### 4. Bloco D — Conta, Page Object e Fixtures

D1 começa sem sessão e cria um e-mail único, evitando depender da conta de demonstração ou de dados de outra execução; o storage state compartilhado é usado pelo setup nos testes autenticados, enquanto D1 zera esse estado deliberadamente. O `CatalogPage` encapsula operações e locators da tela, fazendo D2 ler como uma sequência de ações e concentrando futuras mudanças da interface em um só lugar. Em D3, a fixture injeta os favoritos com `context.addInitScript` antes do carregamento: é rápido e isola a massa de dados, mas não prova que o clique de favoritar funciona — para isso, o teste deve interagir com a interface, como D2.

### 5. Bloco E — SPA, PWA e Offline

Os testes verificam o sinal `data-app-ready`, abrem um deep link e conferem a rota de fallback; as navegações internas do app são feitas por controles da interface, embora estes testes não instrumentem separadamente a ausência de uma nova requisição de documento. E2 espera o Service Worker chegar a `activated`, aguarda o controller assumir a página e valida `name` e `display` do manifest. E3 fica offline com `context.setOffline(true)`, recarrega a página e confere banner e catálogo; E4 publica comentário offline, comprova o estado `pending` após reload e verifica a transição para `synced` ao restaurar a rede, cobrindo a persistência em IndexedDB e a fila local.

### 6. Bloco F — Caçada ao Flaky

- **F1a:** A contagem síncrona era lida antes de a busca com debounce renderizar; `await expect(...).toHaveCount(1)` passou a esperar o resultado.
- **F1b:** `waitForTimeout(300)` era uma espera cega, e `.count()` não aguardava a paginação; ambos foram substituídos por `await expect(...).toHaveCount(24)`.
- **F1d:** Presumia que F1c já havia favoritado Matrix, mas cada teste tem contexto isolado; F1d agora cria o favorito e valida o estado dentro do próprio fluxo.

A estabilidade foi verificada com `npx playwright test 06-flaky --repeat-each=10` (41 passagens aprovadas, incluindo o setup) e `npx playwright test 06-flaky -g "F1d"` (passou isolado). `npm run check` também confirmou os blocos A–F completos, 20/20.

### 7. Missão Livre — Comentários em filmes

Escolhi o comentário no detalhe de Matrix, um fluxo de contribuição de conteúdo do usuário. O cenário **feliz** publica e exibe o comentário; o **negativo** confirma que entrada vazia mantém o botão desabilitado e não cria item; o de **borda** envia um texto de 280 caracteres com tags semelhantes a HTML e emojis, verificando o limite e o texto exibido. Isso cobre regressões de entrada vazia, limite e apresentação literal de conteúdo potencialmente interpretável como HTML; não substitui uma auditoria de segurança XSS nem testa integração com um backend real.

### 8. Declaração de uso de IA

Usei um assistente de IA no VS Code para acelerar a implementação e revisão dos testes Playwright, consultar seletores existentes no projeto e estruturar as explicações técnicas deste arquivo. Revisei e validei as alterações executando os testes e verificações do laboratório.
