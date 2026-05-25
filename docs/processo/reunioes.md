# Reuniões

## Objetivo

Centralizar os registros de reuniões do projeto, incluindo objetivos, principais decisões, encaminhamentos, modelo de ata e links para as atas completas.

Esta página substitui a separação anterior entre `reunioes.md` e `atas.md`, mantendo as informações em um único local para evitar repetição e facilitar a consulta.

---

## Rituais da Equipe

Para manter o alinhamento e o ritmo de desenvolvimento, a equipe realiza reuniões periódicas:

*   **Reunião Semanal (Sprint Planning / Review / Retrospectiva):** Realizada todos os **domingos, às 19h**, via Discord. Este é o encontro principal onde a equipe revisa o que foi entregue na sprint anterior, discute impedimentos e planeja as atividades e pareamentos para a sprint que se inicia.
*   **Reuniões com os POs (Product Owners):** Realizadas costumeiramente às segundas-feiras, das 12h30 às 13h30. Este encontro semanal é focado na validação de protótipos, alinhamento de fluxos de usuário e aprovação de critérios de aceitação. (Eventualmente, o formato ou horário pode ser adaptado sob demanda).
*   **Pareamento (Pair Programming):** Embora não seja uma reunião formal, os desenvolvedores se organizam em duplas durante a semana para programar juntos, garantindo a revisão contínua do código e nivelamento de conhecimento (prática baseada no Extreme Programming).

---

## Modelo de Ata

O modelo utilizado pelo projeto para registro de pauta e ata pode ser consultado no link abaixo:

[Modelo de Pauta e Ata](../assets/processo/modelo_pauta_ata.pdf)

---

## Reuniões Realizadas

<!-- Exemplo de registro de reunião
### XX/XX/XXXX — Título da Reunião

*   **Formato da ata:** PDF ou Markdown
*   **Objetivo:**
*   **Resumo da ata:**
*   **Principais decisões:**
    *   
*   **Encaminhamentos:**
    *   
*   **Ata completa:** [Link para ata](../assets/processo/<<doc_name>>-ata.pdf)
-->

### 06/04/2026 — Validação do Lean Inception

*   **Formato da ata:** PDF
*   **Objetivo:** Validar os resultados do Lean Inception com os stakeholders e priorizar as funcionalidades do MVP.
*   **Resumo da ata:** A reunião focou na validação dos artefatos gerados no Lean Inception, resultando em um refinamento do escopo e alinhamento de expectativas.
*   **Principais decisões:**
    *   Refinamento das *personas*, englobando estudantes com dificuldade de acesso a materiais físicos de anatomia.
    *   Alteração do escopo principal do produto para focar estritamente em anatomia radiológica.
    *   Identificada a necessidade de validação institucional prévia para a utilização da base de dados da BCE.
*   **Encaminhamentos:**
    *   Estruturar e preparar os artefatos finais para a próxima etapa de validação.
    *   Agendar um novo encontro de alinhamento.
*   **Ata completa:** [reuniao0604-ata.pdf](../assets/processo/reuniao0604-ata.pdf)

### 19/04/2026 — Sprint Planning

*   **Formato da ata:** Markdown
*   **Objetivo:** Executar o planejamento da Sprint, alinhando o backlog, distribuindo responsabilidades e definindo os próximos passos com base nas estimativas técnicas.
*   **Resumo da ata:** A equipe realizou a Sprint Planning, definindo os responsáveis pelas *issues* priorizadas e organizando a pauta para o próximo encontro com os POs.
*   **Principais decisões:**
    *   Sincronização das pontuações do *Planning Poker* entre todos os membros da equipe.
    *   Definição e priorização das tarefas críticas que irão compor o escopo da Sprint.
    *   Alocação de responsáveis e definição de pareamentos para as atividades.
    *   Estruturação prévia da pauta para a reunião de validação com os POs.
*   **Encaminhamentos:**
    *   Manter a planilha de registro de horas atualizada de forma contínua.
    *   Encaminhar a pauta formulada para os POs antes do encontro.
*   **Ata completa:** [reuniao1904-ata.md](../assets/processo/reuniao1904-ata.md)

### 20/04/2026 — Validação do sequenciador e dos critérios de aceitação com os POs

*   **Formato da ata:** Markdown
*   **Objetivo:** Apresentar e validar os artefatos do Lean Inception junto aos clientes, além de alinhar fluxos críticos como acesso, cadastro e integração com o banco de questões.
*   **Resumo da ata:** Sessão de validação do direcionamento do produto, focada na definição de regras de negócio para acesso e refinamento dos critérios de aceitação.
*   **Principais decisões:**
    *   Definição do uso do protocolo OAuth da Microsoft (e-mail institucional UnB) como autenticação padrão para os professores.
    *   Inclusão de um novo perfil de "Administrador" dentro do fluxo de login e autorização.
    *   Refinamento das regras de negócio e critérios de aceitação para os fluxos de cadastro e login.
    *   Decomposição de *issues* maiores, transformando *cards* menores em critérios de aceitação específicos.
*   **Encaminhamentos:**
    *   Refatorar os critérios de aceitação atrelados ao épico de cadastro de alunos.
    *   Conduzir um estudo de viabilidade técnica sobre a integração do login da Microsoft/UnB.
    *   Detalhar a mecânica do *card* de conquistas e aplicar os devidos ajustes no sequenciador de funcionalidades.
*   **Ata completa:** [reuniao2004-ata.md](../assets/processo/reuniao2004-ata.md)

---

### 03/05/2026 — Alinhamento com Cliente e Revisão de Tarefas

**Formato da ata:** Markdown

**Objetivo:**

Alinhar as ações para a reunião com o cliente e revisar o andamento das tarefas da equipe.

**Resumo da ata:**

Discussão sobre a preparação para a validação com o cliente, ajustes no fluxo de cadastro de professor e redistribuição de tarefas internas.

**Principais decisões:**

- Cadastro de professor será temporário via *seed* para validação.
- Painel de administração passou a ser responsabilidade de Genilson.
- Identificada necessidade de validar inconsistência na "Questão 6".

**Encaminhamentos:**

- Validar fluxo de cadastro e Canvas MVP com o cliente (04/05).
- Finalizar documentação de endpoints.
- Avançar na modelagem e protótipo até quarta-feira.

**Ata completa:** [reuniao0305-ata.md](../assets/processo/reuniao0305-ata.md)

### 17/05/2026 — Sprint Review, Planejamento da Sprint e Pauta com PO

**Formato da ata:** Markdown

**Objetivo:**

Acompanhar o desenvolvimento das histórias de usuário da semana anterior, planejar as atividades da próxima sprint e organizar a pauta para a reunião com os POs.

**Resumo da ata:**

Os membros presentes apresentaram o desenvolvimento das histórias de usuário trabalhadas na semana anterior. Em seguida, a equipe planejou a sprint da semana, distribuiu responsáveis e definiu a necessidade de levantar os custos do Railway para o deploy.

**Principais decisões:**

- Planejamento da sprint com foco em recompensas por acertos, visualização de turmas pelo aluno, listas de questões, geração de questões com IA e dashboard analítico.
- Miguel ficou responsável por verificar os custos do Railway relacionados ao deploy.
- A equipe organizou a pauta da próxima reunião com os POs.

**Encaminhamentos:**

- Arthur e João Vitor: Sistema de Recompensas por Acertos (Moedas Virtuais).
- Caio, Miguel e Genilson: Visualização de Turmas (Aluno).
- Pedro e Breno: Listas de Questões.
- Bruno e Maria Luisa: Geração de Questões com Inteligência Artificial e Dashboard Analítico.

**Ata completa:** [reuniao1705-ata.md](../assets/processo/reuniao1705-ata.md)

### 24/05/2026 — Sprint Review e Planejamento da Entrega da Release Major 2

**Formato da ata:** Markdown

**Objetivo:**

Validar as entregas realizadas pela equipe, planejar a próxima sprint e organizar as ações necessárias para a apresentação da Release Major 2.

**Resumo da ata:**

Os membros presentes apresentaram o que desenvolveram durante a sprint, e foi registrado que todos conseguiram concluir suas respectivas partes. Bruno e Maria Luisa apresentaram definições relacionadas à Inteligência Artificial e ao dashboard analítico. A equipe também dividiu as tarefas da próxima sprint, definiu Genilson e Caio como novas lideranças e alinhou a preparação para a apresentação da Release Major 2, marcada para 28/05/2026 às 19h30.

**Principais decisões:**

- Definição de Genilson e Caio como lideranças do próximo ciclo.
- Divisão das tarefas da próxima sprint.
- Continuidade das definições de IA e dashboard analítico com Bruno e Maria Luisa.
- Realização de reunião em 25/05/2026, às 10h, para resolver pendências da entrega.

**Encaminhamentos:**

- Resolver pendências da entrega da Release Major 2 em reunião no dia 25/05/2026, às 10h.
- Preparar a apresentação da Release Major 2 para 28/05/2026, às 19h30.
- Registrar e acompanhar as tarefas planejadas para a próxima sprint.

**Ata completa:** [reuniao2405-ata.md](../assets/processo/reuniao2405-ata.md)

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|---|---|---|---|
| 11/04/2026 | 1.0 | Criação do documento e inclusão de reuniões | [Victor Hugo](https://github.com/ViictorHugoo) |
| 26/04/2026 | 1.1 | Separação entre reuniões e atas e inclusão dos registros de 19/04 e 20/04 | [Ana Catarina](https://github.com/an4catarina) |
| 26/04/2026 | 1.2 | Criação da página de atas e organização dos links para os documentos existentes | [Ana Catarina](https://github.com/an4catarina) |
| 01/05/2026 | 1.3 | Centralização das informações de reuniões e atas em uma única página de reuniões | [Breno Fernandes](https://github.com/BrenoFrds) |
| 03/05/2026 | 1.4 | Inclusão da ata de alinhamento com cliente (03/05) | [Breno Fernandes](https://github.com/BrenoFrds) |
| 04/05/2026 | 1.5 | Adição da descrição dos rituais da equipe | [Genilson Junior](https://github.com/GenilsonJrs) |
| 17/05/2026 | 1.6 | Inclusão da ata de Sprint Review e planejamento de sprint (17/05) | [Bruno Ricardo](https://github.com/EhOBruno) |
| 24/05/2026 | 1.7 | Inclusão da ata de Sprint Review e planejamento da entrega da Release Major 2 (24/05) | [Breno Fernandes](https://github.com/BrenoFrds), [Genilson Junior](https://github.com/GenilsonJrs), [João Vitor](https://github.com/Joa0V) |
