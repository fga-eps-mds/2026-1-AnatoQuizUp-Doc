# EVM Ágil — Consolidado (R1 → R3)

> Esta página apresenta o **EVM corrigido e cumulativo** do projeto, idêntico ao que é exibido no [Dashboard de Projeto](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/projeto.html). Ela **substitui** o cálculo por sprint isolada das páginas anteriores (EVM Sprint 1–5), que continham dois erros metodológicos descritos abaixo. O método segue o **AgileEVM** (Sulaiman, Barton & Blackburn, 2006): EVM cumulativo em *story points* para o cronograma (SPI) e em R$ para o custo (CPI).

## 1. Correções em relação ao modelo anterior

**(a) `AC = BAC` (custo realizado = custo planejado).** Isso é incorreto: o `AC` deve ser o **custo real incorrido**, medido de forma independente do orçamento. A consequência era grave — **CPI ≡ SPI** em toda sprint, **CV ≡ SV** sempre, e nenhuma projeção de término (EAC) possível.

**(b) Baseline de 9 integrantes.** O Plano de Custos foi originalmente calculado com a equipe já reduzida. Mas o *baseline* do EVM deve ser o **plano do início do projeto**, quando a equipe estava **completa: 12 integrantes**. Usar 9 escondia justamente o maior fato do projeto — a **perda de 1/3 da equipe** ao longo do semestre.

**No modelo corrigido:**

- o **`PV`/`BAC` usa a equipe baseline de 12** (plano do início — [Plano de Custos](plano-de-custos.md));
- o **`AC` usa a equipe efetiva de cada sprint** (12 → 10 → 9 → 8 integrantes), que encolheu;
- assim `AC < PV` na maior parte do projeto, e o **CPI fica independente do SPI**.

## 2. Modelo (AgileEVM cumulativo)

| Grandeza | Definição |
|---|---|
| **PV (SP)** | story points **planejados**, acumulados (S1–S5 dos relatórios de sprint publicados; S6–S10 pela soma dos *estimates* das issues atribuídas a cada sprint no ZenHub) |
| **EV (SP)** | story points **entregues** (issues fechadas com *estimate* na janela), acumulados |
| **SPI** | `EV(SP) / PV(SP)` — aderência de escopo ao plano |
| **BAC** | R$ 3.907,90/semana (12 integrantes × 14 h/sem + hospedagem) × 10 sprints = **R$ 39.079,00** |
| **PV (R$)** | R$ 3.907,90 × sprints decorridas (orçamento previsto acumulado) |
| **EV (R$)** | `SPI × PV(R$)` |
| **AC (R$)** | custo real acumulado (equipe **efetiva** de cada sprint × R$ 325,13/pessoa) |
| **CPI** | `EV(R$) / AC(R$)` — eficiência de custo |
| **EAC** | `BAC / CPI` · **VAC** = `BAC − EAC` · **ETC** = `EAC − AC` |

> A base de custo (R$ 325,13/pessoa/semana, 14 h/sem) é a **mesma do [Plano de Custos](plano-de-custos.md)**. O BAC do EVM é a fatia das 10 sprints de desenvolvimento.

## 3. Série consolidada

| Sprint | Equipe | PV (SP) | EV (SP) | PV (R$) | EV (R$) | AC (R$) | SPI | CPI |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S1 | 12 | 91 | 71 | 3.907,90 | 3.049,02 | 3.907,90 | 0,78 | 0,78 |
| S2 | 10 | 122 | 87 | 7.815,80 | 5.573,56 | 7.165,54 | 0,71 | 0,78 |
| S3 | 9 | 151 | 113 | 11.723,70 | 8.773,36 | 10.098,05 | 0,75 | 0,87 |
| S4 | 9 | 176 | 127 | 15.631,60 | 11.279,62 | 13.030,56 | 0,72 | 0,87 |
| S5 | 9 | 206 | 193 | 19.539,50 | 18.306,42 | 15.963,07 | 0,94 | 1,15 |
| S6 | 8 | 232 | 196 | 23.447,40 | 19.809,01 | 18.570,45 | 0,84 | 1,07 |
| S7 | 8 | 236 | 196 | 27.355,30 | 22.718,81 | 21.177,83 | 0,83 | 1,07 |
| S8 | 8 | 248 | 223 | 31.263,20 | 28.111,67 | 23.785,21 | 0,90 | 1,18 |
| S9 | 8 | 253 | 226 | 35.171,10 | 31.417,66 | 26.392,59 | 0,89 | 1,19 |
| **S10** (em andamento) | 8 | 253 | 228 | 39.079,00 | 35.217,44 | 28.999,97 | **0,90** | **1,21** |

**Posição atual (S10):** SPI **0,90** · CPI **1,21** · EAC **R$ 32.179,79** · VAC **+R$ 6.899,21** (projeção de término ~R$ 6,9 mil **abaixo** do BAC de R$ 39.079,00).

## 4. Leitura

- **SPI 0,90 (cronograma).** O time entregou ~90% do escopo que **planejou nas sprints**. O backlog de ambição que nunca entrou em sprint (53 cards de Icebox/Product Backlog, encerrados na limpeza de board ao fim do semestre) é **descopo** — mudança de baseline, não atraso —, por isso não entra no PV.
- **CPI 1,21 (custo) — atenção à interpretação.** O projeto está **abaixo do orçamento**, mas isso **não é eficiência**: o baseline assumiu 12 integrantes e a equipe caiu para 8. Menos pessoas ⇒ menos custo real (AC) ⇒ CPI > 1. O mesmo encolhimento explica o SPI < 1. São **dois efeitos da mesma causa** (perda de equipe), agora visíveis separadamente porque CPI ≠ SPI.
- **Trajetória do CPI.** Sai de 0,78 (S1–S2, equipe cheia e entrega inicial baixa) e cruza 1,0 na **S5**, quando a equipe já reduzida passa a custar abaixo do plano de 12.
- **Caveat do bulk-close.** O time fecha issues em lote nas releases (R1 27/04, R2 25/05), o que distorce a **velocity por sprint** (S5 com 66 SP, S6 com 3). A leitura correta é **cumulativa / por release** — que é como esta série é construída.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 18/06/2026 | 1.0 | EVM consolidado corrigido (AC = equipe efetiva); substitui o cálculo por sprint com AC = BAC | [Miguel Moreira](https://github.com/EhOMiguel) |
| 27/06/2026 | 2.0 | Baseline corrigido para a equipe completa de 12 (início do projeto); BAC R$ 39.079,00; PV S6–S10 por atribuição de sprint; dados de 27/06 pós-limpeza de board | [Miguel Moreira](https://github.com/EhOMiguel) |
