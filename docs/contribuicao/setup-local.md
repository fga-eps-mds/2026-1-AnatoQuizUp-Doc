# Setup Local — Rodando o AnatoQuizUp do Zero

> **Para quem:** qualquer dev novo no projeto, ou veterano que precisa montar a stack do zero numa máquina nova.
> **Objetivo:** sair de "repo recém-clonado" até "consigo logar no Web, listar questões e ver minhas turmas" em ~15 minutos.
> **Última atualização:** 2026-05-21.

---

## Pré-requisitos (uma vez por máquina)

- **Node.js 24+**: `nvm install 24` ou https://nodejs.org/
- **Docker Desktop** aberto (a baleia no canto da bandeja precisa estar verde).
- **Git** instalado.
- **GNU Make** (opcional, mas atalha vários comandos):
  - Windows: `choco install make` ou `scoop install make`
  - Mac: `brew install make`
  - Linux: já vem na maioria das distros.

---

## Topologia que você vai subir

São **3 containers Docker** + **4 processos Node** em **4 terminais**.

| # | Componente | Porta | Sobe como | Depende de |
|---|---|---|---|---|
| 1 | **Postgres do Usuario-Service** | 5432 | Docker (compose do Usuario-Service) | — |
| 2 | **Postgres do Quiz** | 5433 | Docker (compose do Quiz-Service) | — |
| 3 | **MinIO (API)** | 9000 | Docker (compose do Quiz-Service) | — |
| 4 | **MinIO (Console)** | 9001 | Docker (compose do Quiz-Service) | — |
| 5 | **Usuario-Service** | 3333 | `npm run dev` | Postgres 5432 |
| 6 | **Quiz-Service** | 3334 | `npm run dev` | Postgres 5433 + MinIO |
| 7 | **BFF** | 4000 | `npm run dev` | Usuario-Service + Quiz-Service |
| 8 | **Web** | 5173 | `npm run dev` | BFF |

---

## 1. Clonar os repos

Crie uma pasta-mãe e clone os 5 repos lado a lado:

```powershell
mkdir anatoquizup
cd anatoquizup

git clone https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Web.git
git clone https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-BFF.git
git clone https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Usuario-Service.git
git clone https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Quiz-Service.git
git clone https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Doc.git
```

---

## 2. Gerar segredos compartilhados

Os mesmos `INTERNAL_TOKEN` e `JWT_SECRET_KEY` precisam estar **idênticos** em **Usuario-Service, BFF e Quiz-Service** (senão eles não se conversam).

Gere uma vez e anote:

```powershell
node -e "console.log('INTERNAL_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Configurar cada repo

### 3.1. Usuario-Service (`2026-1-AnatoQuizUp-Usuario-Service`)

```powershell
cd 2026-1-AnatoQuizUp-Usuario-Service
Copy-Item .env.example .env
```

Preencha `.env`:

```dotenv
NODE_ENV=development
PORT=3333

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

LOG_LEVEL=info

JWT_SECRET_KEY=<seu-jwt-secret-do-passo-2>
JWT_REFRESH_SECRET_KEY=<outro-segredo-qualquer>
JWT_PASSWORD_REDEFINITION_SECRET_KEY=<outro-segredo-qualquer>

INTERNAL_TOKEN=<seu-internal-token-do-passo-2>

BREVO_API_KEY=dev-brevo-not-used
EMAIL_FROM=noreply@anatoquizup.local
FRONTEND_PROD_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:4000
```

Instale, suba banco, gere Prisma, migre e seed:

```powershell
docker compose up -d db
npm ci
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

> **Se você já tinha o banco antigo** (de antes da migração para Quiz-Service), o `prisma:migrate` vai detectar **drift** (`The migrations recorded in the database diverge from the local migrations directory`). Isso é esperado porque as migrations antigas foram consolidadas numa migration única `init_auth`. Solução:
>
> ```powershell
> npx prisma migrate reset --force
> ```
>
> Esse comando dropa o schema, re-aplica a migration `init_auth` do zero e roda o seed automaticamente (configurado em `prisma.config.ts`). Como o time autorizou reset de bancos locais (PRD §6.3), pode rodar sem medo.

> **Anote a senha do admin** que aparece no log do seed — você vai precisar dela pra logar.

### 3.2. Quiz-Service (`2026-1-AnatoQuizUp-Quiz-Service`)

```powershell
cd ../2026-1-AnatoQuizUp-Quiz-Service
Copy-Item .env.example .env
```

Preencha `.env` (use os **mesmos** `JWT_SECRET_KEY` e `INTERNAL_TOKEN` do Usuario-Service):

```dotenv
NODE_ENV=development
PORT=3334

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=anatoquizup_quiz
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/anatoquizup_quiz?schema=public"

LOG_LEVEL=info

JWT_SECRET_KEY=<mesmo-do-backend>
INTERNAL_TOKEN=<mesmo-do-backend>

CORS_ORIGINS=http://localhost:5173,http://localhost:4000

MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_ENDPOINT=http://localhost
MINIO_API_PORT=9000
MINIO_CONSOLE_PORT=9001
```

Instale, suba banco + MinIO, gere Prisma, migre:

```powershell
docker compose up -d
npm ci
npm run prisma:generate
npm run prisma:migrate
```

> O banco do Quiz-Service é **novo** (a primeira migration `init_quiz` é a única que existe). Não tem drift — `prisma:migrate` funciona direto, sem precisar de `reset`.

### 3.3. BFF (`2026-1-AnatoQuizUp-BFF`)

```powershell
cd ../2026-1-AnatoQuizUp-BFF
Copy-Item .env.example .env
```

Preencha `.env`:

```dotenv
NODE_ENV=development
PORT=4000
LOG_LEVEL=info

BACKEND_URL=http://localhost:3333
QUIZ_SERVICE_URL=http://localhost:3334
AI_URL=

JWT_SECRET_KEY=<mesmo-do-backend>
INTERNAL_TOKEN=<mesmo-do-backend>

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
REQUEST_TIMEOUT_MS=15000
```

Instale:

```powershell
npm ci
```

### 3.4. Web (`2026-1-AnatoQuizUp-Web`)

```powershell
cd ../2026-1-AnatoQuizUp-Web
Copy-Item .env.example .env
```

`.env`:

```dotenv
VITE_API_URL=http://localhost:4000/api/v1
VITE_USE_MOCKS=false
```

Instale:

```powershell
npm ci
```

---

## 4. No dia a dia — 4 terminais

| Terminal | Pasta | Comando |
|---|---|---|
| 1️⃣ Usuario-Service | `2026-1-AnatoQuizUp-Usuario-Service` | `docker compose up -d db ; npm run dev` |
| 2️⃣ Quiz-Service | `2026-1-AnatoQuizUp-Quiz-Service` | `docker compose up -d ; npm run dev` |
| 3️⃣ BFF | `2026-1-AnatoQuizUp-BFF` | `npm run dev` |
| 4️⃣ Web | `2026-1-AnatoQuizUp-Web` | `npm run dev` |

Espere ver, em cada terminal:

- **Usuario-Service** (terminal 1): `Servidor em execucao { port: 3333 }`
- **Quiz-Service** (terminal 2): `Servidor em execucao { port: 3334 }`
- **BFF** (terminal 3): `BFF em execucao { port: 4000 }`
- **Web** (terminal 4): `Local: http://localhost:5173`

Acesse **http://localhost:5173** no navegador.

### Com Make

Se tiver `make`, fica mais curto. Em cada pasta:

```powershell
make dev          # sobe o serviço (já gerencia Docker quando aplicável)
make test         # roda testes
make lint         # roda ESLint
make test-ci      # testes com coverage (gate 85%)
```

---

## 5. Smoke tests — validar que está tudo conectado

### Health checks (cada serviço vivo)

```powershell
curl http://localhost:4000/health   # BFF
curl http://localhost:3333/health   # Usuario-Service
curl http://localhost:3334/health   # Quiz-Service
```

Todos devem retornar `{"mensagem":"...","dados":{"status":"ok",...}}`.

### Usuario-Service rejeita acesso direto sem `X-Internal-Token`

```powershell
curl http://localhost:3333/api/v1/autenticacao/login -X POST `
  -H "Content-Type: application/json" -d '{}'
```

Esperado: **403** `"Token interno ausente. Acesso permitido somente via BFF."`

### Quiz-Service rejeita acesso direto

```powershell
curl http://localhost:3334/api/v1/questoes
```

Esperado: **403**.

### Login pelo BFF

```powershell
curl http://localhost:4000/api/v1/autenticacao/login -X POST `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"admin@anatoquizup.com\",\"senha\":\"<senha-do-seed>\"}"
```

Esperado: **200** com `accessToken`, `refreshToken`, `usuario`.

### Listar questões pelo BFF (passa pelo Quiz-Service)

```powershell
$token = "<copie-o-accessToken-acima>"

curl http://localhost:4000/api/v1/questoes `
  -H "Authorization: Bearer $token"
```

Esperado: **200** com lista paginada (provavelmente vazia se o seed não criou questões).

> O usuário precisa ter papel `PROFESSOR` ou `ADMINISTRADOR` para acessar `/questoes`.

### Listar turmas pelo BFF (passa pelo Quiz-Service)

```powershell
curl http://localhost:4000/api/v1/turmas `
  -H "Authorization: Bearer $token"
```

Esperado: **200** com lista.

> Comportamento por papel (resolvido no Quiz-Service):
>
> - **ALUNO**: vê apenas as turmas em que está vinculado e que estão `status=ATIVA`. Filtro `?status=` é rejeitado com **400** para aluno.
> - **PROFESSOR**: vê apenas turmas que ele criou.
> - **ADMINISTRADOR**: vê todas as turmas.

### Buscar usuário público pelo BFF (passa pelo Usuario-Service)

```powershell
curl http://localhost:4000/api/v1/usuarios/<id-do-usuario> `
  -H "Authorization: Bearer $token"
```

Esperado: **200** com payload mínimo `{ id, nome, papel }`. Acessível a qualquer papel autenticado. É a rota usada pelo Web para resolver o nome do professor responsável na tela de detalhe da turma do aluno.

### Pelo navegador

1. Abra `http://localhost:5173`.
2. F12 → aba Network.
3. Faça login.
4. Confirme: as requests vão para `localhost:4000`, **nunca** para `:3333` ou `:3334`. ✅

---

## 6. Como rodar testes e lint

Em cada repo:

```powershell
npm run lint                            # ESLint
npm test                                # Jest sem coverage (rápido)
npm test -- --coverage --runInBand      # com gate de 85%
```

Ou com Make:

```powershell
make lint
make test
make test-ci
```

> O gate de cobertura mínima de **85%** é bloqueante no CI (decisão DP08).

---

## 7. Troubleshooting

### Erros comuns no setup

| Sintoma | Causa | Solução |
|---|---|---|
| `Missing required environment variable: DATABASE_URL` (Prisma) | Não criou `.env` | `Copy-Item .env.example .env` e preencher |
| Container Postgres em loop de `Restarting` | `POSTGRES_PASSWORD` vazio no `.env` | Preencher + `docker compose down -v ; docker compose up -d` |
| `P1001: Can't reach database server at localhost:5432` | Banco ainda inicializando ou caiu | `docker ps`; aguarde 5–10s após `up -d`; veja `docker logs anatoquizup-postgres` |
| `P3006: Migration <nome> failed to apply cleanly to the shadow database. ERROR: syntax error at or near "﻿"` | Arquivo `migration.sql` ou `migration_lock.toml` foi salvo com **BOM UTF-8** (3 bytes `EF BB BF` no início). Costuma acontecer quando o arquivo foi gerado via PowerShell sem `-Encoding utf8NoBOM` | Remover BOM dos arquivos `.sql`/`.toml` da pasta de migrations. Veja [snippet abaixo](#detectar-e-remover-bom-utf-8) |
| `Drift detected` / `The migrations recorded in the database diverge from the local migrations directory` no **Usuario-Service** | Banco tem schema antigo gravado mas as migrations locais foram consolidadas | `npx prisma migrate reset --force` no Usuario-Service. Não acontece no Quiz-Service (banco novo) |
| `Cannot find module '@aws-sdk/client-s3'` no **Usuario-Service** ao rodar testes | Arquivos órfãos `src/config/storage.ts` e `tests/unit/config/storage.test.ts` (esquecidos na migração para Quiz-Service) | Remover esses 2 arquivos do Usuario-Service |
| Porta 5432 ou 5433 já em uso | Outro Postgres rodando | `docker ps` e pare o outro container, ou mude a porta no compose |

### Erros entre serviços

| Sintoma | Causa | Solução |
|---|---|---|
| BFF → Usuario-Service: **403 `Token interno invalido`** | `INTERNAL_TOKEN` diverge entre `.env`s | Garantir mesmo valor nos 3 `.env`s (Usuario-Service, BFF, Quiz-Service) |
| Login funciona, mas chamadas seguintes dão **401** | `JWT_SECRET_KEY` diverge | Mesmo valor nos 3 `.env`s |
| BFF retorna **502 `ERRO_DOWNSTREAM`** em `/questoes` | Quiz-Service não está rodando | Subir o terminal 2 (`npm run dev` no Quiz-Service) |
| BFF retorna **502** em `/autenticacao` | Usuario-Service não está rodando | Subir o terminal 1 |
| `/api/v1/ia/*` retorna **503 `IA_INDISPONIVEL`** | Esperado | AI Service ainda é placeholder; rotas existem mas serviço vazio |
| **CORS bloqueando** `localhost:5173` | `CORS_ORIGINS` do BFF não inclui o front | Adicionar `http://localhost:5173` no `.env` do BFF |

### Erros de Docker / MinIO

| Sintoma | Causa | Solução |
|---|---|---|
| `docker compose: command not found` | Docker Desktop não está aberto/instalado | Abrir o Docker Desktop e aguardar inicialização |
| MinIO não sobe / "Access denied" | `MINIO_ROOT_USER`/`PASSWORD` vazios | Preencher no `.env` do Quiz-Service + `docker compose down -v ; up -d` |
| Não consigo acessar o Console do MinIO | Não sei a senha | Use as variáveis `MINIO_ROOT_USER`/`MINIO_ROOT_PASSWORD` do `.env` para logar em http://localhost:9001 |

### Detectar e remover BOM UTF-8

Detectar arquivos com BOM em todo um repo (cole no terminal dentro do repo):

```powershell
Get-ChildItem -Recurse -Include *.sql,*.prisma,*.toml,*.json,*.ts,*.tsx |
  Where-Object { $_.FullName -notmatch 'node_modules|dist|coverage' } |
  ForEach-Object {
    $b = [System.IO.File]::ReadAllBytes($_.FullName)
    if ($b.Length -ge 3 -and $b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
      $_.FullName
    }
  }
```

Remover BOM de um arquivo específico:

```powershell
$path = "caminho\para\arquivo.sql"
$b = [System.IO.File]::ReadAllBytes($path)
if ($b[0] -eq 0xEF -and $b[1] -eq 0xBB -and $b[2] -eq 0xBF) {
  [System.IO.File]::WriteAllBytes($path, $b[3..($b.Length - 1)])
  "BOM removido."
}
```

Para **prevenir** que isso aconteça novamente ao gerar arquivos via PowerShell:

```powershell
# PS 7+
"conteudo" | Out-File arquivo.sql -Encoding utf8NoBOM

# PS 5.1
[System.IO.File]::WriteAllText("arquivo.sql", "conteudo", (New-Object System.Text.UTF8Encoding $false))
```

No VS Code: confirme no canto inferior direito que o encoding é `UTF-8` (sem "with BOM"). Se aparecer "UTF-8 with BOM", clique e troque para "UTF-8".

### Comandos úteis de diagnóstico

```powershell
# Ver todos os containers do projeto
docker ps

# Logs do Postgres do Usuario-Service
docker logs anatoquizup-postgres --tail 30

# Logs do Postgres do Quiz
docker logs anatoquizup-quiz-postgres --tail 30

# Logs do MinIO
docker logs anatoquizup-quiz-minio --tail 30

# Reset do banco mantendo o container (recomendado em dev quando há drift)
# Apaga as tabelas, re-aplica migrations e roda seed automaticamente.
cd 2026-1-AnatoQuizUp-Usuario-Service
npx prisma migrate reset --force

cd ../2026-1-AnatoQuizUp-Quiz-Service
npx prisma migrate reset --force

# Reset NUCLEAR — apaga o volume Docker (perde dados E destrói o container).
# Use somente quando o reset acima não resolver.
cd 2026-1-AnatoQuizUp-Usuario-Service
docker compose down -v
docker compose up -d db
# aguardar 5s
npm run prisma:migrate
npm run prisma:seed

cd ../2026-1-AnatoQuizUp-Quiz-Service
docker compose down -v
docker compose up -d
# aguardar 5s
npm run prisma:migrate

# Inspecionar dados via Prisma Studio (interface web)
npm run prisma:studio   # roda em http://localhost:5555
```

---

## 8. Ordem de subir e derrubar

**Subir** (de baixo pra cima):

1. Postgres Usuario-Service (compose do terminal 1).
2. Postgres Quiz + MinIO (compose do terminal 2).
3. Usuario-Service (terminal 1, depois do banco).
4. Quiz-Service (terminal 2, depois do banco e do MinIO).
5. BFF (terminal 3).
6. Web (terminal 4).

**Derrubar**:

- Em cada terminal Node: `Ctrl + C`.
- Para parar os containers Docker:

```powershell
cd 2026-1-AnatoQuizUp-Usuario-Service ; docker compose down
cd ../2026-1-AnatoQuizUp-Quiz-Service ; docker compose down
```

> `down -v` apaga os volumes (perde os dados). `down` (sem `-v`) só para os containers.

---

## 9. Documentos relacionados

- [Visão Geral da Arquitetura](../arquitetura/visao_geral.md) — diagrama e responsabilidades de cada serviço.
- [Tecnologias](../arquitetura/tecnologias.md) — stack adotada por componente.
- [Endpoints e Contratos](../arquitetura/api/visao-geral.md) — roteamento público e contratos da API.
- [Política de Branches](politica_branchs.md) — Git Flow do projeto.
- [Política de Commits](politica_commits.md) — Conventional Commits.

---

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 2026-05-13 | 1.0 | Criação do guia consolidado de setup local para os 5 repos (Web, BFF, Backend, Quiz-Service, AI) com 4 processos + 3 containers, smoke tests e troubleshooting | Miguel Moreira |
| 2026-05-21 | 1.1 | Adiciona smoke tests de `/turmas` (com regras de acesso por papel) e `/usuarios/:id` no fluxo do aluno; remove resíduo do título e atualiza referências documentais | Miguel Moreira |
