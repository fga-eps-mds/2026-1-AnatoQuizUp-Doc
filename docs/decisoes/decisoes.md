# Decisões do Projeto

## Objetivo

Este documento registra decisões relevantes do AnatoQuizUp que afetam escopo, arquitetura, processo, qualidade e integração entre os repositórios. Ele complementa as decisões arquiteturais registradas em [Arquitetura](../arquitetura/decisoes.md).

## Registro de decisões

| ID | Decisão | Impacto | Status |
|----|---------|---------|--------|
| DP01 | Adotar Git Flow e Conventional Commits | Padroniza branches, PRs e rastreabilidade do histórico | Consolidada |
| DP02 | Incluir três perfis de acesso: aluno, professor e administrador | Define regras de cadastro, login, autorização e painel administrativo | Consolidada |
| DP03 | Separar o projeto em quatro repositórios: API, Web, Doc e AI | Permite ciclos independentes para backend, frontend, documentação e Inteligência Artificial| Consolidada |
| DP04 | Usar MkDocs Material para a documentação e publicar via GitHub Pages | Centraliza a documentação em site navegável e automatiza deploy com `mkdocs gh-deploy` | Consolidada |
| DP05 | Adotar Feature-Sliced Design no frontend | Organiza a aplicação em `app`, `pages`, `widgets`, `features`, `entities` e `shared` | Consolidada |
| DP06 | Organizar o backend por módulos e camadas | Cada domínio segue rotas, controller, service, repository, schemas e DTOs | Consolidada |
| DP07 | Usar Prisma e PostgreSQL como base de persistência | Viabiliza migrations, modelagem relacional e seed de administrador | Consolidada |
| DP08 | Aplicar quality gate de cobertura mínima de 85% | PRs precisam manter testes e cobertura para evitar regressões | Consolidada |
| DP09 | Incluir três perfis de acesso: aluno, professor e administrador | Define regras de cadastro, login, autorização e painel administrativo | Consolidada |
| DP10 | Criar professores com aprovação administrativa | Professores entram como pendentes e dependem de aprovação do administrador | Em analise |
| DP11 | Substituir a hipótese de SSO Microsoft na Release Major 1 por cadastro local de professor com SIAPE | Reduz dependência externa e adia integração Microsoft para release futura, mas replaneja US03 e US04 | Em analise |
| DP12 | Padronizar domínio e respostas em português brasileiro | Evita mistura de termos PT-BR/inglês em contratos, mensagens e enums de domínio | Em implantação |
| DP13 | Controlar mocks do frontend por variável de ambiente | Permite desenvolvimento e demonstração com fallback sem esconder a integração real | Consolidada |
| DP14 | Usar Brevo para email transacional | Implementa envio de email de redefinição de senha com template HTML e texto puro | Consolidada |
| DP15 | Medir Sprint 1 com EVM ágil | Permite acompanhar SPI, CPI, valor planejado, valor agregado e custo real | Consolidada |


## Decisões abertas ou em acompanhamento

| Tema | Estado | Próximo passo |
|------|--------|---------------|
| Fluxo completo de professor | Parcialmente definido | Implementar cadastro, login e aprovação administrativa com SIAPE |
| Endpoints definitivos em português | Em implantação | Padronizar rotas novas e revisar rotas legadas |
| Exportação de métricas do SonarCloud para Doc | Em ajuste | - |
| Funcionalidades pedagógicas da Release Major 2 | A planejar | Refinar backlog com Product Owners |

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Registro inicial das decisões de projeto consolidadas até a Sprint 1 | [Miguel Moreira](https://github.com/miguelmsoliveira) |
