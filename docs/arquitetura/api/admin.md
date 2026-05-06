# API de Administração

## Objetivo

Os endpoints administrativos permitem listar usuários, consultar detalhes de um usuário e alterar status de contas.

Eles são voltados para operações internas de gestão, principalmente análise e controle de usuários cadastrados.

---

## **GET** /admin/usuarios

**Descrição:** lista usuários cadastrados.

Este endpoint retorna usuários de forma paginada. Ele é usado em telas administrativas que precisam visualizar a base de usuários sem carregar todos os registros de uma vez.

**Autenticação:** obrigatória.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `page` | number | Não | Inteiro maior ou igual a 1 |
| `limit` | number | Não | Inteiro de 1 a 100 |

**Resposta de sucesso — 200**

```json
{
  "dados": [
    {
      "id": "usuario-id",
      "nome": "Nome do Usuário",
      "email": "usuario@email.com",
      "perfil": "ALUNO",
      "status": "ATIVO"
    }
  ],
  "metadados": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## **GET** /admin/usuarios/:id

**Descrição:** busca um usuário pelo id.

Este endpoint retorna os dados detalhados de um usuário específico. Ele é usado quando uma tela administrativa precisa abrir ou revisar o cadastro completo de uma conta.

**Autenticação:** obrigatória.

**Path params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | Id não vazio |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Usuário encontrado.",
  "dados": {
    "id": "usuario-id",
    "nome": "Nome do Usuário",
    "nickname": "nickname",
    "email": "usuario@email.com",
    "perfil": "ALUNO",
    "status": "ATIVO"
  }
}
```

---

## **PATCH** /admin/usuarios/:id/status

**Descrição:** altera o status de um usuário.

Este endpoint muda o status de uma conta para ativa, pendente ou inativa. Ele é usado em fluxos administrativos de aprovação, bloqueio ou reativação de usuários.

**Autenticação:** obrigatória.

**Path params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | Id não vazio |

**Body**

| Campo | Tipo | Obrigatório | Valores aceitos |
|-------|------|-------------|-----------------|
| `status` | string | Sim | `PENDING`, `ACTIVE`, `INACTIVE` |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Status do usuário alterado com sucesso.",
  "dados": {
    "id": "usuario-id",
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "perfil": "PROFESSOR",
    "status": "ATIVO"
  }
}
```

!!! warning "Observação"
    No código atual, os endpoints administrativos ficam atrás de autenticação, mas a validação explícita de perfil administrador no service está comentada. Antes de produção, essa regra deve ser revisada.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
