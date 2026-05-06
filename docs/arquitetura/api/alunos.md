# API de Alunos

## Objetivo

Os endpoints de alunos atendem o fluxo de cadastro e consulta de dados auxiliares usados nos formulários.

Eles permitem registrar um aluno, validar disponibilidade de email e nickname e carregar opções usadas na interface de cadastro.

---

## **POST** /autenticacao/cadastro

**Descrição:** cadastra um novo aluno.

Este endpoint cria a conta de um aluno com os dados pessoais, acadêmicos e credenciais de acesso. Ele é usado no formulário de cadastro da aplicação.

**Autenticação:** pública.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Sim | 1 a 120 caracteres |
| `nickname` | string | Sim | Começa com letra, usa letras minúsculas, números e `_` |
| `email` | string | Sim | E-mail válido |
| `senha` | string | Sim | Mínimo 8 caracteres |
| `confirmacaoSenha` | string | Sim | Deve ser igual a `senha` |
| `instituicao` | string | Sim | 1 a 160 caracteres |
| `curso` | string | Sim | 1 a 120 caracteres |
| `periodo` | string | Sim | 1 a 40 caracteres |
| `dataNascimento` | string | Sim | Formato `yyyy-mm-dd` |
| `nacionalidade` | string | Sim | 1 a 80 caracteres |
| `estado` | string | Sim | UF brasileira válida |
| `cidade` | string | Sim | 1 a 100 caracteres |
| `escolaridade` | string | Sim | Valor aceito pelo backend |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Usuário cadastrado com sucesso.",
  "dados": {
    "id": "aluno-id",
    "nome": "Nome do Aluno",
    "nickname": "aluno_1",
    "email": "aluno@email.com",
    "papel": "ALUNO",
    "status": "ATIVO"
  }
}
```

---

## **GET** /autenticacao/alunos/nickname-disponivel

**Descrição:** verifica se um nickname pode ser usado.

Este endpoint consulta se já existe usuário usando o nickname informado. Ele é usado no cadastro para evitar submissão com nickname duplicado.

**Autenticação:** pública.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nickname` | string | Sim | Mesmo formato do cadastro |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Nickname disponível.",
  "dados": {
    "nickname": "aluno_1",
    "disponivel": true
  }
}
```

---

## **GET** /autenticacao/alunos/email-disponivel

**Descrição:** verifica se um email pode ser usado.

Este endpoint consulta se já existe usuário cadastrado com o email informado. Ele é usado no cadastro para orientar o usuário antes de enviar o formulário completo.

**Autenticação:** pública.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `email` | string | Sim | E-mail válido |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Email disponível.",
  "dados": {
    "email": "aluno@email.com",
    "disponivel": true
  }
}
```

---

## **GET** /autenticacao/alunos/nacionalidades

**Descrição:** lista nacionalidades disponíveis para cadastro.

Este endpoint retorna uma lista de nacionalidades usadas para preencher o campo de nacionalidade no formulário de cadastro.

**Autenticação:** pública.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Nacionalidades listadas com sucesso.",
  "dados": ["Brasileira"]
}
```

---

## **GET** /autenticacao/alunos/opcoes-academicas

**Descrição:** lista opções acadêmicas usadas no cadastro.

Este endpoint retorna listas de escolaridades, instituições, cursos e períodos. Ele centraliza as opções aceitas pelo backend para reduzir divergência entre frontend e API.

**Autenticação:** pública.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Opções acadêmicas listadas com sucesso.",
  "dados": {
    "escolaridades": [],
    "instituicoes": [],
    "cursos": [],
    "periodos": [],
    "naoSeAplica": "Não se aplica"
  }
}
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
