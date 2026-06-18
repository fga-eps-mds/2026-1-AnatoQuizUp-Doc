# API da Loja Virtual

Os endpoints da Loja Virtual permitem que alunos visualizem itens cosméticos disponíveis, comprem itens usando moedas ATP e consultem os itens já adquiridos no próprio inventário.

O domínio da loja pertence ao **Quiz-Service**, pois a carteira de moedas e o registro de transações também pertencem a esse serviço. A API é exposta publicamente pelo BFF em `/api/v1/loja/*`.

**Acesso:** papel **ALUNO** (autenticação requerida).

Os itens da loja possuem um dos seguintes tipos (categorias):

* `ICONE_PERFIL` — ícone de perfil do aluno.
* `MOLDURA` — moldura (anel decorativo) do ícone de perfil.
* `AVATAR` — avatar pronto (modelo fixo, sem customização de peças).
* `TITULO` — título exibido em destaque no perfil.
* `PLANO_FUNDO` — cor ou textura de fundo do perfil.

Cada item tem `precoMoedas` (em ATP), imagens opcionais (`imagemUrl`/`previewImagemUrl`) e um campo
`valor` opcional usado pelos itens de `PLANO_FUNDO` para guardar a cor (hex) ou o gradiente CSS
(`null` nos demais tipos).

---

### **GET** /api/v1/loja/catalogo

**Descrição:** lista os itens ativos disponíveis na Loja Virtual.

Este endpoint retorna o catálogo paginado de itens cosméticos disponíveis para compra. Para cada item, o campo `adquirido` indica se o aluno autenticado já possui aquele item no inventário.

**Query params**

| Campo   | Tipo   | Obrigatório | Regra                                                                       |
| ------- | ------ | ----------- | --------------------------------------------------------------------------- |
| `tipo`  | string | Não         | Filtra por categoria: `ICONE_PERFIL`, `MOLDURA`, `AVATAR`, `TITULO` ou `PLANO_FUNDO` |
| `page`  | number | Não         | Página (≥ 1)                                                                |
| `limit` | number | Não         | Itens por página (1 a 100)                                                  |

**Resposta de sucesso — 200**

```json
{
  "dados": [
    {
      "id": "cmqg1mxvh0001sf71omb6hrch",
      "codigo": "icone-coruja",
      "nome": "Coruja",
      "descricao": "Para os estudiosos de plantão.",
      "tipo": "ICONE_PERFIL",
      "precoMoedas": 60,
      "valor": null,
      "imagemUrl": "https://api.iconify.design/game-icons/owl.svg?color=%23ffffff",
      "previewImagemUrl": "https://api.iconify.design/game-icons/owl.svg?color=%23ffffff",
      "ativo": true,
      "adquirido": false
    }
  ],
  "metadados": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "totalPages": 2
  }
}
```

---

### **GET** /api/v1/loja/meu-inventario

**Descrição:** lista os itens adquiridos pelo aluno autenticado.

Este endpoint retorna o inventário do aluno, contendo os itens comprados na Loja Virtual. O campo `equipado` indica se o item está marcado como equipado.

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
      "adquiridoEm": "2026-06-17T02:54:49.422Z",
      "item": {
        "id": "cmqg1mxvh0001sf71omb6hrch",
        "codigo": "icone-coruja-sabia",
        "nome": "Coruja Sábia",
        "descricao": "Ícone de perfil para os estudiosos de plantão.",
        "tipo": "ICONE_PERFIL",
        "precoMoedas": 1,
        "valor": null,
        "imagemUrl": "https://api.dicebear.com/9.x/icons/svg?seed=coruja&backgroundColor=b6e3f4",
        "previewImagemUrl": "https://api.dicebear.com/9.x/icons/svg?seed=coruja&backgroundColor=b6e3f4",
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

### **POST** /api/v1/loja/comprar

**Descrição:** compra um item da Loja Virtual.

Este endpoint compra um item usando moedas ATP do aluno autenticado. A compra debita o valor do item da carteira, adiciona o item ao inventário e registra uma transação de moedas com fonte `COMPRA_ITEM` e quantidade negativa.

A operação impede compra duplicada do mesmo item pelo mesmo aluno.

**Body**

| Campo        | Tipo   | Obrigatório | Regra                                |
| ------------ | ------ | ----------- | ------------------------------------ |
| `itemLojaId` | string | Sim         | ID do item da loja que será comprado |

**Exemplo de requisição**

```json
{
  "itemLojaId": "cmqg1mxvh0001sf71omb6hrch"
}
```

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Item comprado com sucesso.",
  "saldoMoedas": 4999,
  "item": {
    "id": "cmqg1u0ct0000sf9rddpaq099",
    "equipado": false,
    "adquiridoEm": "2026-06-17T02:54:49.422Z",
    "item": {
      "id": "cmqg1mxvh0001sf71omb6hrch",
      "codigo": "icone-coruja",
      "nome": "Coruja",
      "descricao": "Para os estudiosos de plantão.",
      "tipo": "ICONE_PERFIL",
      "precoMoedas": 60,
      "valor": null,
      "imagemUrl": "https://api.iconify.design/game-icons/owl.svg?color=%23ffffff",
      "previewImagemUrl": "https://api.iconify.design/game-icons/owl.svg?color=%23ffffff",
      "ativo": true
    }
  }
}
```

**Erros esperados**

| Código HTTP | Código de erro        | Situação                                                      |
| ----------- | --------------------- | ------------------------------------------------------------- |
| 400         | `ERRO_DE_VALIDACAO`   | Body inválido ou `itemLojaId` ausente                         |
| 401         | `NAO_AUTORIZADO`      | Usuário não autenticado                                       |
| 403         | `ACESSO_NEGADO`       | Usuário sem papel permitido                                   |
| 404         | `NAO_ENCONTRADO`      | Item não encontrado                                           |
| 409         | `CONFLITO`            | Item já adquirido pelo aluno                                  |
| 422         | `REQUISICAO_INVALIDA` | Item indisponível para compra ou saldo de moedas insuficiente |

**Exemplo — item já adquirido**

```json
{
  "erro": {
    "codigo": "CONFLITO",
    "mensagem": "Este item ja foi adquirido pelo aluno."
  }
}
```

**Exemplo — item inexistente**

```json
{
  "erro": {
    "codigo": "NAO_ENCONTRADO",
    "mensagem": "Item nao encontrado."
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

* Apenas usuários com papel `ALUNO` podem acessar a Loja Virtual.
* O catálogo retorna apenas itens ativos e não excluídos logicamente.
* O aluno pode filtrar o catálogo por tipo (categoria).
* O campo `adquirido` no catálogo indica se o aluno autenticado já possui o item.
* A compra exige saldo suficiente na carteira de moedas do aluno.
* Ao comprar um item, o saldo da carteira é debitado conforme `precoMoedas`.
* O item comprado é adicionado ao inventário do aluno.
* A compra gera uma transação em `TransacaoMoeda` com fonte `COMPRA_ITEM` e quantidade negativa.
* O aluno não pode comprar o mesmo item mais de uma vez.
* A compra de item inexistente retorna `404`.
* A tentativa de compra duplicada retorna `409`.

---

## Pendências (próxima iteração)

* **`PATCH /api/v1/loja/inventario/:id/equipar`** — equipar/desequipar um item do inventário
  (apenas um equipado por tipo) e refletir o cosmético equipado no perfil do aluno. O modelo já
  contém o campo `equipado` em `InventarioItem`; a implementação do endpoint de equipar e da
  exibição no perfil ficará a cargo da equipe responsável pela personalização do perfil.

---

## Histórico de Versão

| Data       | Versão | Descrição                                                       | Autor(es)                                     |
| ---------- | ------ | --------------------------------------------------------------- | --------------------------------------------- |
| 16/06/2026 | 1.0    | Criação da documentação dos endpoints da Loja Virtual de Avatar | [Caio Santos](https://github.com/caiobsantos) |
| 17/06/2026 | 2.0    | Generaliza a loja para cosméticos (ícones, avatares, títulos, planos de fundo); renomeia para `/api/v1/loja`, modelo `ItemLoja` e tipos `TipoItemLoja`; remove raridade; adiciona `valor` | Equipe AnatoQuizUp |
| 18/06/2026 | 2.1    | Adiciona categoria `MOLDURA`; preços diversificados por item; ícones de anatomia (Iconify) | Equipe AnatoQuizUp |
