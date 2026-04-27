# Sprints

## Objetivo

Este documento registra o acompanhamento das sprints do AnatoQuizUp, relacionando planejamento, entregas, desvios e ações de melhoria. Ele deve ser lido em conjunto com o [Roadmap](roadmap.md), a [Matriz de Riscos](riscos.md) e o [EVM da Sprint 1](evm-sprint1.md).

## Organização das sprints

O time trabalha com sprints curtas, orientadas por entregas incrementais. Cada sprint parte do backlog priorizado, passa por planejamento, execução com acompanhamento diário, revisão de PRs e fechamento com análise de resultados.

| Atividade | Objetivo | Evidência |
|-----------|----------|-----------|
| Planning | Selecionar itens do backlog e distribuir responsáveis | Itens planejados na Release Major correspondente |
| Execução | Implementar, revisar e integrar incrementos | PRs nos repositórios API, Web e Doc |
| Acompanhamento | Identificar bloqueios, riscos e desvios | Reuniões, matriz de riscos e conversas do time |
| Fechamento | Medir entrega, custo e próximos ajustes | EVM, retrospectiva e atualização da documentação |

## Sprint 1

| Campo | Valor |
|-------|-------|
| Período | 19/04/2026 a 26/04/2026 |
| Release associada | Release Major 1 |
| Foco | Fundação de autenticação, cadastro de usuários, controle de acesso e infraestrutura |
| Pontos planejados | 91 |
| Pontos entregues | 71 |
| Custo real registrado | 140 h |
| SPI | 0,78 |
| CPI | 1,52 |

### Objetivo da sprint

A Sprint 1 buscou construir a base técnica do produto para permitir evolução das funcionalidades de cadastro, autenticação e controle de acesso. O foco foi reduzir riscos de infraestrutura e preparar os repositórios para desenvolvimento contínuo com CI/CD, testes e documentação.

### Itens planejados

Os itens planejados fazem parte da [Release Major 1](../backlog/release-major-1.md). A sprint incluía:

- Modelagem Prisma e seed de administrador.
- Configuração de JWT.
- Setup do módulo de autenticação no backend.
- Setup FSD no frontend.
- Spike e configuração do serviço de email.
- Middleware de autenticação e autorização.
- Rotas protegidas.
- Cadastro e login de aluno.
- Cadastro e login de professor.
- Logout, refresh token e recuperação de senha.
- Header, página inicial e tela 404.
- Painel administrativo.
- Visão de aluno para professor.

### Entregas realizadas

| Frente | Entrega | Evidência nos repositórios |
|--------|---------|----------------------------|
| Backend | Modelagem de usuários, perfis, status, refresh tokens e tokens de redefinição | `prisma/schema.prisma` e migrations |
| Backend | Cadastro de aluno | `src/modules/auth/aluno/` |
| Backend | Endpoints auxiliares de nacionalidades, localidades e opções acadêmicas | `src/modules/auth/aluno/*` e `src/shared/constants/*` |
| Backend | JWT e middleware de autenticação | `src/shared/utils/jwt.ts` e `src/shared/middlewares/autenticacao.middleware.ts` |
| Backend | Serviço de email transacional | `src/shared/services/emailService.ts` |
| Backend | Testes e cobertura com Jest | `tests/unit/` e `jest.config.cjs` |
| Frontend | Estrutura FSD e roteamento | `src/app/`, `src/pages/`, `src/features/`, `src/widgets/`, `src/shared/` |
| Frontend | Cadastro de aluno com formulário em etapas | `src/features/register-student/` e `src/pages/register/` |
| Frontend | Login, AuthProvider, rotas protegidas, header e home | `src/features/auth-by-credencials/`, `src/app/providers/`, `src/app/router/`, `src/widgets/header/` |
| CI/CD | Pipelines com lint, build, testes, cobertura e SonarCloud | `.github/workflows/ci.yml` nos repos API e Web |
| Documentação | Roadmap, backlog, arquitetura, reuniões, EVM, riscos e quadro de conhecimento | `2026-1-AnatoQuizUp-Doc/docs/` |

### Itens não concluídos

| Item | Motivo principal | Encaminhamento |
|------|------------------|----------------|
| US03 - Cadastro de professor | Mudança e refinamento do fluxo de professor, saindo da hipótese de SSO Microsoft para cadastro local com SIAPE | Priorizar no início da próxima sprint |
| US04 - Login de professor | Depende do cadastro e status de aprovação do professor | Implementar junto ao fluxo de professor |
| US08 - Painel administrativo completo | Depende do fluxo de aprovação de professores | Implementar junto ao fluxo de professor |

### Análise da sprint

O EVM indica atraso de cronograma: o SPI de 0,78 mostra que foram entregues 78% dos pontos planejados. A principal causa foi a mudança de escopo no fluxo de professor, que exigiu replanejamento para evitar retrabalho.

Ao mesmo tempo, o CPI de 1,52 indica boa eficiência em relação às horas registradas. A leitura mais segura é que a sprint entregou boa parte da infraestrutura com custo menor que o estimado, mas o registro de horas ainda precisa ser melhorado para tornar a métrica mais confiável.

### Ações para a próxima sprint

1. Fechar com os Product Owners a decisão final do fluxo de professor.
2. Priorizar US03 e US04 antes de novas funcionalidades pedagógicas.
3. Melhorar disciplina de registro de horas.
4. Manter cobertura mínima de 85% desde o início de cada PR.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Registro da Sprint 1 com base na Release Major 1, EVM e estado dos repositórios | [Miguel Moreira](https://github.com/miguelmsoliveira) |
