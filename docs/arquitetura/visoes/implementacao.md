# Visao de Implementacao

A visao de implementacao descreve como o codigo do AnatoQuizUp esta organizado nos repositorios depois da fragmentacao do dominio de quiz.

## Repositorios

| Repositorio | Responsabilidade |
|-------------|------------------|
| `2026-1-AnatoQuizUp-Web` | Aplicacao frontend React + Vite. |
| `2026-1-AnatoQuizUp-BFF` | Backend-For-Frontend: ponto de entrada publico, validacao de JWT na borda e proxy para servicos internos. |
| `2026-1-AnatoQuizUp-Backend` | Backend/Auth: autenticacao, identidade, admin de usuarios, exemplos e Auth DB. |
| `2026-1-AnatoQuizUp-Quiz-Service` | Dominio de quiz: questoes, alternativas, resolucoes, storage de imagens e Quiz DB. |
| `2026-1-AnatoQuizUp-AI` | Servico de IA reservado para semestres futuros. |
| `2026-1-AnatoQuizUp-Doc` | Documentacao do projeto em MkDocs. |

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

O Frontend usa `VITE_API_URL` apontando para o BFF. Features como `manage-questions` continuam chamando `/questoes`; a mudanca de destino interno e invisivel para o Web.

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

O BFF nao conhece regra de negocio. Ele valida JWT, filtra headers reservados, injeta `X-Internal-Token` e encaminha para o cliente HTTP correto.

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

O Backend/Auth nao deve conter modulo `question`, models de quiz no Prisma, nem configuracao de storage de imagens de questoes.

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

O Quiz-Service mantem IDs de usuarios como referencias externas (`criadoPorId`, `usuarioId`), sem FK para o banco do Backend/Auth.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criacao da visao de implementacao | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.1 | Inclusao do repositorio BFF e renomeacao `-API` para `-Backend` | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Inclusao do Quiz-Service e atualizacao das responsabilidades dos repositorios | Miguel Moreira |
