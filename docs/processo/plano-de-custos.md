# Plano de Custos

## 1. Introdução

O plano de custos do AnatoQuizUp apresenta uma estimativa do investimento necessário para desenvolver e operar o projeto durante o semestre letivo. A estimativa segue a lógica de gerenciamento de custos descrita pelo PMBOK, em que o projeto deve registrar como os custos são estimados, organizados e acompanhados ao longo da execução [<a href="#ref-1">1</a>].

Como o AnatoQuizUp é um projeto acadêmico da Universidade de Brasília, os valores apresentados não representam cobrança real para clientes, professores ou usuários finais. O objetivo deste documento é registrar uma visão financeira teórica do esforço do time e dos recursos utilizados, considerando pessoas, computadores, energia, internet e hospedagem.

## 2. Premissas da Estimativa

| Premissa | Valor adotado |
|---|---:|
| Período considerado | 17 semanas |
| Quantidade atual de estudantes | 9 integrantes |
| Carga semanal por integrante | 14 horas |
| Carga presencial semanal | 4 horas |
| Carga remota semanal | 10 horas |
| Equipamento por integrante | 1 computador |
| Valor patrimonial de referência por computador | R$ 3.500,00 |
| Vida útil do computador | 5 anos |
| Tarifa de energia considerada | R$ 0,84/kWh |
| Plano de internet residencial considerado | R$ 100,00/mês |
| Hospedagem considerada | Railway Hobby |
| Cotação utilizada para USD | US$ 1,00 = R$ 5,0720 |

O número de integrantes usado como baseline é 9. Caso a equipe seja reduzida para 8 estudantes, os custos proporcionais de hora de trabalho, computadores, energia e internet devem ser recalculados na planilha.

## 3. Estimativa de Custos

### 3.1 Hora de Trabalho dos Integrantes

Para representar o custo do esforço acadêmico, foi utilizado o custo médio anual de um estudante de universidade federal como referência. O levantamento consultado estima o custo médio anual em R$ 52.533,00 por aluno, com base em dados de 2023 do Ministério da Educação [<a href="#ref-2">2</a>].

Como a disciplina possui 4 créditos e foi adotada a média de 40 créditos anuais, o custo estimado por estudante na disciplina é:

| Item | Valor |
|---|---:|
| Custo anual por estudante | R$ 52.533,00 |
| Créditos anuais considerados | 40 |
| Custo por crédito | R$ 1.313,33 |
| Créditos da disciplina | 4 |
| Custo por estudante na disciplina | R$ 5.253,30 |
| Custo semanal por estudante | R$ 309,02 |
| Custo semanal da equipe | R$ 2.781,16 |
| Custo total da equipe em 17 semanas | R$ 47.279,70 |

Esse valor não é desembolsado pela equipe. Ele representa uma aproximação do investimento público associado ao tempo dos estudantes alocados à disciplina.

### 3.2 Computadores

Cada integrante já possui um computador próprio para atividades de desenvolvimento, testes, documentação, comunicação e acompanhamento do projeto. Portanto, este plano não considera a compra de máquinas. O custo registrado corresponde apenas à depreciação proporcional dos computadores durante o período do projeto.

Para calcular essa depreciação, foi adotado um computador intermediário de R$ 3.500,00 como valor patrimonial de referência. Conforme a tabela de depreciação aplicada a equipamentos de processamento de dados, foi considerada vida útil de 5 anos, equivalente a 20% de depreciação ao ano [<a href="#ref-3">3</a>].

| Item | Valor |
|---|---:|
| Valor patrimonial de referência por computador | R$ 3.500,00 |
| Vida útil | 5 anos |
| Semanas consideradas na vida útil | 260 semanas |
| Depreciação semanal por computador | R$ 13,46 |
| Quantidade de computadores | 9 |
| Custo semanal de depreciação | R$ 121,15 |
| Custo total de depreciação em 17 semanas | R$ 2.059,62 |

### 3.3 Energia

O custo de energia foi calculado considerando somente a carga remota de trabalho, pois as 4 horas presenciais ocorrem em ambiente acadêmico. Foi adotado consumo médio de 0,15 kWh por hora para cada computador e tarifa de R$ 0,84/kWh, baseada na tarifa residencial da Neoenergia Brasília [<a href="#ref-4">4</a>].

| Item | Valor |
|---|---:|
| Carga remota semanal por integrante | 10 h |
| Consumo estimado por computador | 0,15 kWh/h |
| Consumo semanal por computador | 1,50 kWh |
| Tarifa considerada | R$ 0,84/kWh |
| Custo semanal por integrante | R$ 1,26 |
| Custo semanal da equipe | R$ 11,34 |
| Custo total em 17 semanas | R$ 192,78 |

### 3.4 Internet

Para internet, foi considerado um plano residencial de R$ 100,00 por mês. O custo semanal foi proporcionalizado pela carga remota de 10 horas por semana, considerando 720 horas em um mês de 30 dias.

| Item | Valor |
|---|---:|
| Plano de internet considerado | R$ 100,00/mês |
| Horas consideradas por mês | 720 h |
| Custo por hora | R$ 0,14 |
| Uso remoto semanal por integrante | 10 h |
| Custo semanal por integrante | R$ 1,39 |
| Custo semanal da equipe | R$ 12,50 |
| Custo total em 17 semanas | R$ 212,50 |

### 3.5 Hospedagem e Deploy

Para o cenário de hospedagem, foi considerado o plano Hobby da Railway, usado como referência para manter os serviços do projeto em ambiente hospedado. A Railway apresenta esse plano com custo de US$ 5,00 por mês [<a href="#ref-5">5</a>].

A conversão foi feita com a cotação de US$ 1,00 = R$ 5,0720, consultada em 16/05/2026 [<a href="#ref-6">6</a>].

| Item | Valor |
|---|---:|
| Plano Railway Hobby | US$ 5,00/mês |
| Cotação utilizada | R$ 5,0720 |
| Custo mensal convertido | R$ 25,36 |
| Custo semanal estimado | R$ 6,34 |
| Custo total em 17 semanas | R$ 107,78 |

Essa estimativa considera o Railway como principal plataforma de deploy para os serviços do AnatoQuizUp. O documento não considera custos de IA, domínio próprio ou serviços adicionais de armazenamento, pois esses itens não fazem parte do custo operacional mínimo definido para esta estimativa.

### 3.6 Ferramentas de Apoio

As ferramentas de apoio utilizadas pelo projeto foram consideradas sem custo direto para o cenário acadêmico.

| Ferramenta | Uso no projeto | Custo considerado |
|---|---|---:|
| GitHub | Versionamento, issues e pull requests | R$ 0,00 |
| GitHub Actions | Integração contínua | R$ 0,00 |
| SonarCloud | Análise estática e qualidade | R$ 0,00 |
| MkDocs Material | Documentação | R$ 0,00 |
| Figma | Protótipos e apoio visual | R$ 0,00 |

### 3.7 Base de custo para o acompanhamento (EVM)

O EVM do projeto usa **exatamente a mesma base de custo** estimada acima — a carga documentada de **14 h/semana** por integrante. O custo semanal por integrante (sem a hospedagem fixa) é:

| Item | Valor/semana |
|---|---:|
| Hora de trabalho | R$ 309,02 |
| Computadores (depreciação) | R$ 13,46 |
| Energia | R$ 1,26 |
| Internet | R$ 1,39 |
| **Subtotal por integrante** | **R$ 325,13** |

Com a **equipe baseline de 9 integrantes** mais a hospedagem fixa (R$ 6,34/semana):

- **Custo semanal baseline:** 9 × R$ 325,13 + R$ 6,34 = **R$ 2.932,51** (≈ o custo semanal da equipe da seção 5)
- **BAC do projeto (10 sprints de desenvolvimento, S1 19/04 → S10 29/06):** R$ 2.932,51 × 10 = **R$ 29.325,10** — é a fatia das 10 semanas de desenvolvimento dentro do total de R$ 49.852,38 (17 semanas).

Esse é o orçamento (`BAC`) e a base do **Valor Planejado (`PV`)** no [EVM Consolidado](evm-consolidado.md). O **Custo Real (`AC`)** de cada sprint usa a **equipe efetiva** de cada período (12 → 10 → 9 → 8 integrantes), e **não** a baseline — é o que dá significado independente ao CPI (corrige o erro `AC = BAC` das páginas de EVM por sprint).

## 4. Planilha de Custos

Os cálculos do plano de custos estão detalhados na planilha a seguir:

<iframe width="1080" height="600" src="https://docs.google.com/spreadsheets/d/1nmNI7UqvyvOiEZioXNXyR0mZQ5Ewssmi0dC4iwxhb3M/edit?gid=1505254365#gid=1505254365"></iframe>

**Fonte:** [Planilha de custos do AnatoQuizUp](https://docs.google.com/spreadsheets/d/1nmNI7UqvyvOiEZioXNXyR0mZQ5Ewssmi0dC4iwxhb3M/edit?gid=1505254365#gid=1505254365), 2026.

## 5. Estimativa Consolidada

| Categoria | Custo semanal | Custo total em 17 semanas |
|---|---:|---:|
| Hora de trabalho dos integrantes | R$ 2.781,16 | R$ 47.279,70 |
| Computadores | R$ 121,15 | R$ 2.059,62 |
| Energia | R$ 11,34 | R$ 192,78 |
| Internet | R$ 12,50 | R$ 212,50 |
| Hospedagem e deploy | R$ 6,34 | R$ 107,78 |
| Ferramentas de apoio | R$ 0,00 | R$ 0,00 |
| **Total estimado** | **R$ 2.932,49** | **R$ 49.852,38** |

O custo financeiro direto previsto para operação mínima do projeto é o custo de hospedagem no Railway. Os demais valores representam custo acadêmico estimado, depreciação ou proporcionalização de recursos já utilizados pelos integrantes.

## 6. Referências Bibliográficas

<a id="ref-1"></a>
> [1] PROJECT MANAGEMENT INSTITUTE. Um Guia do Conhecimento em Gerenciamento de Projetos (Guia PMBOK). 6. ed. Project Management Institute, 2017. Acesso em: 16/05/2026.

<a id="ref-2"></a>
> [2] PODER360. Alunos de universidades federais têm custo médio anual de R$ 52.533. Disponível em: <a href="https://www.poder360.com.br/poder-economia/alunos-de-universidades-federais-tem-custo-medio-anual-de-r-52-533/">https://www.poder360.com.br/poder-economia/alunos-de-universidades-federais-tem-custo-medio-anual-de-r-52-533/</a>. Acesso em: 16/05/2026.

<a id="ref-3"></a>
> [3] RECEITA FEDERAL. Tabela de bens e taxas de depreciação. Disponível em: <a href="https://normasinternet2.receita.fazenda.gov.br/#/consulta/externa/81268/visao/vigente">https://normasinternet2.receita.fazenda.gov.br/#/consulta/externa/81268/visao/vigente</a>. Acesso em: 16/05/2026.

<a id="ref-4"></a>
> [4] NEOENERGIA BRASÍLIA. Tabela de tarifas de energia elétrica - Grupo B. Disponível em: <a href="https://www.neoenergia.com/documents/d/brasilia/neoenergia-brasilia_tarifas-de-energia-eletrica_grupo-b_jan2026_reh_n-3-542_vdesp3832-pdf?download=true">https://www.neoenergia.com/documents/d/brasilia/neoenergia-brasilia_tarifas-de-energia-eletrica_grupo-b_jan2026_reh_n-3-542_vdesp3832-pdf?download=true</a>. Acesso em: 16/05/2026.

<a id="ref-5"></a>
> [5] RAILWAY. Pricing Plans. Disponível em: <a href="https://docs.railway.com/pricing/plans">https://docs.railway.com/pricing/plans</a>. Acesso em: 16/05/2026.

<a id="ref-6"></a>
> [6] XE. Conversor de moedas USD para BRL. Disponível em: <a href="https://www.xe.com/currencyconverter/convert/?Amount=1&amp;From=USD&amp;To=BRL">https://www.xe.com/currencyconverter/convert/?Amount=1&amp;From=USD&amp;To=BRL</a>. Acesso em: 16/05/2026.

## 7. Histórico de Versão

| Versão | Data | Descrição | Autor | Revisor |
| :---: | :---: | :--- | :--- | :--- |
| `1.0` | 16/05/2026 | Criação do plano de custos do AnatoQuizUp | [Arthur Carneiro Trindade](https://github.com/trindadea) | [Miguel Moreira de Oliveira](https://github.com/EhOMiguel) |
