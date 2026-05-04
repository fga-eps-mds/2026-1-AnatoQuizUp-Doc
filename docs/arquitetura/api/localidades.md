# API de Localidades

## Objetivo

Os endpoints de localidades fornecem estados e cidades brasileiras usados no cadastro de alunos.

Eles evitam que o frontend mantenha listas próprias e garantem que os valores selecionados pelo usuário sejam compatíveis com as validações do backend.

---

## **GET** /auth/localidades/estados

**Descrição:** lista estados brasileiros.

Este endpoint retorna os estados aceitos pelo backend, com sigla e nome. Ele é usado para preencher o campo de estado no cadastro.

**Autenticação:** pública.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Estados listados com sucesso.",
  "dados": [
    {
      "sigla": "DF",
      "nome": "Distrito Federal"
    }
  ]
}
```

---

## **GET** /auth/localidades/estados/:uf/cidades

**Descrição:** lista cidades de um estado.

Este endpoint recebe uma UF e retorna as cidades associadas a ela. Ele é usado no cadastro depois que o usuário escolhe um estado.

**Autenticação:** pública.

**Path params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `uf` | string | Sim | UF brasileira válida |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Cidades listadas com sucesso.",
  "dados": [
    {
      "nome": "Brasília",
      "uf": "DF"
    }
  ]
}
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
