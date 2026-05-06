# Visão Geral da API

## Objetivo

Esta seção documenta os endpoints REST públicos do AnatoQuizUp. Do ponto de vista do consumidor (Frontend), **a API pública é o BFF** — ele é o único endereço externo. Os contratos descritos aqui (caminho, payload, status, formato de erro) continuam válidos: o BFF preserva path e contrato; a implementação real fica no Backend (`fga-eps-mds/2026-1-AnatoQuizUp-Backend`).

A API usa versionamento no caminho. Todos os endpoints de negócio documentados aqui partem do prefixo `/api/v1`. Por isso, nas páginas específicas, os títulos omitem esse prefixo para reduzir repetição. Quando a documentação mostra `POST /autenticacao/login`, o caminho completo é `POST /api/v1/autenticacao/login`.

Endpoints `GET /health` (BFF) e `/api/v1/ia/*` ficam fora do padrão geral: o primeiro é o health check do próprio BFF; o segundo é reservado ao serviço de AI e atualmente responde **503 `IA_INDISPONIVEL`** enquanto o serviço estiver vazio (placeholder).

## Execução local

Localmente, sobem três processos: Backend, BFF e Frontend.

### Backend (`2026-1-AnatoQuizUp-Backend`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN (mesmo valor do BFF)
npm run db:up
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Backend disponível em `http://localhost:3333`. Aceita requisições apenas com header `X-Internal-Token` válido (rota `GET /health` é a exceção).

### BFF (`2026-1-AnatoQuizUp-BFF`)

```bash
cp .env.example .env
# Preencher INTERNAL_TOKEN e JWT_SECRET_KEY (mesmos valores do Backend)
npm ci
npm run dev
```

BFF disponível em `http://localhost:4000`. É o endereço usado pelo Frontend.

### Caminho público

```text
http://localhost:4000/api/v1
```

Exemplo completo:

```http
POST http://localhost:4000/api/v1/autenticacao/login
```

## Autenticação

A API usa tokens JWT para controlar sessões autenticadas. JWT é um token assinado pelo backend que carrega informações mínimas do usuário, como identificador e papel. Como ele é assinado, a API consegue validar se o token foi emitido pelo próprio servidor e se ainda pode ser aceito.

O login é feito pelo endpoint [`POST /autenticacao/login`](./autenticacao.md#post-autenticacaologin). Quando as credenciais estão corretas, a API retorna dois tokens:

- `accessToken`: usado nas requisições protegidas;
- `refreshToken`: usado para renovar a sessão sem exigir novo login.

Endpoints protegidos exigem o `accessToken` no cabeçalho `Authorization`:

```http
Authorization: Bearer <accessToken>
```

Quando o `accessToken` expira, o frontend deve chamar [`POST /autenticacao/atualizar-token`](./autenticacao.md#post-autenticacaoatualizar-token) com o `refreshToken`. Esse endpoint retorna um novo par de tokens e permite manter a sessão ativa de forma controlada.

O encerramento da sessão acontece em [`POST /autenticacao/sair`](./autenticacao.md#post-autenticacaosair), que revoga o `refreshToken` informado.

## Contratos de resposta

Os endpoints da API usam contratos padronizados para sucesso, paginação e erro. Isso permite que o frontend trate respostas de forma previsível, sem precisar criar um formato diferente para cada tela.

### Sucesso

Operações que retornam um recurso único usam o formato:

```json
{
  "mensagem": "Mensagem de sucesso.",
  "dados": {}
}
```

O campo `mensagem` descreve o resultado da operação. O campo `dados` contém o recurso retornado pela API.

### Paginação

Listagens paginadas usam o formato:

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

O campo `dados` contém os itens da página atual. O campo `metadados` informa a página, o limite utilizado, o total de registros encontrados e o total de páginas disponíveis.

### Erro

Erros usam o formato:

```json
{
  "erro": {
    "codigo": "ERRO_DE_VALIDACAO",
    "mensagem": "Mensagem do erro.",
    "detalhes": {}
  }
}
```

O campo `codigo` é o valor mais importante para tratamento programático no frontend. A lista completa de códigos e status HTTP está em [Erros e Contratos](./erros.md).

## Endpoints públicos

Endpoints públicos podem ser acessados sem `accessToken`.

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

Endpoints autenticados exigem `Authorization: Bearer <accessToken>`.

| Método | Endpoint | Documentação |
|--------|----------|--------------|
| GET | `/autenticacao/usuario-atual` | [Autenticação](./autenticacao.md#get-autenticacaousuario-atual) |
| POST | `/autenticacao/sair` | [Autenticação](./autenticacao.md#post-autenticacaosair) |
| GET | `/admin/usuarios` | [Administração](./admin.md#get-adminusuarios) |
| GET | `/admin/usuarios/:id` | [Administração](./admin.md#get-adminusuariosid) |
| PATCH | `/admin/usuarios/:id/status` | [Administração](./admin.md#patch-adminusuariosidstatus) |
| POST | `/exemplos` | [Exemplos](./exemplos.md#post-exemplos) |
| GET | `/exemplos` | [Exemplos](./exemplos.md#get-exemplos) |
| GET | `/exemplos/:id` | [Exemplos](./exemplos.md#get-exemplosid) |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
| 05/05/2026 | 1.1 | Atualização para refletir o BFF como porta de entrada pública e mencionar o placeholder `/api/v1/ia/*` (PRD: Migração para Arquitetura com BFF) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
