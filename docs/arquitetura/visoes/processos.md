# Visão de Processos

Este documento apresenta a visão de processos do AnatoQuizUp, descrevendo como os principais fluxos da aplicação se comportam em tempo de execução.

A visão de processos foca na interação entre usuário, frontend, backend e banco de dados durante a execução das funcionalidades principais da Release Major 1.

## Fluxo geral

Em alto nível, os processos da aplicação seguem o seguinte fluxo:

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Interage com a interface
    Frontend->>Backend: Envia requisição HTTP
    Backend->>Banco: Consulta ou persiste dados
    Banco-->>Backend: Retorna dados
    Backend-->>Frontend: Retorna resposta da API
    Frontend-->>Usuario: Atualiza a interface
```

## Processos Especificos

### Processo de cadastro de aluno

```mermaid
sequenceDiagram
    actor Aluno
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Aluno->>Frontend: Preenche formulário de cadastro
    Frontend->>Frontend: Valida campos obrigatórios
    Frontend->>Backend: POST /api/v1/autenticacao/cadastro
    Backend->>Backend: Valida dados da requisição
    Backend->>Banco: Verifica se email já existe
    Banco-->>Backend: Retorna resultado da consulta

    alt Email já cadastrado
        Backend-->>Frontend: Retorna erro de conflito
        Frontend-->>Aluno: Exibe mensagem de erro
    else Email disponível
        Backend->>Backend: Gera hash da senha
        Backend->>Banco: Cria usuário com perfil ALUNO e status ATIVO
        Banco-->>Backend: Confirma criação
        Backend-->>Frontend: Retorna cadastro realizado com sucesso
        Frontend-->>Aluno: Redireciona para login ou área inicial
    end
```

### Processo de cadastro de professor

```mermaid
sequenceDiagram
    actor Professor
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Professor->>Frontend: Preenche formulário de cadastro
    Frontend->>Frontend: Valida dados básicos
    Frontend->>Backend: POST /api/v1/autenticacao/cadastro/professor
    Backend->>Backend: Valida email institucional e SIAPE
    Backend->>Banco: Verifica email e SIAPE únicos
    Banco-->>Backend: Retorna resultado da consulta

    alt Dados inválidos ou duplicados
        Backend-->>Frontend: Retorna erro de validação ou conflito
        Frontend-->>Professor: Exibe mensagem de erro
    else Dados válidos
        Backend->>Backend: Gera hash da senha
        Backend->>Banco: Cria usuário com perfil PROFESSOR e status PENDENTE
        Banco-->>Backend: Confirma criação
        Backend-->>Frontend: Retorna cadastro enviado para análise
        Frontend-->>Professor: Redireciona para tela de cadastro em análise
    end
```

### Processo de login

```mermaid
sequenceDiagram
    actor Usuario as Usuário
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Informa email e senha
    Frontend->>Backend: POST /api/v1/autenticacao/login
    Backend->>Banco: Busca usuário por email
    Banco-->>Backend: Retorna usuário encontrado ou vazio

    alt Usuário não encontrado ou senha inválida
        Backend-->>Frontend: Retorna 401 NAO_AUTORIZADO
        Frontend-->>Usuario: Exibe mensagem de credenciais inválidas
    else Usuário INATIVO ou RECUSADO
        Backend-->>Frontend: Retorna 401 PROIBIDO
        Frontend-->>Usuario: Exibe mensagem conforme status da conta
    else Usuário ATIVO
        Backend->>Backend: Gera token de acesso JWT
        Backend->>Backend: Gera token de atualização
        Backend->>Banco: Salva refresh token
        Banco-->>Backend: Confirma persistência
        Backend-->>Frontend: Retorna tokens e dados do usuário
        Frontend->>Frontend: Salva tokens e usuário no localStorage
        Frontend-->>Usuario: Redireciona para área autenticada
    end
```

### Processo de autenticação com JWT em rota protegida

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant Backend as API Backend
    participant Middleware as Middleware de Autenticação
    participant Banco as Banco de Dados

    Usuario->>Frontend: Acessa funcionalidade protegida
    Frontend->>Backend: Envia requisição com Bearer token
    Backend->>Middleware: Encaminha requisição
    Middleware->>Middleware: Verifica assinatura e validade do JWT
    Middleware->>Banco: Busca usuário e revalida status atual
    Banco-->>Middleware: Retorna usuário

    alt Token inválido ou ausente
        Middleware-->>Frontend: Retorna 401 NAO_AUTORIZADO
        Frontend-->>Usuario: Redireciona para login
    else Usuário não está ATIVO
        Middleware-->>Frontend: Retorna 403 PROIBIDO
        Frontend-->>Usuario: Bloqueia acesso
    else Usuário autorizado
        Middleware->>Backend: Libera requisição
        Backend-->>Frontend: Retorna recurso solicitado
        Frontend-->>Usuario: Exibe conteúdo protegido
    end
```

### Processo de atualização de token

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Frontend->>Backend: POST /api/v1/autenticacao/atualizar-token
    Backend->>Banco: Verifica refresh token atual
    Banco-->>Backend: Retorna token encontrado

    alt Refresh token inválido, expirado ou revogado
        Backend-->>Frontend: Retorna 401 NAO_AUTORIZADO
        Frontend-->>Usuario: Redireciona para login
    else Refresh token válido
        Backend->>Backend: Gera novo access token
        Backend->>Backend: Gera novo refresh token
        Backend->>Banco: Remove ou revoga refresh token antigo
        Backend->>Banco: Salva novo refresh token
        Banco-->>Backend: Confirma atualização
        Backend-->>Frontend: Retorna novos tokens
        Frontend->>Frontend: Atualiza tokens no localStorage
    end
```

### Processo de logout

```mermaid
sequenceDiagram
    actor Usuario as Usuário autenticado
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Usuario->>Frontend: Clica em sair
    Frontend->>Backend: POST /api/v1/autenticacao/sair
    Backend->>Banco: Invalida refresh token
    Banco-->>Backend: Confirma invalidação
    Backend-->>Frontend: Retorna sucesso
    Frontend->>Frontend: Remove tokens e usuário do localStorage
    Frontend-->>Usuario: Redireciona para login
```

### Processo de aprovação de professor pelo administrador

```mermaid
sequenceDiagram
    actor Administrador
    participant Frontend
    participant Backend as API Backend
    participant Banco as Banco de Dados

    Administrador->>Frontend: Acessa painel de usuários
    Frontend->>Backend: GET /api/v1/admin/usuarios?status=PENDENTE
    Backend->>Banco: Consulta usuários pendentes
    Banco-->>Backend: Retorna professores pendentes
    Backend-->>Frontend: Retorna lista paginada
    Frontend-->>Administrador: Exibe usuários aguardando aprovação

    Administrador->>Frontend: Aprova professor
    Frontend->>Backend: PATCH /api/v1/admin/usuarios/:id/status
    Backend->>Backend: Verifica perfil ADMINISTRADOR
    Backend->>Banco: Atualiza status para ATIVO
    Banco-->>Backend: Confirma atualização
    Backend-->>Frontend: Retorna usuário atualizado
    Frontend-->>Administrador: Atualiza lista e exibe confirmação
```

## Observações arquiteturais

O frontend não acessa diretamente o banco de dados.
Toda regra de autenticação, autorização e persistência é responsabilidade do backend.
O access token é usado para autenticar requisições protegidas.
O refresh token é persistido no banco e utilizado para renovação de sessão.
O status do usuário deve ser revalidado no backend a cada requisição protegida.
Usuários com status diferente de ATIVO não devem acessar funcionalidades autenticadas.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 26/04/2026 | 1.0 | 1.0	Criação da visão de processos da arquitetura | [Breno Fernandes](https://github.com/brenofrds) | 