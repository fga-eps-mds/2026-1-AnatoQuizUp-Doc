# Visão Geral do Backlog

Este documento apresenta uma visão geral do backlog do AnatoQuizUp e sua organização por releases. Os detalhes de escopo, histórias de usuário, tarefas técnicas, dependências e critérios de aceitação ficam documentados nas páginas específicas de cada release.

## Objetivo do backlog

O backlog organiza o trabalho necessário para evoluir o AnatoQuizUp de forma incremental, mantendo rastreabilidade entre necessidades do produto, histórias de usuário e tarefas técnicas. Ele serve como referência para planejamento, priorização, acompanhamento das entregas e alinhamento entre produto, desenvolvimento, design e documentação.

## Organização

O backlog é dividido em releases major. Cada release agrupa um conjunto coerente de funcionalidades e tarefas técnicas, com foco em entregar valor progressivo ao produto.

| Release | Foco | Documento |
|---------|------|-----------|
| Release Major 1 | Fundação de cadastro de usuários e controle de acesso | [Release Major 1](./release-major-1.md) |
| Release Major 2 |  | [Release Major 2](./release-major-2.md) |
| Release Major 3 |  | [Release Major 3](./release-major-3.md) |

## Tipos de itens

### Histórias de usuário

Histórias de usuário descrevem necessidades do ponto de vista de quem usa o sistema. Elas seguem a estrutura:

```text
Como [perfil de usuário]
Quero [ação ou necessidade]
Para [benefício esperado]
```

Cada história deve possuir critérios de aceitação claros, permitindo validar se a entrega atende ao comportamento esperado.

### Tarefas técnicas

Tarefas técnicas representam trabalhos internos necessários para sustentar as histórias de usuário, como configuração de infraestrutura, modelagem de dados, autenticação, integrações, testes e organização do código.

Cada tarefa deve possuir critérios de conclusão objetivos, dependências quando aplicável e indicação do repositório impactado.

## Convenções gerais

- O backlog deve ser escrito em português do Brasil.
- Histórias de usuário devem manter foco no valor entregue ao usuário.
- Tarefas técnicas devem manter foco no resultado verificável pelo time.
- Critérios de aceitação e conclusão devem ser objetivos, testáveis e rastreáveis.
- Dependências entre itens devem ser registradas quando impactarem a ordem de implementação.
- Pontuação e escopo devem ser mantidos nas páginas específicas de cada release.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da visão geral do backlog | [Breno Fernandes](https://github.com/Brenofrds) |
| 27/04/2026 | 1.1 | Reorganização da visão geral para separar informações específicas por release | [Breno Fernandes](https://github.com/Brenofrds) |
