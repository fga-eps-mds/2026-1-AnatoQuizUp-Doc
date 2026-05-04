# API de Exemplos

## Objetivo

Os endpoints de exemplos servem como referência inicial de CRUD simples na API.

Eles ajudam a validar estrutura de rotas, paginação, validação de entrada e formato de resposta. Também podem ser usados como base para novos módulos de domínio.

---

## **POST** /exemplos

**Descrição:** cria um exemplo.

Este endpoint cadastra um registro simples com nome e descrição opcional. Ele serve como modelo de endpoint de criação usando validação de body e resposta padronizada.

**Autenticação:** obrigatória.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Sim | 3 a 120 caracteres |
| `descricao` | string | Não | Até 500 caracteres |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Exemplo criado com sucesso.",
  "dados": {
    "id": "exemplo-id",
    "nome": "Questão introdutória",
    "descricao": "Primeiro registro da API",
    "createdAt": "2026-05-04T00:00:00.000Z",
    "updatedAt": "2026-05-04T00:00:00.000Z"
  }
}
```

---

## **GET** /exemplos

**Descrição:** lista exemplos cadastrados.

Este endpoint retorna exemplos em formato paginado. Ele demonstra o contrato usado em listagens da API.

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
      "id": "exemplo-id",
      "nome": "Questão introdutória",
      "descricao": "Primeiro registro da API",
      "createdAt": "2026-05-04T00:00:00.000Z",
      "updatedAt": "2026-05-04T00:00:00.000Z"
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

## **GET** /exemplos/:id

**Descrição:** busca um exemplo pelo id.

Este endpoint retorna um registro específico. Ele serve como modelo para buscas por identificador em módulos futuros.

**Autenticação:** obrigatória.

**Path params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | Id não vazio |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Exemplo encontrado.",
  "dados": {
    "id": "exemplo-id",
    "nome": "Questão introdutória",
    "descricao": "Primeiro registro da API",
    "createdAt": "2026-05-04T00:00:00.000Z",
    "updatedAt": "2026-05-04T00:00:00.000Z"
  }
}
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
