# API de Listas

Os endpoints de listas gerenciam a experiência de estudo por meio de listas de questões, incluindo criação, compartilhamento e estatísticas.

Eles permitem que professores e alunos organizem conteúdos, vinculem turmas e gerem material de apoio.

---

### **POST** /api/v1/lista

**Descrição:** cria lista.

Este endpoint cria uma nova lista de estudo gerenciada pelo professor ou aluno.

**Autenticação:** requerida.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Sim | 3 a 100 caracteres |
| `descricao` | string | Não | 0 a 500 caracteres |
| `tema` | string | Não | ID do tema |
| `visibilidade` | string | Não | PRIVADA, PUBLICA (padrão: PRIVADA) |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Lista criada com sucesso.",
  "dados": {
    "id": "lista-1",
    "nome": "Lista de Anatomia",
    "descricao": "Preparação para prova",
    "tema": "Anatomia",
    "criador": "Prof. João",
    "quantidadeQuestoes": 0,
    "visibilidade": "PRIVADA",
    "criadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **GET** /api/v1/lista

**Descrição:** lista listas do usuário.

Este endpoint retorna as listas criadas ou compartilhadas com o usuário.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |
| `ordenarPor` | string | Não | data, nome, tema |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Listas listadas com sucesso.",
  "dados": [
    {
      "id": "lista-1",
      "nome": "Lista de Anatomia",
      "descricao": "Preparação para prova",
      "tema": "Anatomia",
      "criador": "Prof. João",
      "quantidadeQuestoes": 15,
      "visibilidade": "PRIVADA",
      "criadoEm": "2026-05-01T10:30:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 10,
    "totalPaginas": 1
  }
}
```

---

### **GET** /api/v1/lista/turma/:turmaId

**Descrição:** lista listas por turma.

Este endpoint retorna as listas vinculadas a uma turma específica.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `turmaId` | string | Sim |

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Listas da turma listadas com sucesso.",
  "dados": [
    {
      "id": "lista-1",
      "nome": "Lista de Anatomia",
      "quantidadeQuestoes": 15,
      "vínculoEm": "2026-05-01T10:30:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 5,
    "totalPaginas": 1
  }
}
```

---

### **PATCH** /api/v1/lista/:id

**Descrição:** atualiza lista.

Este endpoint atualiza os dados de uma lista existente.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Não | 3 a 100 caracteres |
| `descricao` | string | Não | 0 a 500 caracteres |
| `tema` | string | Não | ID do tema |
| `visibilidade` | string | Não | PRIVADA, PUBLICA |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Lista atualizada com sucesso.",
  "dados": {
    "id": "lista-1",
    "nome": "Lista de Anatomia",
    "visibilidade": "PUBLICA",
    "atualizadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **POST** /api/v1/lista/:id/questoes

**Descrição:** vincula questões à lista.

Este endpoint adiciona uma ou mais questões a uma lista de estudo.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `questoes` | array | Sim | Array de IDs de questões |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Questões vinculadas à lista com sucesso.",
  "dados": {
    "listaId": "lista-1",
    "questoesAdicionadas": 3,
    "totalQuestoes": 18
  }
}
```

---

### **PATCH** /api/v1/lista/:id/questoes/ordem

**Descrição:** reordena questões da lista.

Este endpoint reorganiza a ordem das questões em uma lista.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `ordens` | array | Sim | Array com `{questaoId, ordem}` |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Ordem das questões atualizada com sucesso.",
  "dados": {
    "listaId": "lista-1",
    "questoesReordenadas": 15
  }
}
```

---

### **DELETE** /api/v1/lista/:id/questoes/:questaoId

**Descrição:** desvincula questão da lista.

Este endpoint remove uma questão de uma lista.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |
| `questaoId` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.

---

### **POST** /api/v1/lista/:id/turmas

**Descrição:** vincula turmas à lista.

Este endpoint compartilha uma lista com uma ou mais turmas.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `turmas` | array | Sim | Array de IDs de turmas |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Turmas vinculadas à lista com sucesso.",
  "dados": {
    "listaId": "lista-1",
    "turmasAdicionadas": 2,
    "totalTurmas": 5
  }
}
```

---

### **DELETE** /api/v1/lista/:id/turmas/:turmaId

**Descrição:** desvincula turma da lista.

Este endpoint remove uma turma de uma lista compartilhada.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |
| `turmaId` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.

---

### **GET** /api/v1/lista/:id/estatisticas/turma/:turmaId

**Descrição:** estatísticas de lista por turma.

Este endpoint retorna o desempenho da turma na lista, incluindo acertos, erros e tempo médio.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |
| `turmaId` | string | Sim |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Estatísticas da lista obtidas com sucesso.",
  "dados": {
    "listaId": "lista-1",
    "turmaId": "turma-1",
    "totalQuestoes": 15,
    "totalAlunos": 30,
    "acertos": 300,
    "erros": 150,
    "percentualAcerto": 66.67,
    "tempoMedioResposta": 25,
    "ultimaAtualização": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **GET** /api/v1/lista/:id

**Descrição:** busca lista por id.

Este endpoint retorna os detalhes de uma lista específica, incluindo suas questões.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Lista obtida com sucesso.",
  "dados": {
    "id": "lista-1",
    "nome": "Lista de Anatomia",
    "descricao": "Preparação para prova",
    "tema": "Anatomia",
    "criador": "Prof. João",
    "quantidadeQuestoes": 15,
    "visibilidade": "PRIVADA",
    "questoes": [
      {
        "id": "questao-1",
        "enunciado": "Qual é o maior osso do corpo humano?",
        "ordem": 1
      }
    ],
    "criadoEm": "2026-05-01T10:30:00.000Z"
  }
}
```

---

### **DELETE** /api/v1/lista/:id

**Descrição:** deleta lista.

Este endpoint remove uma lista do sistema.

**Autenticação:** requerida (criador/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.

---

### **GET** /api/v1/lista/:id/pdf

**Descrição:** baixa PDF da lista.

Este endpoint gera e retorna um PDF com todas as questões da lista para impressão ou download.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `comResposta` | boolean | Não | Incluir gabarito no PDF (padrão: false) |

**Resposta de sucesso — 200**

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="lista-1.pdf"
[Arquivo PDF]
```

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 25/05/2026 | 1.0 | Criação da documentação dos endpoints da API de Listas | [Caio Santos](https://github.com/caiobsantos) |