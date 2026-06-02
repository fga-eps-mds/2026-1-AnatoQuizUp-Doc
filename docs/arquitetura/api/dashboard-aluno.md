# API de Dashboard do Aluno

Endpoint que agrega o desempenho do próprio aluno a partir das suas resoluções de questões. Pertence ao **Quiz-Service** e é exposto publicamente pelo BFF em `/api/v1/dashboardAluno`.

**Acesso:** papel **ALUNO** (autenticação requerida). O dashboard é sempre do usuário autenticado.

---

### **GET** /api/v1/dashboardAluno

**Descrição:** retorna o desempenho consolidado do aluno autenticado, com totais gerais e detalhamento por tema.

**Autenticação:** requerida (ALUNO).

**Resposta de sucesso — 200**

```json
{
  "totalRespondidas": 42,
  "totalAcertos": 30,
  "totalErros": 12,
  "taxaAcerto": 71,
  "porTema": [
    {
      "temaId": "tema-1",
      "nome": "Tórax",
      "totalRespondidas": 20,
      "acertos": 16,
      "erros": 4,
      "taxaAcerto": 80,
      "status": "Tranquilo"
    },
    {
      "temaId": "tema-2",
      "nome": "Neuroanatomia",
      "totalRespondidas": 22,
      "acertos": 14,
      "erros": 8,
      "taxaAcerto": 64,
      "status": "Atenção"
    }
  ]
}
```

**Quando o aluno ainda não respondeu nenhuma questão**, os totais voltam zerados e `porTema` vazio:

```json
{ "totalRespondidas": 0, "totalAcertos": 0, "totalErros": 0, "taxaAcerto": 0, "porTema": [] }
```

**Campos**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `totalRespondidas` | number | Total de questões respondidas |
| `totalAcertos` | number | Total de acertos |
| `totalErros` | number | Total de erros |
| `taxaAcerto` | number | Percentual geral de acerto (0–100) |
| `porTema[].temaId` | string | ID do tema |
| `porTema[].nome` | string | Nome do tema |
| `porTema[].totalRespondidas` | number | Questões respondidas no tema |
| `porTema[].acertos` | number | Acertos no tema |
| `porTema[].erros` | number | Erros no tema |
| `porTema[].taxaAcerto` | number | Percentual de acerto no tema (0–100) |
| `porTema[].status` | string | Classificação do desempenho no tema |

**Classificação do status por tema** (com base na taxa de acerto):

| Taxa de acerto | Status |
|----------------|--------|
| ≥ 70% | Tranquilo |
| ≥ 40% e < 70% | Atenção |
| < 40% | Crítico |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação da documentação do endpoint de Dashboard do Aluno | [Miguel Moreira](https://github.com/EhOMiguel) |
