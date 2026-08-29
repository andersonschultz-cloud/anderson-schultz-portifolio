# Changelog — Consumo da Vida

## v5.1.0 — Identidade Premium Azul Tecnológico (2026-06)

### Novo
- Tema visual premium inspirado em produtos SaaS modernos
- Fundo tecnológico com rede de conexões em SVG e animação CSS leve
- Glassmorphism refinado em cards, formulários, modais e simulador
- Ícones vetoriais consistentes no header, home, benefícios e páginas internas
- Nova identidade azul-ciano com glow discreto e maior profundidade
- Novo logotipo aplicado ao header, rodapé e ícones da aplicação
- Favicon e Apple Touch Icon adicionados
- `assets/css/premium.css` — camada visual isolada para facilitar manutenção futura

### Melhorado
- Modo escuro passa a ser o padrão visual, mantendo o modo claro disponível
- Responsividade revisada em 390 px, 768 px e 1456 px
- Contraste e legibilidade refinados nos dois temas
- Navegação mobile mantém apenas um seletor de tema
- Todas as regras de negócio, cálculos e integrações foram preservados

---

## v5.0.0 — Refatoração Modular (2026-06)

### Breaking changes
- Projeto migrado de single-file (`index.html` ~520KB) para arquitetura modular
- Logo extraída do base64 inline para `assets/img/logo/logo.png`
- Bancos movidos de código JavaScript para `assets/data/banks.json`

### Novo
- `assets/css/variables.css` — tokens centralizados (cores, espaçamentos)
- `assets/css/style.css` — base, layout, navegação, home, footer
- `assets/css/components.css` — todos os componentes + comparison cards
- `assets/css/responsive.css` — todos os media queries centralizados
- `assets/js/utils.js` — utilitários puros sem side effects
- `assets/js/storage.js` — camada de localStorage isolada e documentada
- `assets/js/calculator.js` — matemática financeira pura e testável
- `assets/js/api.js` — integração BCB com tolerância a falhas completa
- `assets/js/banks.js` — carregamento de banks.json com fallback hardcoded
- `assets/js/charts.js` — Chart.js wrappers isolados
- `assets/js/simulator.js` — estado + CRUD + renders do simulador
- `assets/js/ui.js` — tema, navegação, modal
- `assets/js/app.js` — entry point com Calculadora e Planejador
- `assets/data/banks.json` — definições das instituições financeiras

### Corrigido
- **Comparison cards**: simulador agora exibe TODAS as instituições com cálculo detalhado
  individual (investido, bruto, juros, líquido, IR) no ponto do scrub atual
- Cada banco usa corretamente seu próprio percentual do CDI
- Líder destacado com borda teal + badge "Melhor resultado"
- `computeSeries()` chamado apenas 1× por ciclo de render (sem recomputação)

---

## v4.0.0 — Sicredi, Santander, Itaú + Logos (2026-06)

- 3 novas instituições adicionadas ao simulador
- Logos via Clearbit API com fallback gracioso
- Cores de marca para todas as instituições

## v3.0.0 — Simulador v2 (2026-06)

- Cache Selic com AbortController
- CRUD de bancos personalizados com persistência
- Escaping HTML (XSS prevention)

## v2.0.0 — Hub Integrado (2026-06)

- Calculadora + Planejador + Simulador em uma SPA
- Navegação fluida entre ferramentas
- Cross-tool CTAs
- Design System v4.0

## v1.0.0 — Lançamento (2026)

- Calculadora de Vida com Método QDP
- Simulador de Rendimentos standalone

## v6.0 — 24/07/2026
- Nova identidade visual Instituto Schultz aplicada ao Consumo da Vida.
- Nova raposa abstrata em linguagem financeira/tecnológica.
- Home reconstruída com hero premium, ferramentas rápidas, dashboard, Método QDP e princípios.
- Nova camada `assets/css/brand-v6.css` para preservar a lógica existente e reduzir risco de regressão.
- Melhorias específicas de Safari/iPhone: safe-area, `dvh`, `visualViewport`, inputs 16px e touch targets.
- Fallback de gráficos Canvas quando Chart.js não carregar.
- Clipboard com fallback e navegação mais defensiva.
- Testes funcionais desktop/mobile sem overflow horizontal e sem erros JavaScript nos fluxos cobertos.

## v6.1 — Light Readability + Living Background
- Tema claro reconstruído com fundo neutro e contraste forte para títulos, textos, menus, cards e formulários.
- Redução da opacidade da rede e dos glows no tema claro para impedir sobreposição visual sobre textos.
- Cards e áreas de leitura agora usam superfícies quase opacas com blur controlado.
- Novo fundo vivo futurista com grid em perspectiva, rede pulsante e orbes de luz em movimento.
- Animações ajustadas para Safari/iPhone e respeitando `prefers-reduced-motion`.
- Menu mobile e footer receberam variantes claras dedicadas.

## v6.2 — Connected Light Field
- Novo fundo vivo em Canvas com nós luminosos conectados por linhas dinâmicas.
- Pulsação independente de brilho e tamanho para criar sensação orgânica de conectividade.
- Paleta e intensidade adaptadas automaticamente aos temas claro e escuro.
- Interação sutil com o ponteiro em desktop; versão econômica em touch/iPhone.
- Limite de densidade, DPR e FPS para reduzir custo de GPU/bateria em smartphones.
- Pausa automática quando a aba fica em segundo plano e respeito a `prefers-reduced-motion`.
- Reforço de legibilidade no tema claro com superfícies translúcidas de alto contraste e halo de leitura no hero.
- Ajustes de glass/backdrop para aproximar o site do mockup visual aprovado.

## v6.3 — Mobile Theme + Circular Logo + QA

- Corrigido o logo do cabeçalho e rodapé para manter composição circular com `object-fit: contain`, recuo interno e máscara circular, evitando cortes no topo e na base.
- Botão de alternância de tema agora permanece visível em smartphones e iPhone, inclusive em larguras pequenas.
- Ajustados espaçamentos da navegação mobile para acomodar logo, marca, tema e menu sem overflow.
- Mantido o fundo vivo de conectividade nos temas claro e escuro.
- Executada validação de sintaxe JavaScript, IDs/handlers do DOM, integridade básica do CSS e testes das fórmulas financeiras do simulador.

## v6.4 — Logo Option 2
- Reworked header and footer logo into a dedicated circular containment surface.
- Removed clipping from the fox artwork itself; the circular shape now belongs to the frame, not to the image mask.
- Added restrained cyan/blue glow and inner ring in dark mode.
- Added a lighter glass/ice containment treatment for light mode.
- Tuned logo scale independently for desktop, tablet and small iPhones so no part of the artwork is cut.

## v6.5 — Hero circular living emblem
- Ajuste exclusivo do logo principal da home; logo do menu permanece inalterado.
- Emblema principal agora é circular, com contenção real e sem cortes.
- Adicionado anel luminoso pulsante, aura, brilho móvel e nós de conectividade.
- Adicionado efeito de profundidade/tilt sutil com ponteiro em desktop.
- Mobile usa animações mais leves e respeita `prefers-reduced-motion`.
- Tema claro recebe versão própria do glow para preservar contraste e legibilidade.

## v6.6 — Circular logo clean finish
- Replaced the visible header, hero and footer artwork with the approved circular logo without text.
- Removed the extra blue container/ring styling from header and footer so the logo reads as a single clean circular mark.
- Preserved the animated hero depth, pulse, glow and interaction while preventing a duplicate hard circular frame.
- Kept favicons and application icons unchanged to avoid unintended PWA/cache regressions.

## v6.7 — Premium Icon System & Editorial Polish
- Novo sistema vetorial autoral de ícones para Calculadora, Planejador, Simulador, QDP e métricas da home.
- Estados hover/touch com brilho e microinteração, sem dependência de biblioteca externa.
- Ícones adaptados para temas claro/escuro e redução de movimento.
- Remoção de emojis decorativos em áreas funcionais para maior consistência visual.
- Revisão editorial dos textos principais para linguagem mais institucional, clara e premium.

## v7.0 — Professional Consulting Edition (2026-08-25)
- Nova camada visual `professional-v7.css` carregada após o design system existente.
- Hierarquia visual, navegação, hero, cards, formulários, modais e rodapé refinados para uso profissional.
- Home reposicionada como ferramenta de apoio à consultoria financeira, preservando IDs e fluxos funcionais.
- Melhorias específicas de toque e empilhamento do menu mobile.
- Modo claro redesenhado com estética executiva e contraste elevado.
- Nenhuma regra de cálculo, armazenamento, integração ou simulação foi alterada.
