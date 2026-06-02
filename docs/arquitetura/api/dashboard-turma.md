# API de Dashboard da Turma

Endpoints que agregam o desempenho de uma turma a partir das resoluções dos alunos vinculados. Pertencem ao **Quiz-Service** e são expostos publicamente pelo BFF em `/api/v1/turmasDashboard/*`.

**Acesso:** papéis **PROFESSOR** e **ADMINISTRADOR** (autenticação requerida).

A classificação de desempenho por tema segue: **Tranquilo** (taxa ≥ 70%), **Atenção** (≥ 40% e < 70%) e **Crítico** (< 40%).

---

### **GET** /api/v1/turmasDashboard/:id/macro

**Descrição:** retorna a visão agregada (macro) da turma: totais e desempenho médio por tema.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim (ID da turma) |

**Resposta de sucesso — 200**

```json
{
  "totalAlunos": 30,
  "totalQuestoesRespondidas": 540,
  "taxaMediaAcertos": 68,
  "desempenhoPorTema": [
    { "nome": "Tórax", "totalRespondidas": 300, "taxaAcerto": 74, "status": "Tranquilo" },
    { "nome": "Abdome", "totalRespondidas": 240, "taxaAcerto": 61, "status": "Atenção" }
  ]
}
```

Quando a turma não tem alunos ou resoluções, os totais voltam zerados e `desempenhoPorTema` vazio.

---

### **GET** /api/v1/turmasDashboard/:id/individual

**Descrição:** retorna o desempenho individual de cada aluno vinculado à turma.

**Path params**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `id` | string | Sim (ID da turma) |

**Resposta de sucesso — 200**

```json
{
  "alunos": [
    {
      "alunoId": "aluno-1",
      "totalRespondidas": 40,
      "totalAcertos": 32,
      "taxaAcerto": 80,
      "ultimaAtividade": "2026-05-30T18:20:00.000Z",
      "desempenhoPorTema": [
        { "nome": "Tórax", "totalRespondidas": 25, "taxaAcerto": 84, "status": "Tranquilo" },
        { "nome": "Abdome", "totalRespondidas": 15, "taxaAcerto": 73, "status": "Tranquilo" }
      ]
    }
  ]
}
```

A lista de alunos é ordenada por taxa de acerto (decrescente). `ultimaAtividade` pode ser `null` se o aluno ainda não respondeu nenhuma questão.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação da documentação dos endpoints de Dashboard da Turma | [Miguel Moreira](https://github.com/EhOMiguel) |
