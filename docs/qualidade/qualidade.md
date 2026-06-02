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

## Resultados consolidados (Release 2)

Os dados abaixo foram coletados a partir de **17/05/2026**. A cada PR fechado na `main`, a integração **SonarCloud + GitHub** gera novos dados, que alimentam o dashboard consolidado. As densidades são normalizadas na faixa **0–1** (fonte: SonarQube / GitHub).

### Indicadores estratégicos

| Indicador estratégico | Valor (0–1) | O que mede |
|-----------------------|:-----------:|------------|
| Qualidade do Produto | **0,79** | Complexidade, comentários, duplicação e cobertura ponderados |
| Bloqueios | **0,60** | Issues com descrição preenchida |
| Prontidão do Produto | **0,46** | Builds bem-sucedidos sobre builds concluídos |

### Fatores e métricas avaliadas

| Fator | Peso | Valor (0–1) | Fonte |
|-------|:----:|:-----------:|-------|
| Complexidade — arquivos com ciclomática/função < 10 | 35% | 0,81 | SonarQube |
| Comentários — arquivos com 10%–30% de linhas comentadas | 10% | 0,00 | SonarQube |
| Duplicação — arquivos com < 5% de linhas duplicadas | 25% | 0,98 | SonarQube |
| Cobertura — arquivos com cobertura ≥ 85% | 30% | 0,86 | SonarQube |
| Issues bem definidas — issues com descrição preenchida | — | 0,60 | GitHub |
| Estabilidade das builds — execuções com sucesso / concluídas | — | 0,46 | GitHub Actions |

**Fórmulas usadas no export consolidado:**

- **Qualidade do Produto** = média ponderada (Complexidade 35%, Comentários 10%, Duplicação 25%, Cobertura 30%).
- **Bloqueios** = issues com descrição / total de issues.
- **Prontidão do Produto** = Estabilidade das Builds.
- **Estabilidade das Builds** = execuções com sucesso / execuções concluídas.

### Cobertura de testes por repositório

| Repositório | Cobertura | Meta |
|-------------|:---------:|:----:|
| Usuario-Service | 93% | ≥ 85% |
| Web | 93% | ≥ 85% |
| BFF | 91% | ≥ 85% |
| Quiz-Service | 66% | ≥ 85% |
| AI | N/A | — |

> O **Quiz-Service** ficou abaixo da meta de 85% nesta coleta (concentrou as features mais recentes de quiz, listas, moedas e dashboards). O **AI** aparece como N/A por ainda não ter código de aplicação. Elevar a cobertura do Quiz-Service é uma ação de qualidade priorizada para a Release Major 3.

### Classificações de qualidade (Q-Rapids)

| Dimensão | Resultado |
|----------|:---------:|
| Confiabilidade | Nota B |
| Segurança | N/A |
| Manutenibilidade | Nota B |
| Cobertura | 86% (A) |
| Duplicação | 2% (A) |
| Complexidade | Nota A |
| Complexidade cognitiva | N/A |

> Defeitos críticos, vulnerabilidades e code smells aparecem como **N/A** porque os JSONs exportados do SonarQube disponíveis no momento da coleta ainda não incluem essas métricas. Os campos serão preenchidos quando a exportação passar a incluí-las.

### Métricas ideais de referência

| Métrica | Valor ideal |
|---------|:-----------:|
| Cobertura de testes | ≥ 85% |
| Duplicação de código | ≤ 5% |
| Defeitos críticos | 0 |
| Vulnerabilidades | 0 |
| Code Smells | 0 |
| Complexidade ciclomática por função | ≤ 10 |
| Complexidade cognitiva por função | ≤ 15 |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 28/05/2026 | 1.0 | Criação do plano de qualidade com métricas do dashboard consolidado | Bruno Ricardo |
| 02/06/2026 | 1.1 | Inclusão dos resultados consolidados da Release 2 (indicadores estratégicos, fatores, cobertura por repositório e classificações Q-Rapids) | [Miguel Moreira](https://github.com/EhOMiguel) |
