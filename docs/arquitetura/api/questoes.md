# API de Questões

Os endpoints de questões permitem o professor gerenciar o banco de perguntas do sistema, incluindo criação, atualização, busca e exclusão.

Eles são destinados principalmente a usuários com papel `PROFESSOR` ou `ADMINISTRADOR`.

---

### **POST** /api/v1/questoes

**Descrição:** cria uma questão.

Este endpoint cria uma nova questão no sistema com imagem opcional, alternativas e gabarito.

**Autenticação:** requerida (professor/admin).

**Body** (multipart/form-data)

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `enunciado` | string | Sim | 10 a 500 caracteres |
| `tema` | string | Sim | ID do tema válido |
| `dificuldade` | string | Sim | FACIL, MEDIA, DIFICIL |
| `alternativas[0][texto]` | string | Sim | Texto da alternativa (mín 2, máx 4) |
| `alternativas[0][correta]` | boolean | Sim | Apenas uma deve ser true |
| `imagem` | file | Não | JPG, PNG, WebP ou GIF (máx 5MB) |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Questão criada com sucesso.",
  "dados": {
    "id": "questao-1",
    "enunciado": "Qual é o maior osso do corpo humano?",
    "tema": "Anatomia",
    "dificuldade": "FACIL",
    "alternativas": [
      {
        "id": "alt-1",
        "texto": "Fêmur",
        "correta": true,
        "ordem": 1
      }
    ],
    "imagemUrl": "https://api.exemplo.com/questoes/1/imagem.jpg",
    "criadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **GET** /api/v1/questoes/busca

**Descrição:** busca questões filtradas.

Este endpoint retorna questões do sistema com diversos filtros, útil para professores buscarem questões para suas listas.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `termo` | string | Não | Texto para buscar no enunciado |
| `tema` | string | Não | ID do tema |
| `dificuldade` | string | Não | FACIL, MEDIA, DIFICIL |
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |
| `ordenarPor` | string | Não | data, dificuldade, tema |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Questões listadas com sucesso.",
  "dados": [
    {
      "id": "questao-1",
      "enunciado": "Qual é o maior osso do corpo humano?",
      "tema": "Anatomia",
      "dificuldade": "FACIL",
      "alternativas": 4,
      "imagemUrl": null,
      "criadoEm": "2026-05-25T10:30:00.000Z",
      "professor": "Professor Nome"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 50,
    "totalPaginas": 3
  }
}
```

---

### **GET** /api/v1/questoes

**Descrição:** lista questões.

Este endpoint retorna uma lista paginada de questões do sistema.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Questões listadas com sucesso.",
  "dados": [
    {
      "id": "questao-1",
      "enunciado": "Qual é o maior osso do corpo humano?",
      "tema": "Anatomia",
      "dificuldade": "FACIL",
      "alternativas": 4
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 200,
    "totalPaginas": 10
  }
}
```

---

### **GET** /api/v1/questoes/:id

**Descrição:** busca questão por id.

Este endpoint retorna os detalhes completos de uma questão específica.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Questão obtida com sucesso.",
  "dados": {
    "id": "questao-1",
    "enunciado": "Qual é o maior osso do corpo humano?",
    "tema": "Anatomia",
    "dificuldade": "FACIL",
    "alternativas": [
      {
        "id": "alt-1",
        "texto": "Fêmur",
        "correta": true,
        "ordem": 1
      },
      {
        "id": "alt-2",
        "texto": "Úmero",
        "correta": false,
        "ordem": 2
      }
    ],
    "imagemUrl": "https://api.exemplo.com/questoes/1/imagem.jpg",
    "professor": "Professor Nome",
    "criadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **PUT** /api/v1/questoes/:id

**Descrição:** atualiza questão.

Este endpoint atualiza os dados de uma questão existente, incluindo possibilidade de alterar imagem.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body** (multipart/form-data)

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `enunciado` | string | Não | 10 a 500 caracteres |
| `tema` | string | Não | ID do tema válido |
| `dificuldade` | string | Não | FACIL, MEDIA, DIFICIL |
| `alternativas[0][id]` | string | Não | ID da alternativa (para atualizações) |
| `alternativas[0][texto]` | string | Não | Novo texto |
| `alternativas[0][correta]` | boolean | Não | Apenas uma deve ser true |
| `imagem` | file | Não | JPG, PNG, WebP ou GIF (máx 5MB) |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Questão atualizada com sucesso.",
  "dados": {
    "id": "questao-1",
    "enunciado": "Qual é o maior osso do corpo humano?",
    "tema": "Anatomia",
    "dificuldade": "FACIL",
    "atualizadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **DELETE** /api/v1/questoes/:id

**Descrição:** remove questão.

Este endpoint deleta uma questão do sistema.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.
