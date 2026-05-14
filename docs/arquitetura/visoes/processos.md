# Visao de Processos

Este documento descreve como os principais fluxos do AnatoQuizUp passam pelo Frontend, BFF e servicos internos. A arquitetura atual separa os fluxos de identidade dos fluxos de quiz.

## Fluxo geral

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant Quiz as Quiz-Service

    Usuario->>Frontend: Interage com a interface
    Frontend->>BFF: Envia request HTTP
    BFF->>BFF: Valida JWT quando necessario
    alt /autenticacao, /admin, /exemplos
        BFF->>Auth: Repassa com Authorization + X-Internal-Token
        Auth-->>BFF: Retorna resposta
    else /questoes
        BFF->>Quiz: Repassa com Authorization + X-Internal-Token
        Quiz-->>BFF: Retorna resposta
    else /ia
        BFF-->>Frontend: 503 enquanto AI estiver sem URL
    end
    BFF-->>Frontend: Retorna resposta
    Frontend-->>Usuario: Atualiza interface
```

## Cadastro de aluno

```mermaid
sequenceDiagram
    actor Aluno
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant DB as Auth DB

    Aluno->>Frontend: Preenche formulario de cadastro
    Frontend->>BFF: POST /api/v1/autenticacao/cadastro
    BFF->>Auth: POST /api/v1/autenticacao/cadastro + X-Internal-Token
    Auth->>DB: Verifica duplicidade e cria usuario
    DB-->>Auth: Confirma persistencia
    Auth-->>BFF: Retorna resultado
    BFF-->>Frontend: Retorna resultado
```

## Login

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant DB as Auth DB

    Usuario->>Frontend: Informa email e senha
    Frontend->>BFF: POST /api/v1/autenticacao/login
    BFF->>Auth: POST /api/v1/autenticacao/login + X-Internal-Token
    Auth->>DB: Busca usuario e valida credenciais
    alt credenciais invalidas ou usuario bloqueado
        Auth-->>BFF: 401/403
        BFF-->>Frontend: 401/403
    else usuario ativo
        Auth->>Auth: Gera access token com id, papel e status
        Auth->>DB: Persiste refresh token
        Auth-->>BFF: Tokens e usuario
        BFF-->>Frontend: Tokens e usuario
    end
```

## Rota autenticada de Auth/Admin

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant DB as Auth DB

    Usuario->>Frontend: Acessa recurso protegido
    Frontend->>BFF: Request com Bearer token
    BFF->>BFF: Valida assinatura/expiracao do JWT
    BFF->>Auth: Request + Authorization + X-Internal-Token + X-User-*
    Auth->>Auth: Valida token interno e revalida JWT
    Auth->>DB: Revalida status/permissoes do usuario
    DB-->>Auth: Retorna usuario
    Auth-->>BFF: Retorna recurso ou erro
    BFF-->>Frontend: Retorna recurso ou erro
```

## Gestao de questoes

```mermaid
sequenceDiagram
    actor Professor
    participant Frontend
    participant BFF
    participant Quiz as Quiz-Service
    participant DB as Quiz DB

    Professor->>Frontend: Acessa gerenciamento de questoes
    Frontend->>BFF: GET/POST/PUT/DELETE /api/v1/questoes
    BFF->>BFF: Valida JWT
    BFF->>Quiz: Repassa Authorization + X-Internal-Token + X-User-*
    Quiz->>Quiz: Valida X-Internal-Token
    Quiz->>Quiz: Valida JWT e exige papel PROFESSOR ou ADMINISTRADOR
    Quiz->>DB: Consulta ou grava questoes
    DB-->>Quiz: Retorna dados
    Quiz-->>BFF: Retorna resposta padronizada
    BFF-->>Frontend: Retorna resposta
```

## Observacoes arquiteturais

- O Frontend nao acessa Backend/Auth, Quiz-Service, AI ou bancos diretamente.
- O BFF nao tem regra de negocio nem banco.
- Backend/Auth e Quiz-Service validam `X-Internal-Token`.
- O nome canonico do papel no JWT e `papel`; `perfil` e legado.
- O Quiz-Service nao acessa a tabela de usuarios do Backend/Auth.
- Para nomes/emails de autores em telas futuras, a composicao deve ser feita por API, preferencialmente com lookup em lote pelo BFF.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 26/04/2026 | 1.0 | Criacao da visao de processos da arquitetura | [Breno Fernandes](https://github.com/brenofrds) |
| 05/05/2026 | 1.1 | Atualizacao para incluir o BFF como ator intermediario | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Inclusao dos fluxos do Quiz-Service e bancos separados | Miguel Moreira |
