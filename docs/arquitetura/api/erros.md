# Erros e Contratos da API

## Objetivo

Este documento registra os contratos comuns usados pela API do AnatoQuizUp.

Ele serve como referência para o frontend tratar respostas de sucesso, erros, paginação e autenticação de forma consistente.

## Resposta de sucesso

Endpoints que retornam um recurso único usam o formato padrão de sucesso:

```json
{
  "mensagem": "Mensagem de sucesso.",
  "dados": {}
}
```

O campo `mensagem` descreve o resultado da operação. O campo `dados` contém o objeto, lista ou valor retornado pelo backend.

## Resposta paginada

Endpoints de listagem paginada usam o formato:

```json
{
  "dados": [],
  "metadados": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

| Campo | Descrição |
|-------|-----------|
| `page` | Página atual |
| `limit` | Quantidade máxima de itens por página |
| `total` | Total de registros encontrados |
| `totalPages` | Total de páginas disponíveis |

## Resposta de erro

Erros usam o formato:

```json
{
  "erro": {
    "codigo": "ERRO_DE_VALIDACAO",
    "mensagem": "Dados inválidos.",
    "detalhes": {}
  }
}
```

| Campo | Descrição |
|-------|-----------|
| `codigo` | Código estável para tratamento no frontend |
| `mensagem` | Mensagem legível para explicar o erro |
| `detalhes` | Informações extras, quando existirem |

## Códigos de erro

| Código | Uso esperado |
|--------|--------------|
| `REQUISICAO_INVALIDA` | Requisição malformada ou erro conhecido de banco |
| `ERRO_DE_VALIDACAO` | Entrada não passou nas validações |
| `NAO_AUTORIZADO` | Credenciais inválidas ou usuário não autenticado |
| `PROIBIDO` | Usuário autenticado sem permissão suficiente |
| `NAO_ENCONTRADO` | Recurso não encontrado |
| `CONFLITO` | Estado ou dado conflita com regra de negócio |
| `NAO_IMPLEMENTADO` | Funcionalidade ainda não implementada |
| `ERRO_INTERNO` | Erro inesperado no servidor |
| `TOKEN_EXPIRADO` | Token expirado |
| `TOKEN_INVALIDO` | Token inválido |
| `VERIFICACAO_TOKEN_FALHOU` | Falha ao verificar token |
| `NENHUM_TOKEN_FORNECIDO` | Requisição protegida sem token |
| `CONTA_DESATIVADA` | Conta inativa |
| `CADASTRO_EM_ANALISE` | Cadastro ainda pendente |
| `CADASTRO_RECUSADO` | Cadastro recusado |

## Status HTTP comuns

| Status | Significado |
|--------|-------------|
| `200` | Operação concluída com sucesso |
| `201` | Recurso criado com sucesso |
| `204` | Operação concluída sem corpo de resposta |
| `400` | Requisição inválida |
| `401` | Usuário não autenticado ou token inválido |
| `403` | Usuário sem permissão ou conta sem acesso |
| `404` | Rota ou recurso não encontrado |
| `409` | Conflito com regra de negócio |
| `500` | Erro interno inesperado |

## Autenticação em endpoints protegidos

Endpoints protegidos exigem o cabeçalho:

```http
Authorization: Bearer <accessToken>
```

Quando o token não é enviado, é inválido ou pertence a uma conta sem acesso, a API retorna erro `401` ou `403`, conforme o caso.

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 04/05/2026 | 1.0 | Criação da documentação dos endpoints da API | [Arthur Carneiro](https://github.com/trindadea) |
