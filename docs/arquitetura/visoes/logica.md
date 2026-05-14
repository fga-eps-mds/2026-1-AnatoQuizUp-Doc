# Visao Logica

A visao logica descreve a decomposicao funcional do AnatoQuizUp em camadas e servicos de dominio. A regra principal e simples: o Frontend fala somente com o BFF; o BFF roteia; cada servico de dominio aplica suas proprias regras e persiste no seu proprio banco.

## Organizacao geral

- **Frontend Web:** interface usada por alunos, professores e administradores.
- **BFF:** ponto de entrada publico; valida JWT na borda; injeta token interno; roteia chamadas.
- **Backend/Auth:** autenticacao, identidade, administracao de usuarios e exemplos tecnicos.
- **Quiz-Service:** questoes e logica de quiz ja existente.
- **AI Service:** reservado para funcionalidades futuras de IA.

## Frontend

O Frontend segue Feature-Sliced Design.

| Camada | Responsabilidade |
|--------|------------------|
| `app` | Inicializacao da aplicacao, rotas, providers e estilos globais. |
| `pages` | Telas acessadas pelo usuario. |
| `widgets` | Blocos maiores de interface. |
| `features` | Funcionalidades do usuario, como login e gerenciamento de questoes. |
| `entities` | Modelos centrais do dominio. |
| `shared` | Componentes genericos, cliente HTTP, configuracoes e utilitarios. |

## BFF

O BFF e um proxy de orquestracao, sem persistencia e sem regra de negocio.

| Componente | Responsabilidade |
|------------|------------------|
| Rotas | Definem prefixos publicos (`/api/v1/autenticacao`, `/api/v1/admin`, `/api/v1/exemplos`, `/api/v1/questoes`, `/api/v1/ia`). |
| Middlewares | Validam JWT, filtram headers, injetam `X-Internal-Token` e tratam erros. |
| Clientes HTTP | `backend.client`, `quiz.client` e `ai.client`. |

## Backend/Auth

O Backend/Auth e privado e concentra identidade.

| Modulo | Responsabilidade |
|--------|------------------|
| `auth` | Cadastro, login, logout, refresh token e recuperacao de senha. |
| `admin` | Administracao de usuarios e aprovacao de professores. |
| `exemplo` | Modulo tecnico de referencia mantido nesta etapa. |

## Quiz-Service

O Quiz-Service e privado e concentra o dominio de quiz.

| Modulo | Responsabilidade |
|--------|------------------|
| `questoes` | CRUD de questoes, alternativas, temas e resolucoes migradas do Backend. |
| `storage` | Infraestrutura de imagens de questoes via MinIO/S3. |

O Quiz-Service valida o JWT localmente com `JWT_SECRET_KEY`. Autorizacao usa `papel` e `status` vindos do JWT assinado; `X-User-*` e apenas apoio para observabilidade.

## Relacao entre as camadas

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as BFF
    participant A as Backend/Auth
    participant Q as Quiz-Service
    participant DBAuth as Auth DB
    participant DBQuiz as Quiz DB

    F->>B: Request HTTP (Bearer JWT)
    B->>B: Valida JWT quando rota autenticada
    alt rota de auth/admin/exemplos
        B->>A: Repassa com Authorization + X-Internal-Token
        A->>A: Revalida JWT e aplica regra de Auth/Admin
        A->>DBAuth: Consulta ou grava
        DBAuth-->>A: Retorna dados
        A-->>B: Resposta
    else rota de questoes
        B->>Q: Repassa com Authorization + X-Internal-Token
        Q->>Q: Valida JWT e papel/status
        Q->>DBQuiz: Consulta ou grava
        DBQuiz-->>Q: Retorna dados
        Q-->>B: Resposta
    end
    B-->>F: Resposta preservando contrato publico
```

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criacao da visao logica da arquitetura | [Breno Fernandes](https://github.com/Brenofrds) |
| 27/04/2026 | 1.1 | Simplificacao da visao logica | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.2 | Inclusao do BFF como camada logica entre Frontend e Backend | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualizacao para Backend/Auth, Quiz-Service e bancos separados | Miguel Moreira |
