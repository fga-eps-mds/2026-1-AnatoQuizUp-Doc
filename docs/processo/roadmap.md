# Roadmap e Releases

## Objetivo

Este documento apresenta o planejamento incremental do AnatoQuizUp, relacionando as releases previstas com o valor esperado para o produto e com o estado real dos repositórios do projeto. O roadmap é revisado ao final de cada sprint, considerando entregas realizadas, riscos materializados, decisões de escopo e feedback dos Product Owners.

## Visão geral do produto

O AnatoQuizUp é uma plataforma web educacional voltada ao estudo de anatomia radiológica. A evolução do produto foi planejada em releases incrementais: primeiro a base de autenticação e controle de acesso, depois as funcionalidades pedagógicas centrais e, por fim, recursos de engajamento e inteligência artificial.

| Release | Foco | Resultado esperado |
|---------|------|-------------------|
| Release Major 1 | Cadastro, autenticação e controle de acesso | Usuários conseguem entrar na plataforma com papéis e permissões definidos |
| Release Major 2 | Fluxo pedagógico, banco de questões e quiz | Professores organizam questões/turmas e alunos respondem quizzes e acompanham histórico |
| Release Major 3 | Gamificação, acompanhamento e recursos inteligentes | Plataforma passa a apoiar engajamento, desempenho, social e personalização do estudo |

## Linha do tempo

| Período | Marco | Situação |
|---------|-------|----------|
| 06/04/2026 | Validação da Lean Inception | Concluído |
| 19/04/2026 a 27/04/2026 | Release Major 1 (Sprint 1) | Concluída |
| 28/04/2026 a 25/05/2026 | Release Major 2 (Sprints 2 a 5) | Concluída |
| 26/05/2026 a 29/06/2026 | Release Major 3 (Sprints 6 em diante) | Em andamento |

As releases minor associadas a cada major estão registradas em [Datas Importantes](datas-importantes.md), e o acompanhamento detalhado de cada sprint (EVM, planejado × realizado, dificuldades) está em [Sprints](sprints.md).

## Release Major 1 — Concluída (27/04/2026)

A Release Major 1 estabeleceu a fundação de usuários do sistema. Ela não entrega ainda o jogo de perguntas e respostas, mas cria a base necessária para diferenciar alunos, professores e administradores com segurança.

### Escopo

O escopo completo está detalhado em [Histórias e Tarefas - Release Major 1](../backlog/release-major-1.md). Em resumo:

- Cadastro e login de aluno.
- Logout e refresh token.
- Recuperação de senha por email.
- Middleware de autenticação e autorização por papel.
- Rotas protegidas no frontend.
- Base do painel administrativo.
- Setup de CI/CD, cobertura e SonarCloud.

### Resultado

A release foi concluída em 27/04/2026. O fluxo completo de professor (cadastro com SIAPE, login e aprovação administrativa), o login de ponta a ponta e o painel administrativo, que ficaram parcialmente pendentes na Sprint 1, foram finalizados no início da Release Major 2.

## Release Major 2 — Concluída (25/05/2026)

A Release Major 2 avançou da fundação de acesso para o fluxo pedagógico principal, permitindo que o sistema comece a funcionar como plataforma de estudo.

### Escopo entregue

- **Refatoração arquitetural:** introdução do **BFF** como único ponto de entrada público e fragmentação do backend em **Usuario-Service** e **Quiz-Service**, com banco por serviço e storage de imagens em MinIO/S3.
- **Cadastro e login de professor** (SIAPE + aprovação administrativa) e **painel administrativo** de usuários.
- **Gestão de questões** (CRUD com upload de imagem e versionamento).
- **Quiz dinâmico:** montagem do quiz, resolução de questões, registro de tentativa e **agregação de histórico**.
- **Recompensa por acerto:** moedas ATP creditadas a cada questão respondida corretamente.
- **Turmas:** gestão pelo professor e visualização pelo aluno (Minhas Turmas).
- **Listas de questões** e compartilhamento por turma.

### Replanejamento

O planejamento inicial previa entregar também os dashboards de aluno e professor e a visualização de ranking. Devido a atrasos na resolução de questões e no histórico de tentativas, ao acréscimo da funcionalidade de recompensa por questão, à refatoração da arquitetura e à redução da equipe durante a release, essas três frentes foram **movidas para a Release Major 3**.

## Release Major 3 — Em andamento (até 29/06/2026)

A Release Major 3 evolui a experiência de aprendizagem, adicionando recursos de engajamento, acompanhamento e inteligência.

### Escopo previsto

- **Dashboard de desempenho do aluno** e **dashboard de rendimento da turma**.
- **Conquistas** e **loja virtual** (uso das moedas ATP).
- **Personalização** de perfil e avatar.
- **Funcionalidades sociais** (amizade entre alunos).
- **Estrutura de IA/RAG** para geração de questões com validação docente (ver [Inteligência Artificial](../arquitetura/ia.md)).

## Critérios para avançar entre releases

| Critério | Como verificar |
|----------|----------------|
| Build e testes passando | GitHub Actions dos repositórios (Usuario-Service, Quiz-Service, BFF e Web) |
| Cobertura mínima | Gate de 85% nos pipelines e SonarCloud |
| Documentação atualizada | MkDocs com páginas de backlog, sprint, riscos e decisões revisadas |
| Riscos revisados | Matriz de riscos atualizada ao final da sprint |
| Escopo validado | Alinhamento com Product Owners em reunião registrada |

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação do roadmap com base na Release Major 1, repos do projeto e documentos de acompanhamento | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 02/06/2026 | 1.1 | Atualização da linha do tempo e dos escopos: Release Major 1 e 2 concluídas (com escopo entregue e replanejamento) e Release Major 3 em andamento | [Miguel Moreira](https://github.com/EhOMiguel) |
