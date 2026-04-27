# Metodologia e DoD

## Objetivo

Este documento descreve a forma de trabalho adotada no AnatoQuizUp, incluindo organização ágil, fluxo de desenvolvimento, critérios de pronto, critérios de aceite e práticas de qualidade usadas nos repositórios API, Web e Doc.

## Abordagem de trabalho

O projeto combina práticas de Scrum, Kanban, Git Flow e integração contínua. A equipe trabalha com backlog priorizado por releases, planejamento por sprint, acompanhamento de riscos e validação frequente com stakeholders.

| Prática | Aplicação no projeto |
|---------|---------------------|
| Lean Inception | Definição de visão, público, MVP e sequência inicial de entregas |
| Scrum | Planning, execução por sprint, revisão de entregas e retrospectiva |
| Kanban | Acompanhamento visual do fluxo de cards e gargalos de revisão |
| Git Flow | Organização das branches principais, features, releases e hotfixes |
| CI/CD | Validação automática de lint, build, testes, cobertura e SonarCloud |
| EVM ágil | Acompanhamento de valor planejado, valor agregado e custo real por sprint |
| Gestão de riscos | Matriz de riscos revisada durante a execução da release |

## Papéis no processo

| Papel | Responsabilidade |
|-------|------------------|
| Product Owners | Validar escopo, critérios de aceitação e prioridades |
| Liderança técnica | Acompanhar arquitetura, integração entre repositórios e decisões técnicas |
| Desenvolvedores | Implementar, testar, revisar e documentar as entregas |
| Revisores | Avaliar PRs quanto a comportamento, testes, qualidade e aderência ao padrão |
| Responsáveis por CI/CD | Manter pipelines, cobertura e integração com SonarCloud |
| Documentação | Registrar backlog, decisões, riscos, métricas e andamento das sprints |

## Fluxo de desenvolvimento

1. Selecionar item do backlog da release.
2. Confirmar critérios de aceitação ou critérios de conclusão.
3. Criar branch seguindo a política de branches.
4. Implementar em escopo pequeno e rastreável.
5. Adicionar ou atualizar testes proporcionais ao risco.
6. Rodar validações locais quando aplicável.
7. Abrir Pull Request com descrição, rastreabilidade e evidências.
8. Revisar o PR antes do merge.
9. Integrar somente com CI e quality gate aprovados.
10. Atualizar documentação quando a entrega alterar escopo, decisão ou processo.

## Política de branches

O projeto adota Git Flow, documentado em [Política de Branchs](../contribuicao/politica_branchs.md).

| Branch | Uso |
|--------|-----|
| `main` | Versão estável e base do GitHub Pages/documentação publicada |
| `develop` | Integração contínua do desenvolvimento |
| `feature/*` | Implementação de histórias, tarefas ou ajustes específicos |
| `release/*` | Preparação de entrega |
| `hotfix/*` | Correções urgentes |

## Política de commits

Os commits seguem Conventional Commits, conforme [Política de Commits](../contribuicao/politica_commits.md).

Exemplos:

```text
feat(auth): adiciona cadastro de aluno
fix(ci): corrige escopo de cobertura do sonar
docs(processo): registra sprint 1
test(auth): cobre middleware de autenticacao
```

## Definition of Ready

Um item está pronto para entrar em desenvolvimento quando:

- Possui objetivo claro.
- Tem critérios de aceitação ou conclusão testáveis.
- Indica o repositório impactado.
- Possui dependências mapeadas.
- Tem estimativa em pontos.
- Está alinhado com a release atual.
- Não depende de decisão de escopo ainda aberta.

## Definition of Done

Um item é considerado concluído quando:

- O comportamento planejado foi implementado.
- Os critérios de aceitação ou conclusão foram atendidos.
- Testes foram criados ou atualizados quando aplicável.
- Lint, build e testes passam localmente ou no CI.
- Cobertura não fica abaixo do mínimo definido para o repositório.
- O PR foi revisado e aprovado.
- Mudanças de contrato, decisão ou processo foram documentadas.
- Não há credenciais, segredos ou arquivos locais no commit.

## Qualidade e CI/CD

Os repositórios API e Web executam pipelines de CI no GitHub Actions. O fluxo inclui:

- Instalação limpa de dependências com `npm ci`.
- Lint.
- Build.
- Testes automatizados.
- Cobertura mínima de 85%.
- SonarCloud Scan e Quality Gate.

No backend, o pipeline também gera o Prisma Client antes do build. Nos dois repositórios, métricas do SonarCloud são previstas para exportação ao repositório de documentação em `analytics-raw-data/`.

## Padrões técnicos adotados

### Backend

- Node.js com TypeScript.
- Express.
- Prisma e PostgreSQL.
- Zod para validação.
- Camadas por módulo: routes, controller, service, repository, schemas e DTOs.
- Respostas padronizadas em português.
- Testes com Jest.

### Frontend

- React com TypeScript.
- Vite.
- Feature-Sliced Design.
- React Router.
- Tailwind CSS.
- Axios.
- Testes com Jest e Testing Library.

### Documentação

- MkDocs Material.
- Navegação declarada em `mkdocs.yml`.
- Deploy via GitHub Actions usando `mkdocs gh-deploy --force`.

## Gestão de riscos

A gestão de riscos fica documentada em [Matriz de Riscos](riscos.md). Durante a Sprint 1, os riscos mais críticos foram:

- R02: membros do time inativos ou com baixa disponibilidade.
- R05: cobertura de testes abaixo de 85%.
- R08: PRs sem revisão a tempo.
- R09: conflitos de merge por desenvolvimento paralelo.
- R13: falha no quality gate do SonarCloud.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da metodologia, fluxo de desenvolvimento e Definition of Done | [Miguel Moreira](https://github.com/miguelmsoliveira) |
