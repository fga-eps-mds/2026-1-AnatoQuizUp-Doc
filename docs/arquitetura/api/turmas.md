# API de Turmas

Os endpoints de turmas gerenciam a criação, edição, listagem e associação de alunos a turmas.

Eles são usados por professores, administradores e alunos que fazem parte das turmas.

**Acesso por papel (aplicado no service):**

- **ALUNO** vê apenas turmas em que está vinculado e com status `ATIVA`. A query `?status=` é **rejeitada com 400** para o aluno, e o acesso a uma turma sem vínculo retorna **404** (não vaza a existência da turma).
- **PROFESSOR** vê e gerencia apenas as turmas que criou.
- **ADMINISTRADOR** vê todas as turmas.

> Os exemplos de payload abaixo são ilustrativos; a paginação segue o padrão `{ "dados": [...], "metadados": { "page", "limit", "total", "totalPages" } }` descrito em [Visão Geral da API](visao-geral.md).

---

### **GET** /api/v1/turmas

**Descrição:** lista turmas.

Este endpoint retorna as turmas do usuário (ou todas se admin), permitindo filtrar e paginar.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `busca` | string | Não | Filtra por nome ou código da turma |
| `semestre` | string | Não | Filtra por semestre |
| `ano` | number | Não | Filtra por ano |
| `status` | string | Não | `ATIVA` ou `INATIVA` (apenas PROFESSOR/ADMINISTRADOR; rejeitado com 400 para ALUNO) |
| `page` | number | Não | Número da página (padrão: 1) |
| `limit` | number | Não | Itens por página |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Turmas listadas com sucesso.",
  "dados": [
    {
      "id": "turma-1",
      "nome": "Anatomia - Turma A",
      "descricao": "Primeira turma de anatomia",
      "professor": "Prof. João",
      "quantidadeAlunos": 30,
      "criadoEm": "2026-05-01T10:30:00.000Z"
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

### **GET** /api/v1/turmas/:id

**Descrição:** busca turma por id.

Este endpoint retorna os detalhes de uma turma específica.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Turma obtida com sucesso.",
  "dados": {
    "id": "turma-1",
    "nome": "Anatomia - Turma A",
    "descricao": "Primeira turma de anatomia",
    "professor": "Prof. João",
    "professorId": "prof-1",
    "quantidadeAlunos": 30,
    "status": "ATIVA",
    "criadoEm": "2026-05-01T10:30:00.000Z"
  }
}
```

---

### **POST** /api/v1/turmas

**Descrição:** cria turma.

Este endpoint cria uma nova turma gerenciada pelo professor logado.

**Autenticação:** requerida (professor/admin).

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Sim | 3 a 100 caracteres |
| `descricao` | string | Não | 0 a 500 caracteres |
| `codigo` | string | Sim | 4 a 10 caracteres, único |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Turma criada com sucesso.",
  "dados": {
    "id": "turma-1",
    "nome": "Anatomia - Turma A",
    "descricao": "Primeira turma de anatomia",
    "codigo": "ANAT001",
    "professor": "Prof. João",
    "status": "ATIVA",
    "criadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **GET** /api/v1/turmas/:id/alunos

**Descrição:** lista alunos da turma.

Este endpoint retorna os alunos vinculados a uma turma específica.

**Autenticação:** requerida.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Alunos da turma listados com sucesso.",
  "dados": [
    {
      "id": "aluno-1",
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "nickname": "joao_silva",
      "vínculoEm": "2026-05-01T10:30:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 30,
    "totalPaginas": 2
  }
}
```

---

### **POST** /api/v1/turmas/:id/alunos

**Descrição:** vincula aluno à turma.

Este endpoint adiciona um aluno a uma turma.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `alunoId` | string | Sim | ID do aluno a vincular |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Aluno vinculado à turma com sucesso.",
  "dados": {
    "turmaId": "turma-1",
    "alunoId": "aluno-1",
    "nome": "João Silva",
    "vínculoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **DELETE** /api/v1/turmas/:id/alunos/:alunoId

**Descrição:** desvincula aluno da turma.

Este endpoint remove um aluno da turma.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |
| `alunoId` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.

---

### **PATCH** /api/v1/turmas/:id

**Descrição:** atualiza turma.

Este endpoint atualiza os dados de uma turma.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `nome` | string | Não | 3 a 100 caracteres |
| `descricao` | string | Não | 0 a 500 caracteres |
| `status` | string | Não | ATIVA, INATIVA |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Turma atualizada com sucesso.",
  "dados": {
    "id": "turma-1",
    "nome": "Anatomia - Turma A",
    "status": "ATIVA",
    "atualizadoEm": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **DELETE** /api/v1/turmas/:id

**Descrição:** deleta turma.

Este endpoint remove uma turma do sistema.

**Autenticação:** requerida (professor/admin).

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim |

**Resposta de sucesso — 204**

Sem corpo de resposta.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 25/05/2026 | 1.0 | Criação da documentação dos endpoints da API de Turmas | [Caio Santos](https://github.com/caiobsantos) |
| 02/06/2026 | 1.1 | Correção dos query params (`busca`, `semestre`, `ano`, `status`, `page`, `limit`), do enum de status (`ATIVA`/`INATIVA`) e inclusão das regras de acesso por papel | [Miguel Moreira](https://github.com/EhOMiguel) |