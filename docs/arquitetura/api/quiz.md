# API de Quiz

Os endpoints de quiz atendem o fluxo principal da aplicação, permitindo que os usuários respondam questões, acompanhem seu progresso, gerenciem listas de estudo e controlem turmas.

Eles centralizam as operações relacionadas a questões, quiz, moedas, histórico, turmas e listas de estudo.

---

## **GET** /health

**Descrição:** verifica se o BFF está em execução.

Este endpoint retorna o status de saúde da aplicação, útil para monitoramento e verificações de disponibilidade.

**Autenticação:** pública.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "BFF em execução.",
  "dados": {
    "status": "ok",
    "timestamp": "2026-05-25T10:30:00.000Z"
  }
}
```

---

## Quiz

### **GET** /api/v1/quiz

**Descrição:** busca questões do quiz.

Este endpoint retorna uma questão do quiz para o usuário responder, considerando seu tema preferido ou aleatoriamente.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `tema` | string | Não | ID do tema para filtrar questões |
| `quantidade` | number | Não | Número de questões a retornar |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Questão carregada com sucesso.",
  "dados": {
    "id": "questao-1",
    "tema": "Anatomia",
    "enunciado": "Qual é o maior osso do corpo humano?",
    "alternativas": [
      {
        "id": "alt-1",
        "texto": "Fêmur",
        "ordem": 1
      },
      {
        "id": "alt-2",
        "texto": "Úmero",
        "ordem": 2
      }
    ],
    "dificuldade": "FACIL"
  }
}
```

---

### **POST** /api/v1/quiz/responder

**Descrição:** envia resposta de quiz.

Este endpoint registra a resposta do usuário a uma questão, atualiza seu histórico e calcula recompensas em moedas.

**Autenticação:** requerida.

**Body**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `questaoId` | string | Sim | ID da questão |
| `alternativaId` | string | Sim | ID da alternativa escolhida |
| `tempoResposta` | number | Sim | Tempo em segundos para responder |

**Resposta de sucesso — 201**

```json
{
  "mensagem": "Resposta registrada com sucesso.",
  "dados": {
    "acertou": true,
    "moedas": 10,
    "totalMoedas": 150,
    "pontos": 5
  }
}
```

---

### **GET** /api/v1/quiz/moedas

**Descrição:** busca saldo de moedas do usuário.

Este endpoint retorna o saldo atual de moedas do usuário, usado para compras e desbloqueios na aplicação.

**Autenticação:** requerida.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Saldo de moedas obtido com sucesso.",
  "dados": {
    "usuarioId": "usuario-1",
    "moedas": 150,
    "ultimaAtualizacao": "2026-05-25T10:30:00.000Z"
  }
}
```

---

### **GET** /api/v1/quiz/quantidade_por_tema

**Descrição:** busca quantidade de questões por tema.

Este endpoint retorna a distribuição de questões em cada tema, útil para exibir estatísticas e permitir que o usuário escolha por tema.

**Autenticação:** requerida.

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Quantidade de questões por tema listada com sucesso.",
  "dados": [
    {
      "tema": "Anatomia",
      "temaId": "tema-1",
      "quantidade": 45,
      "respondidas": 30
    },
    {
      "tema": "Fisiologia",
      "temaId": "tema-2",
      "quantidade": 38,
      "respondidas": 15
    }
  ]
}
```

---

### **GET** /api/v1/quiz/historico

**Descrição:** busca histórico de quiz do usuário.

Este endpoint retorna o histórico completo de respostas do usuário, permitindo revisar seu desempenho ao longo do tempo.

**Autenticação:** requerida.

**Query params**

| Campo | Tipo | Obrigatório | Regra |
|-------|------|-------------|-------|
| `pagina` | number | Não | Número da página (padrão: 1) |
| `limite` | number | Não | Itens por página (padrão: 20) |
| `tema` | string | Não | Filtrar por tema |
| `dataInicio` | string | Não | Formato `yyyy-mm-dd` |
| `dataFim` | string | Não | Formato `yyyy-mm-dd` |

**Resposta de sucesso — 200**

```json
{
  "mensagem": "Histórico de quiz listado com sucesso.",
  "dados": [
    {
      "id": "resposta-1",
      "questaoId": "questao-1",
      "tema": "Anatomia",
      "acertou": true,
      "alternativaEscolhida": "Fêmur",
      "tempoResposta": 15,
      "moedas": 10,
      "data": "2026-05-25T10:30:00.000Z"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "limite": 20,
    "total": 150,
    "totalPaginas": 8
  }
}
```

---

## Outras áreas

A documentação de endpoints do BFF está dividida nas seguintes páginas:

- [Questões](./questoes.md)
- [Turmas](./turmas.md)
- [Listas](./lista.md)

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 25/05/2026 | 1.0 | Criação da documentação dos endpoints da API de Quiz | [Caio Santos](https://github.com/caiobsantos) |
