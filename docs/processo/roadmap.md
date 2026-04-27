# Roadmap e Releases

## Objetivo

Este documento apresenta o planejamento incremental do AnatoQuizUp, relacionando as releases previstas com o valor esperado para o produto e com o estado real dos repositórios do projeto. O roadmap é revisado ao final de cada sprint, considerando entregas realizadas, riscos materializados, decisões de escopo e feedback dos Product Owners.

## Visão geral do produto

O AnatoQuizUp é uma plataforma web educacional voltada ao estudo de anatomia radiológica. A evolução do produto foi planejada em releases incrementais: primeiro a base de autenticação e controle de acesso, depois as funcionalidades pedagógicas centrais e, por fim, recursos de engajamento e inteligência artificial.

| Release | Foco | Resultado esperado |
|---------|------|-------------------|
| Release Major 1 | Cadastro, autenticação e controle de acesso | Usuários conseguem entrar na plataforma com papéis e permissões definidos |
| Release Major 2 | Fluxo pedagógico e banco de questões | Professores conseguem organizar questões e alunos conseguem responder quizzes |
| Release Major 3 | Gamificação, acompanhamento e recursos inteligentes | Plataforma passa a apoiar engajamento, desempenho e personalização do estudo |

## Linha do tempo

| Período | Marco | Situação | Observações |
|---------|-------|----------|-------------|
| 06/04/2026 | Validação da Lean Inception | Concluído | Visão do produto e foco em anatomia radiológica validados com stakeholders |
| 19/04/2026 a 26/04/2026 | Sprint 1 da Release Major 1 | Concluído com pendências | Base técnica, cadastro de aluno, autenticação parcial e CI/CD avançaram; fluxo de professor foi replanejado |
| 27/04/2026 | Consolidação da documentação da Release Major 1 | Em andamento | Documentos de roadmap, sprint, riscos, EVM e decisões atualizados |
| Próxima sprint | Continuação da Release Major 1 | Planejado | Prioridade para fechar fluxo de professor, login, admin e integração de ponta a ponta |

## Release Major 1

A Release Major 1 tem como objetivo estabelecer a fundação de usuários do sistema. Ela não busca entregar ainda o jogo de perguntas e respostas, mas sim criar a base necessária para que as próximas releases consigam diferenciar alunos, professores e administradores com segurança.

### Escopo planejado

O escopo completo está detalhado em [Histórias e Tarefas - Release Major 1](../backlog/release-major-1.md). Em resumo, a release cobre:

- Cadastro e login de aluno.
- Cadastro e login de professor.
- Logout e refresh token.
- Recuperação de senha por email.
- Middleware de autenticação e autorização.
- Rotas protegidas no frontend.
- Painel administrativo para aprovação e gestão de usuários.
- Setup de CI/CD, cobertura e SonarCloud.

### Estado ao final da Sprint 1

| Frente | Entregas observadas nos repositórios | Situação |
|--------|--------------------------------------|----------|
| Backend | Modelagem Prisma de usuários, refresh tokens e tokens de redefinição; seed de administrador; JWT; middleware de autenticação; serviço de email com Brevo; cadastro de aluno; endpoints auxiliares de localidades, nacionalidades e opções acadêmicas; testes Jest com cobertura | Parcialmente concluído |
| Frontend | Estrutura FSD; login; cadastro de aluno em etapas; rotas protegidas; header; home; componentes de formulário; serviços de API para cadastro e opções auxiliares; testes com Testing Library/Jest | Parcialmente concluído |
| Documentação | Backlog da Release Major 1; visão do produto; Lean Inception; arquitetura; reuniões; EVM Sprint 1; matriz de riscos; quadro de conhecimento | Em consolidação |
| CI/CD | Pipelines de backend e frontend com lint, build, testes, cobertura mínima e SonarCloud; deploy da documentação via MkDocs/GitHub Pages | Em uso |

### Pendências principais

- Fechar e implementar o fluxo completo de professor com SIAPE e aprovação administrativa.
- Consolidar login real de aluno/professor/admin de ponta a ponta.
- Finalizar middleware de autorização por papel e aplicar nas rotas protegidas.
- Fechar refresh token, logout e recuperação de senha integrados ao frontend.
- Entregar painel administrativo com busca, filtros, aprovação, rejeição, desativação e reativação.
- Resolver inconsistências de nomenclatura PT-BR/inglês ainda existentes no frontend.

## Release Major 2

A Release Major 2 deve avançar da fundação de acesso para o fluxo pedagógico principal. O objetivo esperado é permitir que o sistema comece a funcionar como plataforma de estudo, ainda que sem todos os recursos avançados de gamificação.

### Escopo previsto

- Cadastro e organização de questões de anatomia.
- Fluxo de resolução de quizzes por alunos.
- Associação de questões a temas, turmas ou listas.
- Visualização básica de resultado após responder.
- Ferramentas iniciais de acompanhamento para professores.

### Dependências

- Usuários e papéis funcionando de forma estável.
- Painel administrativo validando professores.
- Backend e frontend integrados com contrato de API estável.
- Base de questões migrada ou preparada para importação.

## Release Major 3

A Release Major 3 deve evoluir a experiência de aprendizagem, adicionando recursos de engajamento e acompanhamento mais ricos.

### Escopo previsto

- Gamificação: pontuação, conquistas, rankings ou progresso.
- Relatórios de desempenho por aluno e por tema.
- Melhorias de feedback pedagógico após quizzes.
- Possíveis recursos de IA para apoio ao estudo, geração de explicações ou recomendação de conteúdo, conforme validação futura.

## Critérios para avançar entre releases

| Critério | Como verificar |
|----------|----------------|
| Build e testes passando | GitHub Actions dos repositórios API e Web |
| Cobertura mínima | Gate de 85% nos pipelines e SonarCloud |
| Documentação atualizada | MkDocs com páginas de backlog, sprint, riscos e decisões revisadas |
| Riscos revisados | Matriz de riscos atualizada ao final da sprint |
| Escopo validado | Alinhamento com Product Owners em reunião registrada |

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação do roadmap com base na Release Major 1, repos do projeto e documentos de acompanhamento | [Miguel Moreira](https://github.com/miguelmsoliveira) |
