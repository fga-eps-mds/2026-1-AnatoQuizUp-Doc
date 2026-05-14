# Visão de Implementação

A visão de implementação descreve como o código do AnatoQuizUp está organizado nos repositórios depois da fragmentação do domínio de quiz.

## Repositórios

| Repositório | Responsabilidade |
|-------------|------------------|
| `2026-1-AnatoQuizUp-Web` | Aplicação frontend React + Vite. |
| `2026-1-AnatoQuizUp-BFF` | Backend-For-Frontend: ponto de entrada público, validação de JWT na borda e proxy para serviços internos. |
| `2026-1-AnatoQuizUp-Backend` | Backend/Auth: autenticação, identidade, admin de usuários, exemplos e Auth DB. |
| `2026-1-AnatoQuizUp-Quiz-Service` | Domínio de quiz: questões, alternativas, resoluções, storage de imagens e Quiz DB. |
| `2026-1-AnatoQuizUp-AI` | Serviço de IA reservado para semestres futuros. |
| `2026-1-AnatoQuizUp-Doc` | Documentação do projeto em MkDocs. |

## Frontend

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

O Frontend usa `VITE_API_URL` apontando para o BFF. Features como `manage-questions` continuam chamando `/questoes`; a mudança de destino interno é invisível para o Web.

## BFF

```text
2026-1-AnatoQuizUp-BFF/
|-- src/
|   |-- config/
|   |-- routes/
|   |   |-- admin.routes.ts
|   |   |-- auth.routes.ts
|   |   |-- exemplos.routes.ts
|   |   |-- ia.routes.ts
|   |   |-- questoes.routes.ts
|   |   `-- index.ts
|   |-- shared/
|   |   |-- clients/
|   |   |   |-- backend.client.ts
|   |   |   |-- quiz.client.ts
|   |   |   `-- ai.client.ts
|   |   |-- middlewares/
|   |   |-- types/
|   |   `-- utils/
|   `-- server.ts
|-- tests/
|-- Dockerfile
|-- jest.config.cjs
|-- tsconfig.json
`-- package.json
```

O BFF não conhece regra de negócio. Ele valida JWT, filtra headers reservados, injeta `X-Internal-Token` e encaminha para o cliente HTTP correto.

## Backend/Auth

```text
2026-1-AnatoQuizUp-Backend/
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- src/
|   |-- config/
|   |-- modules/
|   |   |-- admin/
|   |   |-- auth/
|   |   `-- exemplo/
|   |-- shared/
|   `-- server.ts
|-- tests/
|-- docker-compose.yml
|-- Dockerfile
|-- jest.config.cjs
|-- prisma.config.ts
|-- tsconfig.json
`-- package.json
```

O Backend/Auth não deve conter módulo `question`, models de quiz no Prisma, nem configuração de storage de imagens de questões.

## Quiz-Service

```text
2026-1-AnatoQuizUp-Quiz-Service/
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|   `-- seed.ts
|-- src/
|   |-- config/
|   |   |-- storage.ts
|   |-- modules/
|   |   `-- questoes/
|   |-- shared/
|   |   |-- middlewares/
|   |   |-- types/
|   |   `-- constants/
|   `-- server.ts
|-- tests/
|-- docker-compose.yml
|-- Dockerfile
|-- Makefile
|-- sonar-project.properties
|-- jest.config.cjs
|-- prisma.config.ts
|-- tsconfig.json
`-- package.json
```

O Quiz-Service mantém IDs de usuários como referências externas (`criadoPorId`, `usuarioId`), sem FK para o banco do Backend/Auth.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da visão de implementação | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.1 | Inclusão do repositório BFF e renomeação `-API` para `-Backend` | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Inclusão do Quiz-Service e atualização das responsabilidades dos repositórios | Miguel Moreira |
| 13/05/2026 | 2.1 | Restauração dos acentos do português brasileiro | Miguel Moreira |
