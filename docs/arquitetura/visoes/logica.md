# Visão Lógica

A visão lógica descreve a decomposição funcional do AnatoQuizUp em módulos e componentes. Ela mostra quais partes compõem o sistema, quais responsabilidades cada camada possui e como frontend, backend, domínio e banco de dados se relacionam.

## Organização geral

O sistema é organizado em quatro blocos principais ativos (mais um reservado):

- **Frontend Web:** interface usada por alunos, professores e administradores.
- **BFF (Backend-For-Frontend):** ponto de entrada público; valida JWT; injeta token interno; orquestra chamadas para Backend ou AI.
- **Backend API:** regras de negócio, autenticação, autorização e exposição dos endpoints.
- **Banco de Dados:** persistência dos dados da aplicação.
- **AI Service (reservado):** serviço de IA para semestres futuros; vazio nesta release.

## Frontend

O frontend é organizado em camadas seguindo Feature-Sliced Design. Essa divisão ajuda a separar telas, funcionalidades, componentes estruturais, modelos de domínio e recursos compartilhados.

| Camada | Responsabilidade |
|--------|------------------|
| `app` | Inicialização da aplicação, rotas, providers e estilos globais. |
| `pages` | Telas acessadas pelo usuário. |
| `widgets` | Blocos maiores de interface, como cabeçalho, navegação e layouts. |
| `features` | Funcionalidades do usuário, como login, cadastro, recuperação de senha e gerenciamento. |
| `entities` | Modelos centrais do domínio, como usuário, perfil e status. |
| `shared` | Componentes genéricos, cliente HTTP, configurações e utilitários. |

## BFF

O BFF é organizado em camadas mais simples que o Backend, refletindo seu papel de proxy 100% orquestração:

| Componente | Responsabilidade |
|------------|------------------|
| Rotas | Definem prefixos públicos (`/api/v1/autenticacao`, `/api/v1/admin`, `/api/v1/exemplos`, `/api/v1/ia`) e quais exigem JWT. |
| Middlewares | `autenticacao` (validação de JWT no BFF), `proxy` (repassa request com cabeçalhos injetados), `tratamento-erros` (mapeia erros do downstream). |
| Clientes HTTP | `backend.client` e `ai.client` — instâncias Axios apontadas para os serviços de domínio. |

## Backend

O backend é organizado em módulos de domínio. Cada módulo deve reunir suas rotas, validações, controllers, services, repositories, DTOs e testes.

| Componente | Responsabilidade |
|------------|------------------|
| Rotas | Definem os endpoints HTTP e aplicam middlewares. |
| Middlewares | Tratam validação, autenticação, autorização e erros. |
| Controllers | Recebem requisições e chamam os serviços. |
| Services | Concentram regras de negócio. |
| Repositories | Isolam o acesso ao banco de dados. |
| Schemas | Validam entradas com Zod. |
| DTOs | Definem contratos de entrada e saída. |

## Módulos principais

Os principais módulos lógicos previstos para o sistema são:

| Módulo | Responsabilidade |
|--------|------------------|
| Autenticação | Cadastro, login, logout, tokens e recuperação de senha. |

## Relação entre as camadas

O frontend não acessa o backend nem o banco diretamente. As telas chamam o **BFF**, que valida o JWT e repassa para o Backend (ou AI) injetando `X-Internal-Token`. O Backend valida os dados recebidos, aplica as regras de negócio e acessa o banco por meio do Prisma.

Tanto o BFF quanto o Backend usam respostas padronizadas para que o frontend trate sucesso, erro e paginação de forma consistente.

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as BFF
    participant R as Rotas (Backend)
    participant C as Controller
    participant S as Service
    participant P as Repository
    participant DB as Banco

    F->>B: Requisição HTTP (Bearer JWT)
    B->>B: Valida JWT (assinatura/expiração)
    B->>R: Repassa com X-Internal-Token + X-User-*
    R->>C: Encaminha dados validados
    C->>S: Executa caso de uso
    S->>P: Solicita dados
    P->>DB: Consulta ou grava
    DB-->>P: Retorna dados
    P-->>S: Retorna resultado
    S-->>C: Retorna regra aplicada
    C-->>R: Resposta
    R-->>B: Resposta
    B-->>F: Resposta padronizada
```

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da visão lógica da arquitetura | [Breno Fernandes](https://github.com/Brenofrds) |
| 27/04/2026 | 1.1 | Simplificação da visão lógica com foco em módulos, camadas e responsabilidades | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.2 | Inclusão do BFF como camada lógica entre Frontend e Backend (PRD: Migração para Arquitetura com BFF) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
