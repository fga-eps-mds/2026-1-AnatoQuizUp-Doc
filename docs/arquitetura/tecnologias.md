# Tecnologias

## Componentes e suas tecnologias

### Frontend

Único responsável pelas interações com o usuário.

- Realiza chamadas ao **BFF** via API REST.
- Não acessa Backend/Auth, Quiz-Service, AI ou bancos diretamente.
- Gerencia estado da interface e interações do usuário.

Tecnologias principais: React, Vite e Tailwind CSS.

---

### BFF (Node.js)

Camada intermediária entre o Frontend e os serviços de domínio. Atua como proxy 100% orquestração, sem regra de negócio e sem persistência própria.

- Recebe todas as chamadas do Frontend.
- Valida JWT na borda.
- Injeta `X-Internal-Token` e headers auxiliares (`X-User-Id`, `X-User-Papel`, `X-User-Status`).
- Roteia `/api/v1/autenticacao/*`, `/api/v1/admin/*` e `/api/v1/exemplos/*` para Backend/Auth.
- Roteia `/api/v1/questoes/*` para Quiz-Service.
- Roteia `/api/v1/ia/*` para AI quando o serviço existir.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Axios, Pino, Helmet, CORS, jsonwebtoken, Zod, Jest e ESLint.

---

### Backend/Auth (Node.js)

Serviço privado responsável por autenticação, identidade, administração de usuários e persistência do Auth DB.

- Gerencia cadastro, login, refresh token, logout e recuperação de senha.
- Gerencia usuários e aprovação de professores.
- Mantém o módulo `exemplo` como referência técnica atual.
- Não possui mais regras, models ou storage de questões.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Prisma, PostgreSQL, Pino, Helmet, CORS, bcryptjs, jsonwebtoken, Zod, Brevo, Jest e ESLint.

---

### Quiz-Service (Node.js)

Serviço privado responsável pelo domínio de quiz já existente.

- Gerencia temas, questões, alternativas e resoluções.
- Mantém storage de imagens de questões via MinIO/S3.
- Usa banco próprio (`Quiz DB`).
- Valida JWT localmente com `JWT_SECRET_KEY`.
- Autoriza fluxos de gestão por `papel` (`PROFESSOR` ou `ADMINISTRADOR`) e `status`.

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Prisma, PostgreSQL, MinIO/S3, Pino, Helmet, CORS, jsonwebtoken, Zod, Jest, SonarCloud e ESLint.

---

### AI Service (reservado)

Serviço reservado para módulos futuros de inteligência artificial, como geração de questões, imagens anatômicas e chatbot educacional. Permanece sem feature nesta etapa, mas a arquitetura já reserva banco próprio futuro.

---

### Bancos de Dados

Cada serviço de domínio possui banco próprio.

| Banco | Dono | Dados |
|-------|------|-------|
| Auth DB | Backend/Auth | Usuários, refresh tokens, tokens de redefinição e dados administrativos |
| Quiz DB | Quiz-Service | Temas, questões, alternativas, resoluções e metadados de quiz |
| AI DB futuro | AI Service | Embeddings, conversas, prompts e metadados de IA quando existir |

---

## Referências

> React. Disponível em: <https://react.dev>. Acesso em: 13 abr. 2026.

> Vite Docs. Disponível em: <https://vite.dev/guide/>. Acesso em: 13 abr. 2026.

> O que é Tailwind CSS. Disponível em: <https://tailwindcss.com.br/guia-tailwind/o-que-e-tailwind-css>. Acesso em: 13 abr. 2026.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criação do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) |
| 13/04/2026 | 1.1 | Adicionando tecnologias do frontend | [João Vitor](https://github.com/Joa0V) |
| 26/04/2026 | 1.2 | Reorganização da seção de arquitetura | [Ana Catarina](https://github.com/an4catarina) |
| 05/05/2026 | 1.3 | Inclusão do BFF e do AI Service na stack | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualização para Backend/Auth, Quiz-Service e bancos por serviço | Miguel Moreira |
| 13/05/2026 | 2.1 | Restauração dos acentos do português brasileiro | Miguel Moreira |
