# Visão Geral da API

## Objetivo

Esta seção documenta os endpoints REST disponíveis na API do AnatoQuizUp. A intenção é deixar claro quais contratos o frontend pode consumir, quais dados cada rota espera receber e qual formato de resposta deve ser tratado pela interface.

A API usa versionamento no caminho. Todos os endpoints de negócio documentados aqui partem do prefixo `/api/v1`. Por isso, nas páginas específicas, os títulos omitem esse prefixo para reduzir repetição. Quando a documentação mostra `POST /auth/login`, o caminho completo é `POST /api/v1/auth/login`.

O único endpoint fora desse padrão é `GET /health`, usado apenas para verificar se o servidor está em execução.

## Execução local

A API está preparada para rodar localmente com Node.js e PostgreSQL via Docker. O Docker Compose do backend sobe o banco de dados, enquanto a aplicação Express roda em modo de desenvolvimento pelo script do projeto.

O fluxo local esperado é:

```bash
cp .env.example .env
npm run db:up
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Com a API em execução, o servidor fica disponível em:

```text
http://localhost:3333
```

A partir disso, os endpoints versionados são acessados com o prefixo:

```text
http://localhost:3333/api/v1
```

Exemplo completo:

```http
POST http://localhost:3333/api/v1/auth/login
```

## Autenticação

A API usa tokens JWT para controlar sessões autenticadas. JWT é um token assinado pelo backend que carrega informações mínimas do usuário, como identificador e papel. Como ele é assinado, a API consegue validar se o token foi emitido pelo próprio servidor e se ainda pode ser aceito.

O login é feito pelo endpoint [`POST /auth/login`](./autenticacao.md#post-authlogin). Quando as credenciais estão corretas, a API retorna dois tokens:

- `accessToken`: usado nas requisições protegidas;
- `refreshToken`: usado para renovar a sessão sem exigir novo login.

Endpoints protegidos exigem o `accessToken` no cabeçalho `Authorization`:

```http
Authorization: Bearer <accessToken>
```

Quando o `accessToken` expira, o frontend deve chamar [`POST /auth/refresh`](./autenticacao.md#post-authrefresh) com o `refreshToken`. Esse endpoint retorna um novo par de tokens e permite manter a sessão ativa de forma controlada.

O encerramento da sessão acontece em [`POST /auth/logout`](./autenticacao.md#post-authlogout), que revoga o `refreshToken` informado.

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
| POST | `/auth/login` | [Autenticação](./autenticacao.md#post-authlogin) |
| POST | `/auth/refresh` | [Autenticação](./autenticacao.md#post-authrefresh) |
| POST | `/auth/register` | [Alunos](./alunos.md#post-authregister) |
| POST | `/auth/forgot-password` | [Autenticação](./autenticacao.md#post-authforgot-password) |
| POST | `/auth/reset-password` | [Autenticação](./autenticacao.md#post-authreset-password) |
| GET | `/auth/alunos/nickname-disponivel` | [Alunos](./alunos.md#get-authalunosnickname-disponivel) |
| GET | `/auth/alunos/email-disponivel` | [Alunos](./alunos.md#get-authalunosemail-disponivel) |
| GET | `/auth/alunos/nacionalidades` | [Alunos](./alunos.md#get-authalunosnacionalidades) |
| GET | `/auth/alunos/opcoes-academicas` | [Alunos](./alunos.md#get-authalunosopcoes-academicas) |
| GET | `/auth/localidades/estados` | [Localidades](./localidades.md#get-authlocalidadesestados) |
| GET | `/auth/localidades/estados/:uf/cidades` | [Localidades](./localidades.md#get-authlocalidadesestadosufcidades) |

## Endpoints autenticados

Endpoints autenticados exigem `Authorization: Bearer <accessToken>`.

| Método | Endpoint | Documentação |
|--------|----------|--------------|
| GET | `/auth/me` | [Autenticação](./autenticacao.md#get-authme) |
| POST | `/auth/logout` | [Autenticação](./autenticacao.md#post-authlogout) |
| GET | `/admin/users` | [Administração](./admin.md#get-adminusers) |
| GET | `/admin/users/:id` | [Administração](./admin.md#get-adminusersid) |
| PATCH | `/admin/users/:id/status` | [Administração](./admin.md#patch-adminusersidstatus) |
| POST | `/exemplos` | [Exemplos](./exemplos.md#post-exemplos) |
| GET | `/exemplos` | [Exemplos](./exemplos.md#get-exemplos) |
| GET | `/exemplos/:id` | [Exemplos](./exemplos.md#get-exemplosid) |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
