# Gerência de Configuração e DevOps

## Objetivo

Esta página registra como o AnatoQuizUp organiza seus repositórios, controla versões e código-fonte, automatiza integração e entrega (CI/CD) e realiza o deploy dos serviços. Ela complementa as políticas de [Branches](../contribuicao/politica_branchs.md) e [Commits](../contribuicao/politica_commits.md) e o [Plano de Qualidade](../qualidade/qualidade.md).

## Repositórios

O projeto é dividido em repositórios independentes, cada um com ciclo de vida e pipeline próprios:

| Repositório | Responsabilidade |
|-------------|------------------|
| `2026-1-AnatoQuizUp-Web` | Frontend SPA (React + Vite) |
| `2026-1-AnatoQuizUp-BFF` | Backend-For-Frontend: único ponto de entrada público |
| `2026-1-AnatoQuizUp-Usuario-Service` | Autenticação, identidade, administração de usuários e amizades |
| `2026-1-AnatoQuizUp-Quiz-Service` | Questões, quiz, turmas, listas, moedas e dashboards |
| `2026-1-AnatoQuizUp-AI` | Serviço de IA (reservado / em estruturação) |
| `2026-1-AnatoQuizUp-Doc` | Documentação MkDocs e coleta de métricas analíticas |

Todos pertencem à organização GitHub `fga-eps-mds`.

## Controle de versão e configuração

- **Estratégia de branches:** Git Flow (`main`, `develop`, `feature/*`, `release/x.y.z`, `hotfix/*`) — ver [Política de Branches](../contribuicao/politica_branchs.md).
- **Padrão de commits:** Conventional Commits / Commitizen — ver [Política de Commits](../contribuicao/politica_commits.md).
- **Branch protection:** nenhum commit direto na `main`/`develop`; merge exige PR aprovado, CI verde, cobertura ≥ 85% e quality gate do SonarCloud.
- **Segredos:** `.env` no `.gitignore` desde o primeiro commit; segredos reais apenas no Railway/Vercel. Segredos compartilhados (`JWT_SECRET_KEY`, `INTERNAL_TOKEN`) precisam ser idênticos entre BFF, Usuario-Service e Quiz-Service.

## Pipeline de CI/CD

Cada repositório de código (Usuario-Service, Quiz-Service, BFF e Web) tem em `.github/workflows/ci.yml` os passos:

1. Checkout (`fetch-depth: 0`, necessário para o SonarCloud).
2. Setup do Node.
3. `npm ci`.
4. `npm run lint`.
5. `prisma generate` (serviços com Prisma).
6. `npm run build`.
7. `npm test -- --coverage`.
8. **Gate de cobertura ≥ 85%** (lê `coverage/coverage-summary.json`).
9. **SonarCloud Scan** + Quality Gate.
10. (push na `main`) export de `metrics.json` para o repositório `2026-1-AnatoQuizUp-Doc`.

A análise estática usa o SonarCloud na organização `fga-eps-mds`.

## Deploy

| Serviço | Plataforma |
|---------|-----------|
| Web | Vercel e Railway |
| BFF | Railway |
| Usuario-Service | Railway |
| Quiz-Service | Railway |
| Postgres-Auth (Usuario-Service) | Railway |
| Postgres-Quiz (Quiz-Service) | Railway |
| MinIO/S3 (imagens de questões) | Railway |

O BFF é o único serviço com domínio público que aceita chamadas sem `X-Internal-Token`. Usuario-Service e Quiz-Service exigem o token. A aplicação está publicada em **<https://2026-1-anatoquizup-web-production.up.railway.app/home>** (plano Railway Hobby, US$ 5,00/mês — ver [Plano de Custos](plano-de-custos.md)).

## Evolução na Release 2

A migração da arquitetura monolítica para a arquitetura com BFF e serviços de domínio (ver [Decisões Arquiteturais](../arquitetura/decisoes.md)) exigiu mudanças de configuração e DevOps:

### Mudanças nos repositórios

- **Novos repositórios** criados para a nova arquitetura: `2026-1-AnatoQuizUp-BFF` e `2026-1-AnatoQuizUp-Quiz-Service`.
- **Repositório renomeado:** `2026-1-AnatoQuizUp-API` → `2026-1-AnatoQuizUp-Usuario-Service`.

### Evolução do CI/CD

- Novos repositórios criados já com CI/CD completo.
- Adição da coleta de métricas para os dashboards analíticos ao pipeline de **todos** os repositórios (export automático para o repo de documentação).

### Evolução do deploy

- **Upgrade do plano** utilizado na plataforma de deploy para viabilizar a nova arquitetura.
- Criação dos novos serviços (**BFF** e **Quiz-Service**).
- Criação dos novos bancos relacionais por serviço (**Postgres-Auth** e **Postgres-Quiz**) e do armazenamento de objetos **MinIO/S3** para as imagens das questões.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação da página de Gerência de Configuração e DevOps (repositórios, CI/CD, deploy e evolução da Release 2) | [Miguel Moreira](https://github.com/EhOMiguel) |
