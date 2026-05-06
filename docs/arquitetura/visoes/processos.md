# Visão de Processos

Este documento apresenta a visão de processos do AnatoQuizUp, descrevendo como os principais fluxos da aplicação se comportam em tempo de execução.

A visão de processos foca na interação entre usuário, frontend, BFF, backend e banco de dados durante a execução das funcionalidades principais da Release Major 1.

## Fluxo geral

Em alto nível, os processos da aplicação seguem o seguinte fluxo:

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Interage com a interface
    Frontend->>BFF: Envia requisição HTTP (Bearer JWT)
    BFF->>BFF: Valida JWT (quando rota autenticada)
    BFF->>Backend: Repassa com X-Internal-Token
    Backend->>Banco: Consulta ou persiste dados
    Banco-->>Backend: Retorna dados
    Backend-->>BFF: Retorna resposta da API
    BFF-->>Frontend: Retorna resposta
    Frontend-->>Usuario: Atualiza a interface
```

## Processos Especificos

### Processo de cadastro de aluno

```mermaid
sequenceDiagram
    actor Aluno
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Aluno->>Frontend: Preenche formulário de cadastro
    Frontend->>Frontend: Valida campos obrigatórios
    Frontend->>BFF: POST /api/v1/autenticacao/cadastro
    BFF->>Backend: POST /api/v1/autenticacao/cadastro (X-Internal-Token)
    Backend->>Backend: Valida dados da requisição
    Backend->>Banco: Verifica se email já existe
    Banco-->>Backend: Retorna resultado da consulta

    alt Email já cadastrado
        Backend-->>BFF: Retorna erro de conflito
        BFF-->>Frontend: Retorna erro de conflito
        Frontend-->>Aluno: Exibe mensagem de erro
    else Email disponível
        Backend->>Backend: Gera hash da senha
        Backend->>Banco: Cria usuário com perfil ALUNO e status ATIVO
        Banco-->>Backend: Confirma criação
        Backend-->>BFF: Retorna cadastro realizado com sucesso
        BFF-->>Frontend: Retorna cadastro realizado com sucesso
        Frontend-->>Aluno: Redireciona para login ou área inicial
    end
```

### Processo de cadastro de professor

```mermaid
sequenceDiagram
    actor Professor
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Professor->>Frontend: Preenche formulário de cadastro
    Frontend->>Frontend: Valida dados básicos
    Frontend->>BFF: POST /api/v1/autenticacao/professores/cadastro
    BFF->>Backend: POST /api/v1/autenticacao/professores/cadastro (X-Internal-Token)
    Backend->>Backend: Valida email institucional e SIAPE
    Backend->>Banco: Verifica email e SIAPE únicos
    Banco-->>Backend: Retorna resultado da consulta

    alt Dados inválidos ou duplicados
        Backend-->>BFF: Retorna erro de validação ou conflito
        BFF-->>Frontend: Retorna erro
        Frontend-->>Professor: Exibe mensagem de erro
    else Dados válidos
        Backend->>Backend: Gera hash da senha
        Backend->>Banco: Cria usuário com perfil PROFESSOR e status PENDENTE
        Banco-->>Backend: Confirma criação
        Backend-->>BFF: Retorna cadastro enviado para análise
        BFF-->>Frontend: Retorna cadastro enviado para análise
        Frontend-->>Professor: Redireciona para tela de cadastro em análise
    end
```

### Processo de login

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Informa email e senha
    Frontend->>BFF: POST /api/v1/autenticacao/login
    BFF->>Backend: POST /api/v1/autenticacao/login (X-Internal-Token)
    Backend->>Banco: Busca usuário por email
    Banco-->>Backend: Retorna usuário encontrado ou vazio

    alt Usuário não encontrado ou senha inválida
        Backend-->>BFF: Retorna 401 NAO_AUTORIZADO
        BFF-->>Frontend: Retorna 401
        Frontend-->>Usuario: Exibe mensagem de credenciais inválidas
    else Usuário INATIVO ou RECUSADO
        Backend-->>BFF: Retorna 403 PROIBIDO
        BFF-->>Frontend: Retorna 403
        Frontend-->>Usuario: Exibe mensagem conforme status da conta
    else Usuário ATIVO
        Backend->>Backend: Gera token de acesso JWT
        Backend->>Backend: Gera token de atualização
        Backend->>Banco: Salva refresh token
        Banco-->>Backend: Confirma persistência
        Backend-->>BFF: Retorna tokens e dados do usuário
        BFF-->>Frontend: Retorna tokens e dados do usuário
        Frontend->>Frontend: Salva tokens e usuário no localStorage
        Frontend-->>Usuario: Redireciona para área autenticada
    end
```

### Processo de autenticação com JWT em rota protegida

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Middleware as Middleware de Autenticação (Backend)
    participant Banco as Banco de Dados

    Usuario->>Frontend: Acessa funcionalidade protegida
    Frontend->>BFF: Envia requisição com Bearer token
    BFF->>BFF: Valida assinatura/expiração do JWT
    alt JWT inválido ou ausente
        BFF-->>Frontend: 401 NAO_AUTORIZADO
        Frontend-->>Usuario: Redireciona para login
    else JWT válido no BFF
        BFF->>Backend: Repassa com Bearer + X-Internal-Token + X-User-*
        Backend->>Middleware: Encaminha requisição
        Middleware->>Middleware: Verifica X-Internal-Token e revalida JWT
        Middleware->>Banco: Busca usuário e revalida status atual
        Banco-->>Middleware: Retorna usuário

        alt Usuário não está ATIVO
            Middleware-->>Backend: 403 PROIBIDO
            Backend-->>BFF: 403 PROIBIDO
            BFF-->>Frontend: 403 PROIBIDO
            Frontend-->>Usuario: Bloqueia acesso
        else Usuário autorizado
            Middleware->>Backend: Libera requisição
            Backend-->>BFF: Retorna recurso solicitado
            BFF-->>Frontend: Retorna recurso solicitado
            Frontend-->>Usuario: Exibe conteúdo protegido
        end
    end
```

### Processo de atualização de token

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Frontend->>BFF: POST /api/v1/autenticacao/atualizar-token
    BFF->>Backend: POST /api/v1/autenticacao/atualizar-token (X-Internal-Token)
    Backend->>Banco: Verifica refresh token atual
    Banco-->>Backend: Retorna token encontrado

    alt Refresh token inválido, expirado ou revogado
        Backend-->>BFF: Retorna 401 NAO_AUTORIZADO
        BFF-->>Frontend: Retorna 401
        Frontend-->>Usuario: Redireciona para login
    else Refresh token válido
        Backend->>Backend: Gera novo access token
        Backend->>Backend: Gera novo refresh token
        Backend->>Banco: Remove ou revoga refresh token antigo
        Backend->>Banco: Salva novo refresh token
        Banco-->>Backend: Confirma atualização
        Backend-->>BFF: Retorna novos tokens
        BFF-->>Frontend: Retorna novos tokens
        Frontend->>Frontend: Atualiza tokens no localStorage
    end
```

### Processo de logout

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Clica em sair
    Frontend->>BFF: POST /api/v1/autenticacao/sair (Bearer)
    BFF->>BFF: Valida JWT
    BFF->>Backend: POST /api/v1/autenticacao/sair (X-Internal-Token)
    Backend->>Banco: Invalida refresh token
    Banco-->>Backend: Confirma invalidação
    Backend-->>BFF: Retorna sucesso
    BFF-->>Frontend: Retorna sucesso
    Frontend->>Frontend: Remove tokens e usuário do localStorage
    Frontend-->>Usuario: Redireciona para login
```

### Processo de aprovação de professor pelo administrador

```mermaid
sequenceDiagram
    actor Administrador
    participant Frontend
    participant BFF
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Administrador->>Frontend: Acessa painel de usuários
    Frontend->>BFF: GET /api/v1/admin/usuarios?status=PENDENTE
    BFF->>BFF: Valida JWT
    BFF->>Backend: GET /api/v1/admin/usuarios?status=PENDENTE (X-Internal-Token)
    Backend->>Banco: Consulta usuários pendentes
    Banco-->>Backend: Retorna professores pendentes
    Backend-->>BFF: Retorna lista paginada
    BFF-->>Frontend: Retorna lista paginada
    Frontend-->>Administrador: Exibe usuários aguardando aprovação

    Administrador->>Frontend: Aprova professor
    Frontend->>BFF: PATCH /api/v1/admin/usuarios/:id/status
    BFF->>Backend: PATCH /api/v1/admin/usuarios/:id/status (X-Internal-Token)
    Backend->>Backend: Verifica perfil ADMINISTRADOR
    Backend->>Banco: Atualiza status para ATIVO
    Banco-->>Backend: Confirma atualização
    Backend-->>BFF: Retorna usuário atualizado
    BFF-->>Frontend: Retorna usuário atualizado
    Frontend-->>Administrador: Atualiza lista e exibe confirmação
```

## Observações arquiteturais

O frontend não acessa diretamente o backend nem o banco de dados; toda chamada passa pelo BFF.
O BFF não tem regras de negócio — é proxy 100% orquestração: valida JWT, injeta `X-Internal-Token` e cabeçalhos auxiliares (`X-User-Id`, `X-User-Profile`, `X-User-Status`) e repassa.
Toda regra de autenticação, autorização e persistência permanece no backend.
O access token é usado para autenticar requisições protegidas. O JWT é validado em duas camadas (BFF e Backend) — defesa em profundidade.
O refresh token é persistido no banco e utilizado para renovação de sessão.
O status do usuário deve ser revalidado no backend a cada requisição protegida.
Usuários com status diferente de ATIVO não devem acessar funcionalidades autenticadas.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 26/04/2026 | 1.0 | 1.0	Criação da visão de processos da arquitetura | [Breno Fernandes](https://github.com/brenofrds) |
| 05/05/2026 | 1.1 | Atualização de todos os diagramas para incluir o BFF como ator intermediário entre Frontend e Backend (PRD: Migração para Arquitetura com BFF) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
