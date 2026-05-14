# Visão Geral da API

## Objetivo

Esta seção documenta os endpoints REST públicos do AnatoQuizUp. Do ponto de vista do consumidor, **a API pública é o BFF**. O Frontend chama apenas o BFF; o BFF preserva paths e contratos e encaminha internamente para Backend/Auth, Quiz-Service ou AI.

A API usa versionamento no caminho. Todos os endpoints de negócio partem do prefixo `/api/v1`. Quando uma página específica mostra `POST /autenticacao/login`, o caminho completo é `POST /api/v1/autenticacao/login`.

## Destinos internos

| Prefixo público | Destino interno | Observação |
|-----------------|-----------------|------------|
| `/api/v1/autenticacao/*` | Backend/Auth | Login, cadastro, refresh, senha e usuário atual |
| `/api/v1/admin/*` | Backend/Auth | Administração de usuários |
| `/api/v1/exemplos/*` | Backend/Auth | Módulo técnico mantido nesta etapa |
| `/api/v1/questoes/*` | Quiz-Service | Gestão de questões migrada do Backend |
| `/api/v1/ia/*` | AI Service futuro | 503 enquanto `AI_URL` estiver vazio |
| `/health` | BFF | Health check público do BFF |

## Execução local

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

Backend/Auth disponível em `http://localhost:3333`. Aceita chamadas `/api/*` apenas com `X-Internal-Token` válido.

### Quiz-Service (`2026-1-AnatoQuizUp-Quiz-Service`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY iguais aos do BFF/Backend
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Quiz-Service disponível em `http://localhost:3334`. Aceita chamadas `/api/*` apenas com `X-Internal-Token` válido e valida o JWT para rotas de questões.

### BFF (`2026-1-AnatoQuizUp-BFF`)

```bash
cp .env.example .env
# Preencher BACKEND_URL, QUIZ_SERVICE_URL, INTERNAL_TOKEN e JWT_SECRET_KEY
npm ci
npm run dev
```

BFF disponível em `http://localhost:4000`. Este é o endereço usado pelo Frontend.

### Caminho público

```text
http://localhost:4000/api/v1
```

## Autenticação

Endpoints protegidos exigem `Authorization: Bearer <accessToken>`. O access token é assinado pelo Backend/Auth e carrega claims como `sub`, `papel` e `status`.

O BFF valida assinatura e expiração antes de repassar. Backend/Auth e Quiz-Service também validam o token localmente nos fluxos protegidos. Os headers `X-User-*` enviados pelo BFF são auxiliares e não substituem o JWT como fonte de autorização.

## Contratos de resposta

### Sucesso

```json
{
  "mensagem": "Mensagem de sucesso.",
  "dados": {}
}
```

### Paginação

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

## Endpoints públicos

| Método | Endpoint | Documentação |
|--------|----------|--------------|
| GET | `/health` | Esta página |
| POST | `/autenticacao/login` | [Autenticação](./autenticacao.md#post-autenticacaologin) |
| POST | `/autenticacao/atualizar-token` | [Autenticação](./autenticacao.md#post-autenticacaoatualizar-token) |
| POST | `/autenticacao/cadastro` | [Alunos](./alunos.md#post-autenticacaocadastro) |
| POST | `/autenticacao/recuperar-senha` | [Autenticação](./autenticacao.md#post-autenticacaorecuperar-senha) |
| POST | `/autenticacao/redefinir-senha` | [Autenticação](./autenticacao.md#post-autenticacaoredefinir-senha) |
| GET | `/autenticacao/alunos/nickname-disponivel` | [Alunos](./alunos.md#get-autenticacaoalunosnickname-disponivel) |
| GET | `/autenticacao/alunos/email-disponivel` | [Alunos](./alunos.md#get-autenticacaoalunosemail-disponivel) |
| GET | `/autenticacao/alunos/nacionalidades` | [Alunos](./alunos.md#get-autenticacaoalunosnacionalidades) |
| GET | `/autenticacao/alunos/opcoes-academicas` | [Alunos](./alunos.md#get-autenticacaoalunosopcoes-academicas) |
| GET | `/autenticacao/alunos/localidades/estados` | [Localidades](./localidades.md#get-autenticacaoalunoslocalidadesestados) |
| GET | `/autenticacao/alunos/localidades/estados/:uf/cidades` | [Localidades](./localidades.md#get-autenticacaoalunoslocalidadesestadosufcidades) |

## Endpoints autenticados

| Método | Endpoint | Destino |
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

As rotas de `/questoes` documentam o contrato já usado pelo Web para gestão de banco de questões. Rotas futuras de jogo/resolução por aluno devem ser especificadas separadamente quando forem implementadas.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
| 05/05/2026 | 1.1 | Atualização para refletir o BFF como porta de entrada pública | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualização para roteamento Backend/Auth, Quiz-Service e AI futuro | Miguel Moreira |
| 13/05/2026 | 2.1 | Restauração dos acentos do português brasileiro | Miguel Moreira |
