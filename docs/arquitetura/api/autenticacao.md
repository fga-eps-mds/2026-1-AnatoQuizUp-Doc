# API de Autenticação

## Objetivo

Os endpoints de autenticação controlam login, renovação de sessão, consulta do usuário autenticado, logout e recuperação de senha.

Eles são usados pelo frontend para iniciar sessão, manter o usuário autenticado e recuperar o acesso quando a senha é esquecida.

---

## **POST** /autenticacao/login

**Descrição:** autentica um usuário com email e senha.

Este endpoint verifica as credenciais informadas, valida se a conta pode acessar o sistema e retorna os tokens necessários para manter a sessão do usuário. Ele é usado na tela de login e inicia o fluxo descrito na [visão geral de autenticação](./visao-geral.md#autenticacao).

**Autenticação:** pública.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `email` | string | Sim | E-mail válido, normalizado para minúsculas |
| `senha` | string | Sim | Mínimo 1 caractere |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Login realizado com sucesso.",
  "dados": {
    "accessToken": "token.jwt",
    "refreshToken": "refresh.jwt"
  }
}
```

---

## **POST** /autenticacao/atualizar-token

**Descrição:** renova a sessão do usuário.

Este endpoint recebe um `refreshToken` válido, revoga o token antigo e retorna um novo par de tokens. Ele serve para manter o usuário logado sem exigir novo login a cada expiração do `accessToken`.

**Autenticação:** pública.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `refreshToken` | string | Sim | Token não vazio |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Sessão renovada com sucesso.",
  "dados": {
    "accessToken": "novo-token.jwt",
    "refreshToken": "novo-refresh.jwt"
  }
}
```

---

## **GET** /autenticacao/usuario-atual

**Descrição:** retorna os dados do usuário autenticado.

Este endpoint permite que o frontend descubra quem é o usuário da sessão atual. Ele é útil ao abrir a aplicação, restaurar sessão e montar a área autenticada.

**Autenticação:** obrigatória.

**Headers**

```http
Authorization: Bearer <accessToken>
```

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Usuário autenticado encontrado.",
  "dados": {
    "usuario": {
      "id": "usuario-id",
      "nome": "Nome do Usuário",
      "nickname": "nickname",
      "email": "usuario@email.com",
      "papel": "ALUNO",
      "status": "ATIVO"
    }
  }
}
```

---

## **POST** /autenticacao/sair

**Descrição:** encerra a sessão atual.

Este endpoint revoga o `refreshToken` informado. Ele serve para impedir que a sessão encerrada gere novos `accessTokens` no futuro.

**Autenticação:** obrigatória.

**Headers**

```http
Authorization: Bearer <accessToken>
```

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `refreshToken` | string | Sim | Token não vazio |

**Resposta de sucesso — 204**

Sem corpo de resposta.

---

## **POST** /autenticacao/recuperar-senha

**Descrição:** solicita recuperação de senha.

Este endpoint recebe o email do usuário e dispara o fluxo de recuperação de senha. Ele é usado quando o usuário esquece a senha e precisa receber instruções para redefini-la.

**Autenticação:** pública.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `email` | string | Sim | E-mail válido, normalizado para minúsculas |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Instruções de recuperação de senha enviadas.",
  "dados": null
}
```

---

## **POST** /autenticacao/redefinir-senha

**Descrição:** redefine a senha do usuário.

Este endpoint recebe o token de recuperação e a nova senha. Ele conclui o fluxo de recuperação, invalidando o token usado e salvando a nova senha.

**Autenticação:** pública.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `token` | string | Sim | Token não vazio |
| `senha` | string | Sim | Mínimo 8 caracteres |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Senha redefinida com sucesso.",
  "dados": null
}
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
