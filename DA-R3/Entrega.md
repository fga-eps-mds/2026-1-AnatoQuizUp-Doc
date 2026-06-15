# DA-R3 — Dashboard Gerencial e Analítico · Release 3 (final)

> Submissão no Aprender 3: URL e PR do **Notebook Analytics** ([notebook-analytics-r3.ipynb](./notebook-analytics-r3.ipynb)).

## II. Dashboard Gerencial e Analítico

### Dashboard final — panorama completo do semestre

- [x] [Dashboard Eixo Produto](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/produto.html) — Q-Rapids/SonarCloud: indicadores estratégicos, densidades normalizadas, ratings, tendências R1→R3
- [x] [Dashboard Eixo Processo](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/processo.html) — Kanban: CFD, lead/cycle time, throughput, limites WIP pela Lei de Little, distribuição por membro
- [x] [Dashboard Eixo Projeto](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/projeto.html) — AgileEVM cumulativo: burnup, velocity, SPI/CPI, EAC/VAC, releases planejado × realizado

### Canvas Analytics

- [x] [Canvas Analytics](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/canvas.html) — síntese visual do desempenho do produto e do processo

### Notebook Analytics completo

- [x] [notebook-analytics-r3.ipynb](./notebook-analytics-r3.ipynb) — normalização (densidades Q-Rapids por arquivo), interpretação, agregação e gráficos estatísticos; executado com outputs versionados

### Análise planejado × realizado

- [x] Custo (EVM corrigido: PV baseline × AC equipe efetiva; EAC/VAC), tempo (releases nos marcos), escopo (SPI/velocity) e qualidade (quality gate ≥ 85%) — seção 3 do notebook e dashboard de Projeto

### Decisões gerenciais documentadas (≥ 5)

- [x] 7 decisões com causa, análise, decisão e resultado — seção 5 do notebook (D1–D3 das releases anteriores; D4–D7 novas, derivadas dos dashboards)

### Análise retrospectiva de IA

- [x] Seção 6 do notebook — o que foi aceito (correção do EVM, extração via APIs, Lei de Little), o que foi rejeitado (agregados prontos do ZenHub, lead time sem recorte de fluxo, chave SonarCloud errada) e o que exigiu julgamento humano

### Rastreabilidade

- [x] Dados brutos versionados em [`DA-R3/dados/`](./dados/) (ZenHub, GitHub, SonarCloud)
- [x] Scripts de extração/consolidação em [`DA-R3/scripts/`](./scripts/) — pipeline reproduzível descrito em [dashboards/index](https://fga-eps-mds.github.io/2026-1-AnatoQuizUp-Doc/dashboards/)
