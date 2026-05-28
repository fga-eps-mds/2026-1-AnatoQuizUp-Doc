# Plano de Qualidade

Este documento apresenta o que está sendo analisado no plano de qualidade do AnatoQuizUp, quais métricas são usadas no dashboard e quais faixas indicam resultado ideal, ponto de atenção ou resultado ruim.

## Critérios de avaliação

| O que está sendo avaliado | Métrica | Peso | Ideal | Atenção | Ruim |
|---------------------------|---------|-----:|-------|---------|------|
| Complexidade do código | Complexidade ciclomática por função | 35% | < 10 | >= 10 e <= 15 | > 15 |
| Comentários no código | Percentual de linhas comentadas | 10% | >= 10% e <= 30% | >= 5% e < 10% ou > 30% e <= 40% | < 5% ou > 40% |
| Duplicação de código | Percentual de linhas duplicadas | 25% | < 5% | >= 5% e <= 10% | > 10% |
| Cobertura de testes | Percentual de cobertura | 30% | >= 85% | >= 70% e < 85% | < 70% |
| Issues bem definidas | Issues com descrição preenchida / total de issues | N/A | >= 80% | >= 60% e < 80% | < 60% |
| Sucesso dos testes | Testes sem falhas / total de testes | N/A | >= 95% | >= 80% e < 95% | < 80% |
| Testes rápidos | Testes executados dentro do tempo esperado | N/A | >= 90% | >= 75% e < 90% | < 75% |
| Estabilidade de build | Builds com sucesso / builds concluídas | N/A | >= 80% | >= 60% e < 80% | < 60% |
| Conclusão de tarefas | Issues fechadas / issues totais | N/A | >= 70% | >= 50% e < 70% | < 50% |
| Manutenibilidade | Índice normalizado do dashboard | N/A | >= 60% | >= 40% e < 60% | < 40% |
| Confiabilidade | Índice normalizado do dashboard | N/A | >= 70% | >= 50% e < 70% | < 50% |
| Qualidade total | Nota total consolidada do dashboard | N/A | >= 75% | >= 60% e < 75% | < 60% |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 28/05/2026 | 1.0 | Criação do plano de qualidade com métricas do dashboard consolidado | Bruno Ricardo |
