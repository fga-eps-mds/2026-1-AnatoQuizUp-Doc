# API da Loja Virtual

Os endpoints da Loja Virtual de Avatar permitem que alunos visualizem itens cosméticos disponíveis, comprem itens usando moedas ATP e consultem os itens já adquiridos no próprio inventário.

O domínio da loja pertence ao **Quiz-Service**, pois a carteira de moedas e o registro de transações também pertencem a esse serviço. A API é exposta publicamente pelo BFF em `/api/v1/avatarLoja/*`.

**Acesso:** papel **ALUNO** (autenticação requerida).

Os itens da loja podem possuir os seguintes tipos:

* `CABELO`
* `ROUPA`
* `JALECO`
* `OCULOS`
* `ACESSORIO`
* `CALCADO`
* `OUTRO`

As raridades disponíveis são:

* `COMUM`
* `RARO`
* `EPICO`
* `LENDARIO`

---

### **GET** /api/v1/avatarLoja/catalogo

**Descrição:** lista os itens ativos disponíveis na Loja Virtual de Avatar.

Este endpoint retorna o catálogo paginado de itens cosméticos disponíveis para compra. Para cada item, o campo `adquirido` indica se o aluno autenticado já possui aquele item no inventário.

**Query params**

| Campo      | Tipo   | Obrigatório | Regra                                                                                             |
| ---------- | ------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `tipo`     | string | Não         | Filtra por tipo do item: `CABELO`, `ROUPA`, `JALECO`, `OCULOS`, `ACESSORIO`, `CALCADO` ou `OUTRO` |
| `raridade` | string | Não         | Filtra por raridade: `COMUM`, `RARO`, `EPICO` ou `LENDARIO`                                       |
| `page`     | number | Não         | Página (≥ 1)                                                                                      |
| `limit`    | number | Não         | Itens por página (1 a 100)                                                                        |

**Resposta de sucesso — 200**

```json
{
  "dados": [
    {
      "id": "cmqg1mxvh0001sf71omb6hrch",
      "codigo": "cabelo-curto-classico",
      "nome": "Cabelo Curto Clássico",
      "descricao": "Um corte simples e elegante para o avatar.",
      "tipo": "CABELO",
      "raridade": "COMUM",
      "precoMoedas": 100,
      "imagemUrl": null,
      "previewImagemUrl": null,
      "ativo": true,
      "adquirido": false
    }
  ],
  "metadados": {
    "page": 1,
    "limit": 10,
    "total": 14,
    "totalPages": 2
  }
}
```

---

### **GET** /api/v1/avatarLoja/meu-inventario

**Descrição:** lista os itens de avatar adquiridos pelo aluno autenticado.

Este endpoint retorna o inventário do aluno, contendo os itens comprados na Loja Virtual de Avatar. O campo `equipado` indica se o item está marcado como equipado no inventário.

**Query params**

| Campo   | Tipo   | Obrigatório | Regra                      |
| ------- | ------ | ----------- | -------------------------- |
| `page`  | number | Não         | Página (≥ 1)               |
| `limit` | number | Não         | Itens por página (1 a 100) |

**Resposta de sucesso — 200**

```json
{
  "dados": [
    {
      "id": "cmqg1u0ct0000sf9rddpaq099",
      "equipado": false,
      "adquiridoEm": "2026-06-16T02:54:49.422Z",
      "item": {
        "id": "cmqg1mxvh0001sf71omb6hrch",
        "codigo": "cabelo-curto-classico",
        "nome": "Cabelo Curto Clássico",
        "descricao": "Um corte simples e elegante para o avatar.",
        "tipo": "CABELO",
        "raridade": "COMUM",
        "precoMoedas": 100,
        "imagemUrl": null,
        "previewImagemUrl": null,
        "ativo": true
      }
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

### **POST** /api/v1/avatarLoja/comprar

**Descrição:** compra um item da Loja Virtual de Avatar.

Este endpoint compra um item de avatar usando moedas ATP do aluno autenticado. A compra debita o valor do item da carteira, adiciona o item ao inventário e registra uma transação de moedas com fonte `COMPRA_ITEM_AVATAR` e quantidade negativa.

A operação impede compra duplicada do mesmo item pelo mesmo aluno.

**Body**

| Campo              | Tipo   | Obrigatório | Regra                                |
| ------------------ | ------ | ----------- | ------------------------------------ |
| `itemAvatarLojaId` | string | Sim         | ID do item da loja que será comprado |

**Exemplo de requisição**

```json
{
  "itemAvatarLojaId": "cmqg1mxvh0001sf71omb6hrch"
}
```

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Item de avatar comprado com sucesso.",
  "saldoMoedas": 4900,
  "item": {
    "id": "cmqg1u0ct0000sf9rddpaq099",
    "equipado": false,
    "adquiridoEm": "2026-06-16T02:54:49.422Z",
    "item": {
      "id": "cmqg1mxvh0001sf71omb6hrch",
      "codigo": "cabelo-curto-classico",
      "nome": "Cabelo Curto Clássico",
      "descricao": "Um corte simples e elegante para o avatar.",
      "tipo": "CABELO",
      "raridade": "COMUM",
      "precoMoedas": 100,
      "imagemUrl": null,
      "previewImagemUrl": null,
      "ativo": true
    }
  }
}
```

**Erros esperados**

| Código HTTP | Código de erro        | Situação                                                      |
| ----------- | --------------------- | ------------------------------------------------------------- |
| 400         | `ERRO_DE_VALIDACAO`   | Body inválido ou `itemAvatarLojaId` ausente                   |
| 401         | `NAO_AUTORIZADO`      | Usuário não autenticado                                       |
| 403         | `ACESSO_NEGADO`       | Usuário sem papel permitido                                   |
| 404         | `NAO_ENCONTRADO`      | Item de avatar não encontrado                                 |
| 409         | `CONFLITO`            | Item já adquirido pelo aluno                                  |
| 422         | `REQUISICAO_INVALIDA` | Item indisponível para compra ou saldo de moedas insuficiente |

**Exemplo — item já adquirido**

```json
{
  "erro": {
    "codigo": "CONFLITO",
    "mensagem": "Este item de avatar ja foi adquirido pelo aluno."
  }
}
```

**Exemplo — item inexistente**

```json
{
  "erro": {
    "codigo": "NAO_ENCONTRADO",
    "mensagem": "Item de avatar nao encontrado."
  }
}
```

**Exemplo — saldo insuficiente**

```json
{
  "erro": {
    "codigo": "REQUISICAO_INVALIDA",
    "mensagem": "Saldo de moedas insuficiente para comprar este item."
  }
}
```

---

## Regras de negócio

* Apenas usuários com papel `ALUNO` podem acessar a Loja Virtual de Avatar.
* O catálogo retorna apenas itens ativos e não excluídos logicamente.
* O aluno pode filtrar o catálogo por tipo e raridade.
* O campo `adquirido` no catálogo indica se o aluno autenticado já possui o item.
* A compra exige saldo suficiente na carteira de moedas do aluno.
* Ao comprar um item, o saldo da carteira é debitado conforme `precoMoedas`.
* O item comprado é adicionado ao inventário do aluno.
* A compra gera uma transação em `TransacaoMoeda` com fonte `COMPRA_ITEM_AVATAR` e quantidade negativa.
* O aluno não pode comprar o mesmo item mais de uma vez.
* A compra de item inexistente retorna `404`.
* A tentativa de compra duplicada retorna `409`.

---

## Histórico de Versão

| Data       | Versão | Descrição                                                       | Autor(es)                                     |
| ---------- | ------ | --------------------------------------------------------------- | --------------------------------------------- |
| 16/06/2026 | 1.0    | Criação da documentação dos endpoints da Loja Virtual de Avatar | [Caio Santos](https://github.com/caiobsantos) |
