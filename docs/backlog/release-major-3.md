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
