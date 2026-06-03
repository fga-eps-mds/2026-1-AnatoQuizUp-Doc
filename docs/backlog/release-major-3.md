# Histórias e Tarefas - Release Major 3

Este documento contém as histórias de usuário e tarefas técnicas da **Release Major 3** do AnatoQuizUp. Esta release evolui a experiência de aprendizagem com **acompanhamento de desempenho**, **gamificação**, **recursos sociais** e a **estrutura de Inteligência Artificial**.

## Visão geral

| Aspecto | Valor |
|---------|-------|
| Período | 26/05/2026 a 29/06/2026 |
| Sprints | 6 em diante |
| Foco | Dashboards, gamificação, social e IA |
| Situação | Em andamento |

## Escopo da release

### Incluído

- Resolução de listas de questões pelo aluno.
- Dashboard de desempenho do aluno e dashboard de rendimento da turma.
- Conquistas e loja virtual (uso das moedas ATP).
- Personalização de perfil e avatar.
- Funcionalidades sociais (amizade entre alunos).
- Estrutura de IA/RAG para geração de questões com validação docente.

## Product Backlog

### US — Responder Lista de Questões (EAP 1.5.3.1)

> **Como** aluno **quero** responder listas de questões atribuídas à minha turma **para** estudar de forma direcionada.

- [ ] Resolver listas estruturadas e registrar o desempenho.

### US — Dashboard de Aluno (EAP 1.5.3.2)

> **Como** aluno **quero** ver meu desempenho consolidado **para** identificar pontos fortes e fracos.

- [x] Totais gerais (respondidas, acertos, erros, taxa de acerto).
- [x] Desempenho por tema com classificação (Tranquilo/Atenção/Crítico).
- [x] Endpoint documentado em [Dashboard do Aluno](../arquitetura/api/dashboard-aluno.md).

### US — Dashboard de Rendimento da Turma (EAP 1.5.3.3)

> **Como** professor **quero** ver o rendimento da turma **para** entender as deficiências do grupo.

- [x] Visão macro (totais e desempenho por tema da turma).
- [x] Visão individual (desempenho por aluno).
- [x] Endpoints documentados em [Dashboard da Turma](../arquitetura/api/dashboard-turma.md).

### US — Conquistas (EAP 1.5.3.4)

> **Como** aluno **quero** receber conquistas ao atingir metas **para** me manter motivado.

- [ ] Sistema de conquistas por marcos de progressão.

### US — Loja Virtual (EAP 1.5.3.5)

> **Como** aluno **quero** gastar minhas moedas ATP na loja **para** personalizar minha experiência.

- [ ] Loja de itens cosméticos com as moedas ATP.

### US — Personalizar Perfil (EAP 1.5.3.6)

> **Como** aluno **quero** personalizar meu perfil e avatar **para** deixar a experiência minha.

- [ ] Personalização de perfil e avatar.

### US — Amizade entre Alunos

> **Como** aluno **quero** adicionar outros alunos como amigos **para** acompanhar colegas na plataforma.

- [x] Envio, aceite e recusa de convites de amizade.
- [x] Busca de possíveis amigos com controle de visibilidade.
- [x] Endpoints documentados em [Amizade](../arquitetura/api/amizade.md).

### US — Estrutura RAG e Tratamento de Texto (EAP 1.5.3.7)

> **Como** equipe **quero** uma estrutura de RAG **para** gerar questões com base no acervo validado.

- [ ] Pipeline de ingestão contínua de questões no banco vetorial. Detalhes em [Inteligência Artificial](../arquitetura/ia.md).

### Validação Release Major 3 (EAP 1.5.3.8)

> Testes e validação final da terceira release com os Product Owners.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação do backlog da Release Major 3 (dashboards, gamificação, social e IA) | [Miguel Moreira](https://github.com/EhOMiguel) |
# Histórias e Tarefas - Release Major 3

Este documento contém as histórias de usuário e tarefas técnicas da **Release Major 3** do AnatoQuizUp, contemplando funcionalidades de listas de exercícios, gamificação, personalização do perfil e evolução da infraestrutura de IA baseada em RAG.

## Visão Geral

A Release Major 3 concentra-se na ampliação da experiência do aluno por meio de funcionalidades de estudo guiado, gamificação e personalização, além da consolidação da infraestrutura de IA para preparação da continuidade do projeto.

| Aspecto                       | Valor                                             |
| ----------------------------- | ------------------------------------------------- |
| Período da release            | Semana 12 (01/06/2026) até Semana 16 (29/06/2026) |
| Data de entrega               | Segunda-feira, 29/06/2026                         |
| Total de histórias de usuário | 5                                                 |
| Total de tarefas de IA        | 4                                                 |
| Desenvolvedores disponíveis   | 9                                                 |

---

## Perfis de Usuário

### Aluno

* Pode responder listas de exercícios publicadas em turmas das quais participa.
* Pode acompanhar rankings, conquistas e evolução acadêmica.
* Pode personalizar seu avatar utilizando itens adquiridos.
* Pode utilizar moedas para adquirir itens na loja.

---

## Escopo da Release

### Incluído

* Lista de Questões para alunos.
* Sistema de Conquistas.
* Ranking por tema e por turma.
* Personalização e Inventário do Avatar.
* Compra de itens da Loja Virtual.
* Evolução da infraestrutura de IA (pipeline RAG, embeddings e documentação técnica).
* Correções oriundas das validações das histórias de usuário.

---

# Planejamento por Semana

## Semana 12 — 01/06/2026

### IA — Limpeza, normalização e chunking das questões

**Objetivo**

Preparar os dados extraídos dos PDFs para geração de embeddings e consolidar as definições do pipeline RAG.

#### Tarefas

* Implementar pipeline de limpeza de texto.
* Remover ruídos, headers e footers dos PDFs.
* Normalizar encoding e formatação das questões.
* Implementar estratégia de chunking.
* Validar qualidade dos chunks.
* Finalizar parâmetros do RAG.
* Criar testes unitários.

---

## US 01 - Lista de Questões (Aluno)

> **Como** aluno da plataforma
> **Quero** responder listas publicadas digitalmente para uma turma na qual sou inscrito ou exportá-las em PDF
> **Para** estudar de forma direcionada e organizada

### Critérios de Aceitação

* [ ] Visualizar listas organizadas por status.
* [ ] Acessar apenas listas das turmas em que está inscrito.
* [ ] Responder listas publicadas.
* [ ] Ter salvamento automático de progresso.
* [ ] Confirmar envio final das respostas.
* [ ] Submeter respostas dentro do prazo definido.
* [ ] Buscar listas por título, tema ou palavra-chave.
* [ ] Exportar lista em PDF formatado.
* [ ] Visualizar gabarito somente quando liberado pelo professor.


---

## Semana 13 — 08/06/2026

### IA — Vetorização do texto (geração dos embeddings)

**Objetivo**

Gerar embeddings para todos os chunks processados e armazená-los no banco vetorial.

#### Tarefas

* Configurar modelo de embeddings.
* Implementar vetorização em lote.
* Popular banco vetorial.
* Validar qualidade por testes de similaridade.
* Versionar embeddings gerados.

---

## US 02 - Sistema de Conquistas e Marcos

> **Como** aluno da plataforma
> **Quero** receber medalhas, troféus e recompensas ao atingir objetivos de estudo
> **Para** acompanhar minha evolução e manter o engajamento

### Critérios de Aceitação

* [ ] Monitorar marcos de quantidade de acertos.
* [ ] Monitorar marcos de especialidade por tema.
* [ ] Monitorar sequências de acertos.
* [ ] Conceder badges, troféus e itens raros.
* [ ] Exibir notificação imediata de conquista.
* [ ] Disponibilizar galeria de conquistas.
* [ ] Permitir destacar conquistas favoritas no perfil.

---

## US 03 - Visualização de Rankings

> **Como** aluno da plataforma
> **Quero** visualizar rankings gerais e por turma
> **Para** acompanhar meu desempenho em relação aos demais estudantes

### Critérios de Aceitação

* [ ] Exibir área de ranking no dashboard.
* [ ] Permitir alternância entre temas.
* [ ] Destacar posição do próprio aluno.
* [ ] Permitir filtro por turma.
* [ ] Exibir posição, avatar e pontuação.
* [ ] Atualizar ranking após conclusão das atividades.


---

## Semana 14 — 15/06/2026

### IA — Pipeline de ingestão contínua ao banco vetorial

**Objetivo**

Automatizar a ingestão de novas questões ao fluxo do banco vetorial.

#### Tarefas

* Implementar módulo de ingestão automática.
* Integrar criação de questões ao pipeline.
* Garantir idempotência.
* Implementar logs e tratamento de erros.
* Criar ingestão em lote para dados históricos.
* Documentar o processo.

---

## US 04 - Personalização e Inventário do Avatar

> **Como** aluno da plataforma
> **Quero** equipar itens que possuo
> **Para** personalizar meu avatar

### Critérios de Aceitação

* [ ] Disponibilizar acesso ao inventário.
* [ ] Liberar conjunto inicial de itens gratuitos.
* [ ] Organizar itens por slots.
* [ ] Exibir preview em tempo real.
* [ ] Permitir salvar visual personalizado.
* [ ] Persistir visual em toda a plataforma.


---

## Semana 15 — 22/06/2026

### IA — Handoff técnico para próxima equipe

**Objetivo**

Documentar a solução implementada e preparar a continuidade do desenvolvimento.

#### Tarefas

* Elaborar documentação técnica.
* Produzir guia de onboarding.
* Registrar limitações e débitos técnicos.
* Definir roadmap de evolução.
* Organizar repositório e artefatos.

---

## US 05 - Compra de Itens da Loja

> **Como** aluno da plataforma
> **Quero** utilizar minhas moedas para adquirir itens
> **Para** personalizar meu avatar e perfil

### Critérios de Aceitação

* [ ] Disponibilizar acesso à loja virtual.
* [ ] Exibir catálogo de itens para avatar.
* [ ] Exibir catálogo de itens para perfil.
* [ ] Validar saldo antes da compra.
* [ ] Deduzir moedas após compra aprovada.
* [ ] Exibir mensagem amigável em caso de saldo insuficiente.
* [ ] Enviar item adquirido para o inventário.
* [ ] Identificar itens já adquiridos.

---

## Semana 16 — 29/06/2026

### Ajustes Finais

#### Tarefas

* Correções finais identificadas nos testes de aceitação.
* Ajustes de desempenho.
* Ajustes de usabilidade.
* Revisão de documentação.
* Preparação para entrega da Release Major 3.

---

## Atividades Transversais da Release

As seguintes atividades serão executadas continuamente durante todas as semanas da Release Major 3, acompanhando o desenvolvimento e a validação das funcionalidades planejadas:

### Correções Oriundas da Validação das Histórias de Usuário

#### Tarefas

* Correção de bugs identificados durante homologação.
* Ajustes de interface e experiência do usuário.
* Correções de regras de negócio.
* Atualização de testes automatizados.

Essas atividades ocorrerão paralelamente ao desenvolvimento das histórias de usuário e tarefas técnicas previstas para cada semana da release.


## Histórico de Versão

| Data       | Versão | Descrição                                                      |                 Autor(es)              |
| ---------- | ------ | -------------------------------------------------------------- |--------------------------------------- |
| 02/06/2026 | 1.0    | Criação do documento de Histórias e Tarefas da Release Major 3 | [João Vitor](https://github.com/Joa0V) |
