# Visao Geral da API

## Objetivo

Esta secao documenta os endpoints REST publicos do AnatoQuizUp. Do ponto de vista do consumidor, **a API publica e o BFF**. O Frontend chama apenas o BFF; o BFF preserva paths e contratos e encaminha internamente para Backend/Auth, Quiz-Service ou AI.

A API usa versionamento no caminho. Todos os endpoints de negocio partem do prefixo `/api/v1`. Quando uma pagina especifica mostra `POST /autenticacao/login`, o caminho completo e `POST /api/v1/autenticacao/login`.

## Destinos internos

| Prefixo publico | Destino interno | Observacao |
|-----------------|-----------------|------------|
| `/api/v1/autenticacao/*` | Backend/Auth | Login, cadastro, refresh, senha e usuario atual |
| `/api/v1/admin/*` | Backend/Auth | Administracao de usuarios |
| `/api/v1/exemplos/*` | Backend/Auth | Modulo tecnico mantido nesta etapa |
| `/api/v1/questoes/*` | Quiz-Service | Gestao de questoes migrada do Backend |
| `/api/v1/ia/*` | AI Service futuro | 503 enquanto `AI_URL` estiver vazio |
| `/health` | BFF | Health check publico do BFF |

## Execucao local

Localmente, sobem quatro processos principais: Backend/Auth, Quiz-Service, BFF e Frontend.

### Backend/Auth (`2026-1-AnatoQuizUp-Backend`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend/Auth disponivel em `http://localhost:3333`. Aceita chamadas `/api/*` apenas com `X-Internal-Token` valido.

### Quiz-Service (`2026-1-AnatoQuizUp-Quiz-Service`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY iguais aos do BFF/Backend
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Quiz-Service disponivel em `http://localhost:3334`. Aceita chamadas `/api/*` apenas com `X-Internal-Token` valido e valida o JWT para rotas de questoes.

### BFF (`2026-1-AnatoQuizUp-BFF`)

```bash
cp .env.example .env
# Preencher BACKEND_URL, QUIZ_SERVICE_URL, INTERNAL_TOKEN e JWT_SECRET_KEY
npm ci
npm run dev
```

BFF disponivel em `http://localhost:4000`. Este e o endereco usado pelo Frontend.

### Caminho publico

```text
http://localhost:4000/api/v1
```

## Autenticacao

Endpoints protegidos exigem `Authorization: Bearer <accessToken>`. O access token e assinado pelo Backend/Auth e carrega claims como `sub`, `papel` e `status`.

O BFF valida assinatura e expiracao antes de repassar. Backend/Auth e Quiz-Service tambem validam o token localmente nos fluxos protegidos. Os headers `X-User-*` enviados pelo BFF sao auxiliares e nao substituem o JWT como fonte de autorizacao.

## Contratos de resposta

### Sucesso

```json
{
  "mensagem": "Mensagem de sucesso.",
  "dados": {}
}
```

### Paginacao

```json
{
  "dados": [],
  "metadados": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Erro

```json
{
  "erro": {
    "codigo": "ERRO_DE_VALIDACAO",
    "mensagem": "Mensagem do erro.",
    "detalhes": {}
  }
}
```

## Endpoints publicos

| Metodo | Endpoint | Documentacao |
|--------|----------|--------------|
| GET | `/health` | Esta pagina |
| POST | `/autenticacao/login` | [Autenticacao](./autenticacao.md#post-autenticacaologin) |
| POST | `/autenticacao/atualizar-token` | [Autenticacao](./autenticacao.md#post-autenticacaoatualizar-token) |
| POST | `/autenticacao/cadastro` | [Alunos](./alunos.md#post-autenticacaocadastro) |
| POST | `/autenticacao/recuperar-senha` | [Autenticacao](./autenticacao.md#post-autenticacaorecuperar-senha) |
| POST | `/autenticacao/redefinir-senha` | [Autenticacao](./autenticacao.md#post-autenticacaoredefinir-senha) |
| GET | `/autenticacao/alunos/nickname-disponivel` | [Alunos](./alunos.md#get-autenticacaoalunosnickname-disponivel) |
| GET | `/autenticacao/alunos/email-disponivel` | [Alunos](./alunos.md#get-autenticacaoalunosemail-disponivel) |
| GET | `/autenticacao/alunos/nacionalidades` | [Alunos](./alunos.md#get-autenticacaoalunosnacionalidades) |
| GET | `/autenticacao/alunos/opcoes-academicas` | [Alunos](./alunos.md#get-autenticacaoalunosopcoes-academicas) |
| GET | `/autenticacao/alunos/localidades/estados` | [Localidades](./localidades.md#get-autenticacaoalunoslocalidadesestados) |
| GET | `/autenticacao/alunos/localidades/estados/:uf/cidades` | [Localidades](./localidades.md#get-autenticacaoalunoslocalidadesestadosufcidades) |

## Endpoints autenticados

| Metodo | Endpoint | Destino |
|--------|----------|---------|
| GET | `/autenticacao/usuario-atual` | Backend/Auth |
| POST | `/autenticacao/sair` | Backend/Auth |
| GET | `/admin/usuarios` | Backend/Auth |
| GET | `/admin/usuarios/:id` | Backend/Auth |
| PATCH | `/admin/usuarios/:id/status` | Backend/Auth |
| POST | `/exemplos` | Backend/Auth |
| GET | `/exemplos` | Backend/Auth |
| GET | `/exemplos/:id` | Backend/Auth |
| GET | `/questoes` | Quiz-Service |
| GET | `/questoes/busca` | Quiz-Service |
| GET | `/questoes/:id` | Quiz-Service |
| POST | `/questoes` | Quiz-Service |
| PUT | `/questoes/:id` | Quiz-Service |
| DELETE | `/questoes/:id` | Quiz-Service |

As rotas de `/questoes` documentam o contrato ja usado pelo Web para gestao de banco de questoes. Rotas futuras de jogo/resolucao por aluno devem ser especificadas separadamente quando forem implementadas.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criacao da documentacao dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
| 05/05/2026 | 1.1 | Atualizacao para refletir o BFF como porta de entrada publica | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualizacao para roteamento Backend/Auth, Quiz-Service e AI futuro | Miguel Moreira |
