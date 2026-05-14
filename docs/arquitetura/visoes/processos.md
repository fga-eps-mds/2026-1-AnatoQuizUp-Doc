# Visão de Processos

Este documento descreve como os principais fluxos do AnatoQuizUp passam pelo Frontend, BFF e serviços internos. A arquitetura atual separa os fluxos de identidade dos fluxos de quiz.

## Fluxo geral

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant Quiz as Quiz-Service

    Usuario->>Frontend: Interage com a interface
    Frontend->>BFF: Envia request HTTP
    BFF->>BFF: Valida JWT quando necessário
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

    Aluno->>Frontend: Preenche formulário de cadastro
    Frontend->>BFF: POST /api/v1/autenticacao/cadastro
    BFF->>Auth: POST /api/v1/autenticacao/cadastro + X-Internal-Token
    Auth->>DB: Verifica duplicidade e cria usuário
    DB-->>Auth: Confirma persistência
    Auth-->>BFF: Retorna resultado
    BFF-->>Frontend: Retorna resultado
```

## Login

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant DB as Auth DB

    Usuario->>Frontend: Informa email e senha
    Frontend->>BFF: POST /api/v1/autenticacao/login
    BFF->>Auth: POST /api/v1/autenticacao/login + X-Internal-Token
    Auth->>DB: Busca usuário e valida credenciais
    alt credenciais inválidas ou usuário bloqueado
        Auth-->>BFF: 401/403
        BFF-->>Frontend: 401/403
    else usuário ativo
        Auth->>Auth: Gera access token com id, papel e status
        Auth->>DB: Persiste refresh token
        Auth-->>BFF: Tokens e usuário
        BFF-->>Frontend: Tokens e usuário
    end
```

## Rota autenticada de Auth/Admin

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant BFF
    participant Auth as Backend/Auth
    participant DB as Auth DB

    Usuario->>Frontend: Acessa recurso protegido
    Frontend->>BFF: Request com Bearer token
    BFF->>BFF: Valida assinatura/expiração do JWT
    BFF->>Auth: Request + Authorization + X-Internal-Token + X-User-*
    Auth->>Auth: Valida token interno e revalida JWT
    Auth->>DB: Revalida status/permissões do usuário
    DB-->>Auth: Retorna usuário
    Auth-->>BFF: Retorna recurso ou erro
    BFF-->>Frontend: Retorna recurso ou erro
```

## Gestão de questões

```mermaid
sequenceDiagram
    actor Professor
    participant Frontend
    participant BFF
    participant Quiz as Quiz-Service
    participant DB as Quiz DB

    Professor->>Frontend: Acessa gerenciamento de questões
    Frontend->>BFF: GET/POST/PUT/DELETE /api/v1/questoes
    BFF->>BFF: Valida JWT
    BFF->>Quiz: Repassa Authorization + X-Internal-Token + X-User-*
    Quiz->>Quiz: Valida X-Internal-Token
    Quiz->>Quiz: Valida JWT e exige papel PROFESSOR ou ADMINISTRADOR
    Quiz->>DB: Consulta ou grava questões
    DB-->>Quiz: Retorna dados
    Quiz-->>BFF: Retorna resposta padronizada
    BFF-->>Frontend: Retorna resposta
```

## Observações arquiteturais

- O Frontend não acessa Backend/Auth, Quiz-Service, AI ou bancos diretamente.
- O BFF não tem regra de negócio nem banco.
- Backend/Auth e Quiz-Service validam `X-Internal-Token`.
- O nome canônico do papel no JWT é `papel`; `perfil` é legado.
- O Quiz-Service não acessa a tabela de usuários do Backend/Auth.
- Para nomes/emails de autores em telas futuras, a composição deve ser feita por API, preferencialmente com lookup em lote pelo BFF.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 26/04/2026 | 1.0 | Criação da visão de processos da arquitetura | [Breno Fernandes](https://github.com/brenofrds) |
| 05/05/2026 | 1.1 | Atualização para incluir o BFF como ator intermediário | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Inclusão dos fluxos do Quiz-Service e bancos separados | Miguel Moreira |
| 13/05/2026 | 2.1 | Restauração dos acentos do português brasileiro | Miguel Moreira |
