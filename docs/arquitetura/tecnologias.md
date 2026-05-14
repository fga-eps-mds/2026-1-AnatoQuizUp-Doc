# Tecnologias

## Componentes e suas tecnologias

### Frontend

Unico responsavel pelas interacoes com o usuario.

- Realiza chamadas ao **BFF** via API REST.
- Nao acessa Backend/Auth, Quiz-Service, AI ou bancos diretamente.
- Gerencia estado da interface e interacoes do usuario.

Tecnologias principais: React, Vite e Tailwind CSS.

---

### BFF (Node.js)

Camada intermediaria entre o Frontend e os servicos de dominio. Atua como proxy 100% orquestracao, sem regra de negocio e sem persistencia propria.

- Recebe todas as chamadas do Frontend.
- Valida JWT na borda.
- Injeta `X-Internal-Token` e headers auxiliares (`X-User-Id`, `X-User-Papel`, `X-User-Status`).
- Roteia `/api/v1/autenticacao/*`, `/api/v1/admin/*` e `/api/v1/exemplos/*` para Backend/Auth.
- Roteia `/api/v1/questoes/*` para Quiz-Service.
- Roteia `/api/v1/ia/*` para AI quando o servico existir.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Axios, Pino, Helmet, CORS, jsonwebtoken, Zod, Jest e ESLint.

---

### Backend/Auth (Node.js)

Servico privado responsavel por autenticacao, identidade, administracao de usuarios e persistencia do Auth DB.

- Gerencia cadastro, login, refresh token, logout e recuperacao de senha.
- Gerencia usuarios e aprovacao de professores.
- Mantem o modulo `exemplo` como referencia tecnica atual.
- Nao possui mais regras, models ou storage de questoes.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Prisma, PostgreSQL, Pino, Helmet, CORS, bcryptjs, jsonwebtoken, Zod, Brevo, Jest e ESLint.

---

### Quiz-Service (Node.js)

Servico privado responsavel pelo dominio de quiz ja existente.

- Gerencia temas, questoes, alternativas e resolucoes.
- Mantem storage de imagens de questoes via MinIO/S3.
- Usa banco proprio (`Quiz DB`).
- Valida JWT localmente com `JWT_SECRET_KEY`.
- Autoriza fluxos de gestao por `papel` (`PROFESSOR` ou `ADMINISTRADOR`) e `status`.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Prisma, PostgreSQL, MinIO/S3, Pino, Helmet, CORS, jsonwebtoken, Zod, Jest, SonarCloud e ESLint.

---

### AI Service (reservado)

Servico reservado para modulos futuros de inteligencia artificial, como geracao de questoes, imagens anatomicas e chatbot educacional. Permanece sem feature nesta etapa, mas a arquitetura ja reserva banco proprio futuro.

---

### Bancos de Dados

Cada servico de dominio possui banco proprio.

| Banco | Dono | Dados |
|-------|------|-------|
| Auth DB | Backend/Auth | Usuarios, refresh tokens, tokens de redefinicao e dados administrativos |
| Quiz DB | Quiz-Service | Temas, questoes, alternativas, resolucoes e metadados de quiz |
| AI DB futuro | AI Service | Embeddings, conversas, prompts e metadados de IA quando existir |

---

## Referencias

> React. Disponivel em: <https://react.dev>. Acesso em: 13 abr. 2026.

> Vite Docs. Disponivel em: <https://vite.dev/guide/>. Acesso em: 13 abr. 2026.

> O que e Tailwind CSS. Disponivel em: <https://tailwindcss.com.br/guia-tailwind/o-que-e-tailwind-css>. Acesso em: 13 abr. 2026.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criacao do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) |
| 13/04/2026 | 1.1 | Adicionando tecnologias do frontend | [Joao Vitor](https://github.com/Joa0V) |
| 26/04/2026 | 1.2 | Reorganizacao da secao de arquitetura | [Ana Catarina](https://github.com/an4catarina) |
| 05/05/2026 | 1.3 | Inclusao do BFF e do AI Service na stack | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualizacao para Backend/Auth, Quiz-Service e bancos por servico | Miguel Moreira |
