# API de Amizade

Os endpoints de amizade permitem que alunos encontrem outros alunos, enviem e respondam convites de amizade, desfaçam vínculos e controlem a própria visibilidade na busca.

O domínio de amizade pertence ao **Usuario-Service** e é exposto publicamente pelo BFF em `/api/v1/amizade/*`.

**Acesso:** papéis **ALUNO** e **ADMINISTRADOR** (autenticação requerida).

O status de uma amizade pode ser `PENDENTE`, `ATIVO` ou `RECUSADO`.

---

### **GET** /api/v1/amizade

**Descrição:** lista os amigos do usuário autenticado (amizades com status `ATIVO`).

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Não | Filtra por nome |
| `nickname` | string | Não | Filtra por nickname |
| `page` | number | Não | Página (≥ 1) |
| `limit` | number | Não | Itens por página (1 a 100) |

**Resposta de sucesso — 200**

```json
{
  "dados": [
    {
      "id": "amizade-1",
      "usuarioOrigemId": "aluno-1",
      "usuarioDestinoId": "aluno-2",
      "statusAmizade": "ATIVO",
      "criadoEm": "2026-05-28T10:30:00.000Z",
      "amigo": {
        "id": "aluno-2",
        "nome": "Maria Souza",
        "nickname": "mari",
        "curso": "Medicina",
        "semestre": "3"
      }
    }
  ],
  "metadados": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

---

### **GET** /api/v1/amizade/busca

**Descrição:** busca possíveis amigos (outros alunos visíveis que ainda não são amigos).

**Query params:** mesmos de `GET /api/v1/amizade` (`nome`, `nickname`, `page`, `limit`).

**Resposta de sucesso — 200**

```json
{
  "dados": [
    { "id": "aluno-3", "nome": "Carlos Lima", "nickname": "carlinhos", "curso": "Medicina", "semestre": "5" }
  ],
  "metadados": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

---

### **POST** /api/v1/amizade

**Descrição:** envia uma solicitação de amizade para outro usuário.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | ID do usuário que receberá a solicitação |

**Resposta de sucesso — 200**

```json
{ "mensagem": "Solicitação enviada com sucesso", "solicitacao": { "id": "amizade-2", "statusAmizade": "PENDENTE" } }
```

---

### **GET** /api/v1/amizade/convites/recebidos

**Descrição:** lista os convites de amizade recebidos pelo usuário (status `PENDENTE`).

**Query params:** `nome`, `nickname`, `page`, `limit` (opcionais).

**Resposta de sucesso — 200:** lista paginada de amizades com os dados do solicitante (mesmo formato de `GET /api/v1/amizade`).

---

### **GET** /api/v1/amizade/convites/enviados

**Descrição:** lista os convites de amizade enviados pelo usuário e ainda pendentes.

**Query params:** `nome`, `nickname`, `page`, `limit` (opcionais).

**Resposta de sucesso — 200:** lista paginada (mesmo formato de `GET /api/v1/amizade`).

---

### **PATCH** /api/v1/amizade/aceitar

**Descrição:** aceita um convite de amizade recebido.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | ID do usuário que enviou o convite |

**Resposta de sucesso — 200**

```json
{ "mensagem": "Solicitação processada com sucesso" }
```

---

### **PATCH** /api/v1/amizade/recusar

**Descrição:** recusa um convite de amizade recebido.

**Body:** `{ "id": "<id-do-solicitante>" }`.

**Resposta de sucesso — 200**

```json
{ "mensagem": "Solicitação processada com sucesso" }
```

---

### **DELETE** /api/v1/amizade

**Descrição:** desfaz uma amizade existente.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `id` | string | Sim | ID do amigo a remover |

**Resposta de sucesso — 200**

```json
{ "mensagem": "Amizade desfeita com sucesso" }
```

---

### **PATCH** /api/v1/amizade/visibilidade

**Descrição:** altera a visibilidade do usuário na busca de amigos.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `visivel` | boolean | Sim | `true` torna o usuário visível na busca; `false` o oculta |

**Resposta de sucesso — 200**

```json
{ "mensagem": "Visibilidade alterada com sucesso" }
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação da documentação dos endpoints da API de Amizade | [Miguel Moreira](https://github.com/EhOMiguel) |
