# Dashboards Gerenciais e Analíticos

Painéis técnico-gerenciais do AnatoQuizUp com dados reais de execução do projeto, organizados nos três eixos da disciplina. Os dados são extraídos de ZenHub (board, sprints e eventos de movimentação), GitHub (issues, PRs e Actions) e SonarCloud (métricas de qualidade interna, atuais e históricas), consolidados pelos scripts versionados em `DA-R3/scripts/`.

| Eixo | Painel | Embasamento |
|------|--------|-------------|
| **Produto** | [Dashboard de Produto](produto/){target=_blank} | Modelo Q-Rapids e Analytics da Disciplina |
| **Processo** | [Dashboard de Processo](processo.html){target=_blank} | Kanban: Cumulative Flow Diagram, lead/cycle time, throughput e limites WIP calculados pela **Lei de Little** (WIP = TP × LT, algoritmo de Brechner) sobre os eventos reais do board |
| **Projeto** | [Dashboard de Projeto](projeto.html){target=_blank} | **AgileEVM** (Sulaiman/Barton/Blackburn) cumulativo: SPI em story points, CPI em R$ com PV na equipe baseline do [Plano de Custos](../processo/plano-de-custos.md) e AC na equipe efetiva por sprint |
| **Síntese** | [Canvas Analytics](canvas.html){target=_blank} | Síntese visual de uma página: indicadores-chave dos três eixos, planejado × realizado e decisões orientadas a dados |

A análise completa — normalização, interpretação, auditoria de qualidade dos dados, decisões gerenciais e retrospectiva de uso de IA — está no **Notebook Analytics** da DA-R3: [`DA-R3/notebook-analytics-r3.ipynb`](https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Doc/blob/main/DA-R3/notebook-analytics-r3.ipynb).

## Como os dados são atualizados

1. `node DA-R3/scripts/extrair-dados.mjs` — extrai os dados brutos (requer `ZENHUB_GRAPHQL_TOKEN` e `ZENHUB_REST_TOKEN`; `GITHUB_TOKEN` opcional). Para reextrair uma fase, apague o JSON correspondente em `DA-R3/dados/`.
2. `node DA-R3/scripts/consolidar.mjs` — recalcula os indicadores dos três eixos e regenera `docs/dashboards/dados-consolidados.js`.
3. Commit + push na `main` — o deploy do MkDocs publica os painéis junto com o site.

Os dados brutos de cada coleta ficam versionados em `DA-R3/dados/`, garantindo rastreabilidade das análises.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 12/06/2026 | 1.0 | Criação dos dashboards do eixo de processo e projeto com dados reais de ZenHub, GitHub e SonarCloud | [Miguel Moreira](https://github.com/EhOMiguel) |
| 22/06/2026 | 2.0 | Criação do dashboards do eixo de produto Q-Rapids por repositório com dados do SonarCloud | [Bruno Ricardo](https://github.com/EhOBruno) |
| 23/06/2026 | 2.1 | Correção de algumas fórmulas e pesos do Dashboard de Produto | [Bruno Ricardo](https://github.com/EhOBruno) |
