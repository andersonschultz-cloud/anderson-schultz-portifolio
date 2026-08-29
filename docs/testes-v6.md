# Validação v6 — Premium Instituto Schultz

Executado em 24/07/2026.

## Cobertura
- Validação sintática de todos os arquivos JavaScript com Node.js (`node --check`).
- Validação estrutural do HTML e verificação de IDs duplicados.
- Testes funcionais em Chromium headless nos viewports desktop 1440×1000 e smartphone 390×844.
- Navegação SPA: Início → Calculadora → Planejador → Simulador → Início.
- Menu mobile e fechamento após navegação.
- Calculadora de Vida com preenchimento, cálculo, resultados e gráfico fallback.
- Planejador com preenchimento, geração de cenários e gráfico fallback.
- Simulador com alteração de valor inicial, aporte mensal e prazo.
- Verificação de overflow horizontal: 0 px nos dois viewports.
- Captura de erros JavaScript/console durante os fluxos: nenhum erro nos cenários testados.

## Robustez adicionada
- `font-size: 16px` nos campos para evitar zoom automático no Safari/iPhone.
- `viewport-fit=cover` e safe-area para notch/Dynamic Island.
- `100dvh` e sincronização de `visualViewport` para barras/teclado do Safari iOS.
- Fallback Canvas nativo caso o CDN do Chart.js não esteja disponível.
- Fallback de cópia para navegadores sem Clipboard API.
- Guardas de navegação para páginas inexistentes.
- Respeito a `prefers-reduced-motion`.

> Testes automatizados em Chromium não substituem testes físicos em todas as versões do Safari iOS, mas o CSS/JS foi preparado especificamente para as limitações comuns do Safari móvel.

## Validação v6.2 — Connected Light Field
- `node --check` executado em todos os JavaScript do projeto: sem erros de sintaxe.
- Validada a presença do Canvas `connectivityCanvas`, carregamento de `connectivity.js` e regras específicas para temas claro/escuro.
- Validado respeito a `prefers-reduced-motion`.
- Implementado limite de DPR, densidade de nós e FPS reduzido para dispositivos touch/iPhone.
- Implementada pausa de animação em aba oculta para reduzir consumo.
- Tentativa de captura headless via Chromium não concluiu de forma confiável no ambiente; portanto, não foi contabilizada como teste visual aprovado.
