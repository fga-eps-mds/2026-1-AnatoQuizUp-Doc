## Política de Branches

Este projeto adota o modelo **Git Flow**, proposto por Vincent Driessen.

### Branches principais

- main → versão estável em produção/homologação
- develop → integração contínua do desenvolvimento


### Branches de suporte

#### Feature

- Nome: feature/nome-da-feature
- Origem: develop
- Destino: develop

Uso: desenvolvimento de novas funcionalidades


#### Release

- Nome: release/x.y.z
- Origem: develop
- Destino: main e develop

Uso:

- preparação para entrega (R1, R2, R3)
- ajustes finais e testes


#### Hotfix

- Nome: hotfix/nome
- Origem: main
- Destino: main e develop

Uso: correções urgentes em produção


### Fluxo de trabalho

1. Criar branch a partir de develop
2. Desenvolver a funcionalidade
3. Abrir Pull Request para develop
4. Revisão obrigatória
5. Merge após aprovação


### Boas práticas

- Nunca commitar diretamente na main
- Manter branches atualizadas com develop
- PRs pequenos e revisáveis
- Nomeação padronizada


### Objetivo

- Garantir controle de versões (PMBOK - controle de mudanças)
- Suportar desenvolvimento incremental (Scrum)
- Organizar releases de forma estruturada


## Referências

> DRIESSEN, Vincent. A successful Git branching model. 2010. Disponível em: https://nvie.com/posts/a-successful-git-branching-model/. Acesso em: 11 abr. 2026.


## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 11/04/2026 | 1.0 | Criação do documento | [Victor Hugo](https://github.com/ViictorHugoo) | 