# Validação — Corporate Portfolio Edition
Data: 29/08/2026

## Escopo
- Padronização visual corporativa/premium inspirada no portfólio Anderson Schultz.
- Preservação da arquitetura SPA e regras de negócio.
- Remoção do PicPay do comparador/simulador e das referências textuais.

## Validações executadas
- Sintaxe de todos os arquivos JavaScript com `node --check`: OK.
- JSON de `assets/data/banks.json`: válido.
- IDs duplicados no HTML: nenhum.
- Assets locais referenciados no HTML: todos encontrados.
- Funções referenciadas em `onclick`: todas existentes.
- Correspondência entre navegação (`home`, `calc`, `plan`, `sim`) e páginas SPA: OK.
- Ocorrências de PicPay no HTML/JS/dados: 0.
- Testes unitários da matemática do simulador:
  - R$ 1.000 + R$ 200/mês por 120 meses a 14,4% a.a. = R$ 54.209,71.
  - IR regressivo: 22,5% / 20% / 17,5% / 15% nos intervalos previstos.
  - CDI para Selic 14,5% = 14,4%.
  - Regra de poupança com Selic > 8,5% = ~6,1678% a.a. (sem TR).
  - Composição IPCA+ validada matematicamente.

## Observação de ambiente
O navegador headless disponível no ambiente de execução bloqueou navegação para `localhost` e `file://` por política administrativa. Por isso, a validação automatizada de interação ponta a ponta via navegador não pôde ser concluída neste ambiente. A checagem estrutural, sintática e matemática foi concluída com sucesso.
