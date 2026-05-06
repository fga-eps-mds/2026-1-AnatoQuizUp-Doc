# Visão de Implementação

A visão de implementação descreve como o código do AnatoQuizUp está organizado nos repositórios. Ela apresenta a estrutura de pastas, os principais módulos e os padrões usados para manter frontend, backend e documentação organizados.

## Repositórios

| Repositório | Responsabilidade |
|-------------|------------------|
| `2026-1-AnatoQuizUp-Web` | Aplicação frontend web. |
| `2026-1-AnatoQuizUp-BFF` | Backend-For-Frontend: ponto de entrada público; valida JWT; injeta token interno; orquestra Backend e AI. |
| `2026-1-AnatoQuizUp-Backend` | Regras de negócio, autenticação e persistência (privado em produção). Anteriormente chamado `-API`. |
| `2026-1-AnatoQuizUp-AI` | Serviço de IA (reservado para semestres futuros; sem código nesta release). |
| `2026-1-AnatoQuizUp-Doc` | Documentação do projeto em MkDocs. |

## Frontend

O frontend é organizado com base no Feature-Sliced Design. A estrutura separa inicialização da aplicação, páginas, widgets, features, entidades de domínio e recursos compartilhados.

```text
2026-1-AnatoQuizUp-Web/
|-- public/
|-- src/
|   |-- app/
|   |-- pages/
|   |-- widgets/
|   |-- features/
|   |-- entities/
|   |-- shared/
|   |-- main.tsx
|   `-- setupTests.ts
|-- index.html
|-- vite.config.ts
|-- jest.config.cjs
|-- eslint.config.js
`-- package.json
```

| Pasta | Papel na implementação |
|-------|-------------------------|
| `src/app/` | Configuração global, providers, rotas, layouts e estilos globais. |
| `src/pages/` | Páginas acessadas por rota. |
| `src/widgets/` | Blocos estruturais de interface, como header e layouts. |
| `src/features/` | Funcionalidades orientadas ao usuário. |
| `src/entities/` | Modelos e tipos centrais do domínio. |
| `src/shared/` | Componentes genéricos, cliente HTTP, assets, configurações e utilitários. |


## BFF

O BFF é um repositório separado que atua como ponto de entrada público da plataforma. É um proxy 100% orquestração: valida JWT, injeta o token interno e roteia por path para Backend ou AI.

```text
2026-1-AnatoQuizUp-BFF/
|-- src/
|   |-- config/
|   |   |-- app.ts
|   |   |-- cors.ts
|   |   |-- env.ts
|   |   `-- logger.ts
|   |-- routes/
|   |   |-- admin.routes.ts
|   |   |-- auth.routes.ts
|   |   |-- exemplos.routes.ts
|   |   |-- ia.routes.ts
|   |   `-- index.ts
|   |-- shared/
|   |   |-- clients/         (backend.client, ai.client)
|   |   |-- constants/
|   |   |-- errors/
|   |   |-- middlewares/     (autenticacao, proxy, tratamento-erros)
|   |   |-- types/
|   |   `-- utils/
|   `-- server.ts
|-- tests/
|-- Dockerfile
|-- eslint.config.js
|-- jest.config.cjs
|-- tsconfig.json
`-- package.json
```

| Pasta | Papel na implementação |
|-------|-------------------------|
| `src/config/` | Variáveis de ambiente (Zod), montagem do Express, CORS, logger. |
| `src/routes/` | Roteadores por prefixo, com regras de auth pública/privada e despacho ao cliente HTTP correto. |
| `src/shared/clients/` | Instâncias Axios para Backend e AI. |
| `src/shared/middlewares/` | Validação de JWT, proxy genérico, tratamento de erros. |

## Backend

O backend usa uma estrutura modular. Cada módulo de domínio deve agrupar rotas, validações, controllers, services, repositories, DTOs e testes.

```text
2026-1-AnatoQuizUp-Backend/
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- src/
|   |-- config/
|   |-- modules/
|   |-- shared/
|   `-- server.ts
|-- tests/
|-- docker-compose.yml
|-- Dockerfile
|-- eslint.config.js
|-- tsconfig.json
`-- package.json
```

| Pasta | Papel na implementação |
|-------|-------------------------|
| `prisma/` | Schema, migrations e seed do banco de dados. |
| `src/config/` | Configuração da aplicação, ambiente, banco, logger e montagem do Express. |
| `src/modules/` | Módulos de domínio da API. |
| `src/shared/` | Código compartilhado entre módulos, como erros, middlewares (incluindo `token-interno.middleware.ts`), tipos, constantes e utilitários. |
| `tests/` | Testes de aplicação e testes e2e. |


## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da visão de implementação com estrutura dos repositórios e padrões de módulos | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.1 | Inclusão do repositório BFF e renomeação `-API` → `-Backend` (PRD: Migração para Arquitetura com BFF) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
