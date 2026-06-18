# Visão Geral da API

## Objetivo

Esta seção documenta os endpoints REST públicos do AnatoQuizUp. Do ponto de vista do consumidor, **a API pública é o BFF**. O Frontend chama apenas o BFF; o BFF preserva paths e contratos e encaminha internamente para Usuario-Service, Quiz-Service ou AI.

A API usa versionamento no caminho. Todos os endpoints de negócio partem do prefixo `/api/v1`. Quando uma página específica mostra `POST /autenticacao/login`, o caminho completo é `POST /api/v1/autenticacao/login`.

## Destinos internos

| Prefixo público | Destino interno | Observação |
|-----------------|-----------------|------------|
| `/api/v1/autenticacao/*` | Usuario-Service | Login, cadastro, refresh, senha e usuário atual |
| `/api/v1/admin/*` | Usuario-Service | Administração de usuários |
| `/api/v1/exemplos/*` | Usuario-Service | Módulo técnico didático |
| `/api/v1/usuarios/*` | Usuario-Service | Busca de usuários (em lote, paginada de alunos, ou pública por id) |
| `/api/v1/quiz/*` | Quiz-Service | Fluxos de jogo, moedas, histórico e respostas do quiz |
| `/api/v1/loja/*` | Quiz-Service | Loja virtual: catálogo, inventário e compra de itens com moedas |
| `/api/v1/questoes/*` | Quiz-Service | Gestão de questões |
| `/api/v1/turmas/*` | Quiz-Service | Turmas e vínculo de alunos; rotas de leitura abertas a ALUNO com filtro por papel |
| `/api/v1/lista/*` | Quiz-Service | Listas de estudo e compartilhamento entre turmas |
| `/api/v1/amizade/*` | Usuario-Service | Amizades entre alunos (convites, busca e visibilidade) |
| `/api/v1/dashboardAluno` | Quiz-Service | Desempenho consolidado do aluno |
| `/api/v1/turmasDashboard/*` | Quiz-Service | Desempenho macro e individual da turma |
| `/api/v1/ia/*` | AI Service futuro | 503 enquanto `AI_URL` estiver vazio |
| `/health` | BFF | Health check público do BFF |

## Execução local

Localmente, sobem quatro processos principais: Usuario-Service, Quiz-Service, BFF e Frontend.

### Usuario-Service (`2026-1-AnatoQuizUp-Usuario-Service`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY
npm run db:up
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Usuario-Service disponível em `http://localhost:3333`. Aceita chamadas `/api/*` apenas com `X-Internal-Token` válido.

### Quiz-Service (`2026-1-AnatoQuizUp-Quiz-Service`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY iguais aos do BFF/Usuario-Service
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

Endpoints protegidos exigem `Authorization: Bearer <accessToken>`. O access token é assinado pelo Usuario-Service e carrega claims como `sub`, `papel` e `status`.

O BFF valida assinatura e expiração antes de repassar. Usuario-Service e Quiz-Service também validam o token localmente nos fluxos protegidos. Os headers `X-User-*` enviados pelo BFF são auxiliares e não substituem o JWT como fonte de autorização.

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

| Método | Endpoint | Destino | Acesso |
|--------|----------|---------|--------|
| GET | `/autenticacao/usuario-atual` | Usuario-Service | Qualquer papel |
| POST | `/autenticacao/sair` | Usuario-Service | Qualquer papel |
| GET | `/admin/usuarios` | Usuario-Service | ADMINISTRADOR |
| GET | `/admin/usuarios/:id` | Usuario-Service | ADMINISTRADOR |
| PATCH | `/admin/usuarios/:id/status` | Usuario-Service | ADMINISTRADOR |
| GET | `/usuarios` (com `?ids=`) | Usuario-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/usuarios/alunos` | Usuario-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/usuarios/:id` | Usuario-Service | Qualquer papel (payload mínimo `{id, nome, papel}`) |
| POST | `/exemplos` | Usuario-Service | Qualquer papel |
| GET | `/exemplos` | Usuario-Service | Qualquer papel |
| GET | `/exemplos/:id` | Usuario-Service | Qualquer papel |
| GET | `/questoes` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/questoes/busca` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/questoes/:id` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| POST | `/questoes` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| PUT | `/questoes/:id` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| DELETE | `/questoes/:id` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/turmas` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR (filtro por papel) |
| GET | `/turmas/:id` | Quiz-Service | ALUNO (se vinculado e ATIVA) / PROFESSOR criador / ADMINISTRADOR |
| POST | `/turmas` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| PATCH | `/turmas/:id` | Quiz-Service | PROFESSOR criador / ADMINISTRADOR |
| DELETE | `/turmas/:id` | Quiz-Service | PROFESSOR criador / ADMINISTRADOR |
| GET | `/turmas/:id/alunos` | Quiz-Service | PROFESSOR criador / ADMINISTRADOR |
| POST | `/turmas/:id/alunos` | Quiz-Service | PROFESSOR criador / ADMINISTRADOR |
| DELETE | `/turmas/:id/alunos/:alunoId` | Quiz-Service | PROFESSOR criador / ADMINISTRADOR |
| GET | `/quiz` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| POST | `/quiz/responder` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/quiz/moedas` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/quiz/quantidade_por_tema` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/quiz/historico` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/loja/catalogo` | Quiz-Service | ALUNO |
| GET | `/loja/meu-inventario` | Quiz-Service | ALUNO |
| POST | `/loja/comprar` | Quiz-Service | ALUNO |
| POST | `/lista` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/lista` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/lista/turma/:turmaId` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/lista/:id` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| DELETE | `/lista/:id` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/lista/:id/pdf` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| PATCH | `/lista/:id` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| POST | `/lista/:id/questoes` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| PATCH | `/lista/:id/questoes/ordem` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| DELETE | `/lista/:id/questoes/:questaoId` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| POST | `/lista/:id/turmas` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| DELETE | `/lista/:id/turmas/:turmaId` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/lista/:id/estatisticas/turma/:turmaId` | Quiz-Service | ALUNO / PROFESSOR / ADMINISTRADOR |
| GET | `/amizade` | Usuario-Service | ALUNO / ADMINISTRADOR |
| GET | `/amizade/busca` | Usuario-Service | ALUNO / ADMINISTRADOR |
| POST | `/amizade` | Usuario-Service | ALUNO / ADMINISTRADOR |
| GET | `/amizade/convites/recebidos` | Usuario-Service | ALUNO / ADMINISTRADOR |
| GET | `/amizade/convites/enviados` | Usuario-Service | ALUNO / ADMINISTRADOR |
| PATCH | `/amizade/aceitar` | Usuario-Service | ALUNO / ADMINISTRADOR |
| PATCH | `/amizade/recusar` | Usuario-Service | ALUNO / ADMINISTRADOR |
| DELETE | `/amizade` | Usuario-Service | ALUNO / ADMINISTRADOR |
| PATCH | `/amizade/visibilidade` | Usuario-Service | ALUNO / ADMINISTRADOR |
| GET | `/dashboardAluno` | Quiz-Service | ALUNO |
| GET | `/turmasDashboard/:id/macro` | Quiz-Service | PROFESSOR / ADMINISTRADOR |
| GET | `/turmasDashboard/:id/individual` | Quiz-Service | PROFESSOR / ADMINISTRADOR |

- A documentação detalhada está nas páginas de cada recurso: [Quiz](quiz.md), [Questões](questoes.md), [Turmas](turmas.md), [Listas](lista.md), [Loja Virtual](loja-virtual.md), [Amizade](amizade.md), [Dashboard do Aluno](dashboard-aluno.md) e [Dashboard da Turma](dashboard-turma.md).
- **`/usuarios/:id`** é a rota usada pelo Web para resolver o nome do professor responsável na tela de detalhe da turma do aluno. Payload mínimo (sem email, senha, ou dados pessoais).
- **`/turmas` para ALUNO** sempre filtra por `status=ATIVA` e exibe somente turmas em que o aluno está vinculado. Query `?status=` é rejeitada com **400**.
- **`/turmas/:id`** para aluno sem vínculo retorna **404** (intencional — não vaza existência).
- **`/loja/*`** concentra a Loja Virtual. O catálogo lista itens cosméticos ativos disponíveis para compra (ícones de perfil, molduras, avatares, títulos e planos de fundo); o inventário lista itens já adquiridos pelo aluno; e a compra debita moedas da carteira, registra transação com `COMPRA_ITEM` e impede compra duplicada do mesmo item.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
| 05/05/2026 | 1.1 | Atualização para refletir o BFF como porta de entrada pública | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualização para roteamento Usuario-Service, Quiz-Service e AI futuro | Miguel Moreira |
| 13/05/2026 | 2.1 | Restauração dos acentos do português brasileiro | Miguel Moreira |
| 21/05/2026 | 2.2 | Inclui endpoints de `/usuarios/*` e `/turmas/*` com regras de acesso por papel | Miguel Moreira |
| 25/05/2026 | 2.3 | Inclui endpoints de `/quiz/*`, `/questoes/*` e `/listas/*`| [Caio Santos](https://github.com/caiobsantos) |
| 02/06/2026 | 2.4 | Inclui os grupos `/amizade/*`, `/dashboardAluno` e `/turmasDashboard/*` e links para as páginas detalhadas | [Miguel Moreira](https://github.com/EhOMiguel) |
| 16/06/2026 | 2.5 | Inclui endpoints da loja virtual| [Caio Santos](https://github.com/caiobsantos) |
