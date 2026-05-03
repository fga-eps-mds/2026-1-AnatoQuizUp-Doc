# Reuniões

## Objetivo

Centralizar os registros de reuniões do projeto, incluindo objetivos, principais decisões, encaminhamentos, modelo de ata e links para as atas completas.

Esta página substitui a separação anterior entre `reunioes.md` e `atas.md`, mantendo as informações em um único local para evitar repetição e facilitar a consulta.

---

## Rituais da Equipe

Para manter o alinhamento e o ritmo de desenvolvimento, a equipe realiza reuniões periódicas:

*   **Reunião Semanal (Sprint Planning / Review / Retrospectiva):** Realizada todos os **domingos, às 19h**, via Discord. Este é o encontro principal onde a equipe revisa o que foi entregue na sprint anterior, discute impedimentos e planeja as atividades e pareamentos para a sprint que se inicia.
*   **Reuniões com os POs (Product Owners):** Realizadas costumeiramente às segundas-feiras, das 10h às 11h30. Este encontro semanal é focado na validação de protótipos, alinhamento de fluxos de usuário e aprovação de critérios de aceitação. (Eventualmente, o formato ou horário pode ser adaptado sob demanda).
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

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 11/04/2026 | 1.0 | Criação do documento e inclusão de reuniões | [Victor Hugo](https://github.com/ViictorHugoo) |
| 26/04/2026 | 1.1 | Separação entre reuniões e atas e inclusão dos registros de 19/04 e 20/04 | [Ana Catarina](https://github.com/an4catarina) |
| 26/04/2026 | 1.2 | Criação da página de atas e organização dos links para os documentos existentes | [Ana Catarina](https://github.com/an4catarina) |
| 01/05/2026 | 1.3 | Centralização das informações de reuniões e atas em uma única página de reuniões | [Breno Fernandes](https://github.com/BrenoFrds) |
| 02/05/2026 | 1.4 | Adição da descrição dos rituais da equipe | [Genilson Junior](https://github.com/GenilsonJrs) |
