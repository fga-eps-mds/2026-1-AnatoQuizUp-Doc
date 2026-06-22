# EVM Ágil — Consolidado (R1 → R3)

> Esta página apresenta o **EVM corrigido e cumulativo** do projeto, idêntico ao que é exibido no [Dashboard de Projeto](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/projeto.html). Ela **substitui** o cálculo por sprint isolada das páginas anteriores (EVM Sprint 1–5), que continham um erro metodológico descrito abaixo.

## 1. Correção em relação ao modelo anterior

As páginas de EVM por sprint definiam **`AC = BAC` (custo realizado = custo planejado)**. Isso é incorreto em EVM: o `AC` deve ser o **custo real incorrido**, medido de forma independente do orçamento. A consequência do erro era grave:

- **CPI ≡ SPI** em toda sprint (ex.: 0,52 = 0,52) — o índice de custo não carregava informação nenhuma;
- **CV ≡ SV** sempre — variação de custo igual à de cronograma;
- nenhuma projeção de término (EAC) possível.

**No modelo corrigido**, o `AC` é o custo da **equipe efetiva de cada sprint** (12 → 10 → 9 → 8 integrantes), enquanto o `PV` usa a **equipe baseline** do [Plano de Custos](plano-de-custos.md) (9 integrantes). Assim `AC ≠ PV` e o **CPI passa a ser independente do SPI**.

## 2. Modelo (AgileEVM cumulativo, em story points)

| Grandeza | Definição |
|---|---|
| **PV (SP)** | story points planejados, acumulados |
| **EV (SP)** | story points entregues, acumulados |
| **SPI** | `EV(SP) / PV(SP)` |
| **BAC** | R$ 2.932,51/sprint (equipe baseline, carga de 14 h/sem) × 10 sprints = **R$ 29.325,10** |
| **PV (R$)** | R$ 2.932,51 × sprints decorridas (orçamento previsto acumulado) |
| **EV (R$)** | `SPI × PV(R$)` |
| **AC (R$)** | custo real incorrido acumulado (equipe **efetiva** de cada sprint) |
| **CPI** | `EV(R$) / AC(R$)` |
| **EAC** | `BAC / CPI` · **VAC** = `BAC − EAC` · **ETC** = `EAC − AC` |

> A base de custo (R$ 2.932,51/sprint) é a **mesma do [Plano de Custos](plano-de-custos.md)** (9 integrantes × 14 h/sem + hospedagem) — o BAC do EVM é a fatia das 10 sprints de desenvolvimento do total de R$ 49.852,38.

## 3. Série consolidada

| Sprint | Equipe | Plan SP | Entr SP | PV (R$) | EV (R$) | AC (R$) | SPI | CPI |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| S1 | 12 | 91 | 71 | 2.932,51 | 2.288,00 | 3.907,90 | 0,78 | 0,59 |
| S2 | 10 | 31 | 16 | 5.865,02 | 4.182,43 | 7.165,54 | 0,71 | 0,58 |
| S3 | 9 | 29 | 26 | 8.797,53 | 6.583,58 | 10.098,05 | 0,75 | 0,65 |
| S4 | 9 | 25 | 14 | 11.730,04 | 8.464,29 | 13.030,56 | 0,72 | 0,65 |
| S5 | 9 | 30 | 66 | 14.662,55 | 13.737,24 | 15.963,07 | 0,94 | 0,86 |
| S6 | 8 | 17 | 3 | 17.595,06 | 15.464,72 | 18.570,45 | 0,88 | 0,83 |
| S7 | 8 | 7 | 15 | 20.527,57 | 18.831,81 | 21.177,83 | 0,92 | 0,89 |
| **S8** | 8 | 7 | — | 23.460,08 | 20.886,40 | 23.785,21 | **0,89** | **0,88** |

**Última sprint fechada (S8):** SPI **0,89** · CPI **0,88** · EAC **R$ 33.395,11** · VAC **−R$ 4.070,01** (estouro projetado de ~R$ 4,1 mil sobre o BAC de R$ 29.325,10).

## 4. Leitura

- **SPI 0,89** — o time entregou ~89% do que planejou. O valor inicial medido (0,66) era **artefato de medição**: havia ~60 SP de entrega real sem `estimate` no board (débito de estimativa, quitado retroativamente pela equipe).
- **CPI 0,88** — custo levemente acima do valor agregado; a equipe efetiva (média ~9) ficou perto do baseline de 9, por isso CPI e SPI são próximos — mas agora por um motivo **real e medido**, não por construção.
- **Caveat do bulk-close:** o time fecha issues em lote nas releases (R1 27/04, R2 25/05), o que distorce a **velocity por sprint** (S5 com 66 SP, S6 com 3). A leitura correta é **cumulativa / por release**.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 18/06/2026 | 1.0 | EVM consolidado corrigido (AC = equipe efetiva); substitui o cálculo por sprint com AC = BAC | [Miguel Moreira](https://github.com/EhOMiguel) |
