# RESPOSTAS — Lab Arquitetura de Testes

Responda com suas palavras (2–4 linhas cada). Vale 1 ponto, avaliado manualmente.

1. **Fragmento:** o que mudou na leitura do `00-refatorar.yaml` depois da refatoração? Que problema real isso resolve quando o fluxo de login muda?
O flow passou a ser lido como uma jornada de usuário ("fazer login", "favoritar X"), eliminando ruídos técnicos de implementação e IDs repetidos. Se o fluxo de login mudar (como um novo campo ou botão), a manutenção é feita em um único arquivo (`login.yaml`), sem quebrar os outros testes que dependem dele.

2. **Fragmento × POM:** qual a diferença entre `_fragments/login.yaml` e `elements/login.js`? Quando você usaria cada um?
O fragmento encapsula uma sequência de ações e comportamento reutilizável (o "o quê fazer"), enquanto o POM armazena apenas o mapeamento e localização dos seletores da tela (o "onde clicar"). Usa-se o fragmento quando a intenção é reaproveitar o fluxo inteiro pronto, e o POM quando se deseja criar um teste novo com passos customizados, mas sem expor IDs no YAML.

3. **Fragmento parametrizado:** por que chamar o mesmo `buscar.yaml` duas vezes com `TERM` diferente é melhor que copiar o flow?
Elimina a duplicação de código (princípio DRY) e centraliza a lógica do teste de busca. Se o comportamento de pesquisar mudar (como a necessidade de pressionar 'Enter' ou limpar o campo), ajusta-se apenas um fragmento em vez de atualizar dezenas de arquivos copiados.

4. **Um limite:** onde essa arquitetura NÃO ajuda (ou piora)? Dê um exemplo.
Ela adiciona complexidade e indireção desnecessárias em testes muito simples, pontuais ou exploratórios (testes descartáveis). Um exemplo é precisar abrir três arquivos (`.js`, fragmento e flow principal) apenas para debugar um clique que falhou em um fluxo de tela única, aumentando a carga cognitiva para manutenção básica.