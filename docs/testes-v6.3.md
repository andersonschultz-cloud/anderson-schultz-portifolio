# Validação v6.3

## Cobertura automatizada concluída

- 14/14 testes de matemática financeira passaram:
  - CDI derivado da Selic;
  - percentual do CDI;
  - Selic + spread;
  - taxa prefixada;
  - IPCA+;
  - regra da poupança;
  - faixas regressivas de IR;
  - juros compostos com aporte;
  - cenário com IR;
  - cenário de taxa zero;
  - labels do Tesouro Selic e IPCA+.
- Todos os arquivos JavaScript passaram no `node --check`.
- 75 IDs HTML auditados sem duplicidade.
- 19 handlers inline auditados e encontrados no JavaScript.
- 66 referências `getElementById` auditadas contra a estrutura do documento.
- Arquivos CSS verificados quanto ao balanceamento de blocos.

## Correções visuais verificadas por inspeção de código

- Logo de navegação e rodapé: `object-fit: contain`, padding interno e `clip-path` circular.
- Tema em mobile: botão não é mais ocultado no breakpoint de 860 px.
- Breakpoints adicionais em 560 px e 390 px mantêm os controles acessíveis e compactos.

## Limitação do ambiente de teste

O Chromium disponível neste ambiente bloqueou navegação para `localhost` e `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`, portanto a suíte de interação real em navegador não pôde ser concluída aqui. A validação automatizada acima cobre sintaxe, integridade estrutural e regras financeiras; recomenda-se uma última checagem visual em Safari/iPhone real após o deploy.
