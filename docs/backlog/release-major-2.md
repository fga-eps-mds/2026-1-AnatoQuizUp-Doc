# Histórias e Tarefas - Release Major 2

Este documento contém as histórias de usuário e tarefas técnicas da **Release Major 2** do AnatoQuizUp. Enquanto a Release Major 1 entregou a fundação de acesso, a Release Major 2 entrega o **fluxo pedagógico** (questões, quiz, turmas e listas) e consolida a **refatoração arquitetural** com BFF e serviços de domínio.

## Visão geral

| Aspecto | Valor |
|---------|-------|
| Período | 28/04/2026 a 25/05/2026 |
| Sprints | 2 a 5 |
| Foco | Fluxo pedagógico, banco de questões, quiz, turmas e refatoração arquitetural |
| Situação | Concluída |

## Escopo da release

### Incluído

- Refatoração para arquitetura com BFF + Usuario-Service + Quiz-Service.
- Cadastro e login de professor (SIAPE) e painel administrativo completo.
- Gestão de questões (CRUD com imagem e versionamento).
- Quiz dinâmico, resolução de questões e agregação de histórico.
- Recompensa por acerto (moedas ATP).
- Gestão de turmas pelo professor e visualização pelo aluno.
- Listas de questões e compartilhamento por turma.

### Fora de escopo (movido para a Release Major 3)

- Dashboards de desempenho (aluno e turma).
- Conquistas, loja virtual e personalização de perfil/avatar.
- Recursos de Inteligência Artificial.

## Product Backlog

### US — Gerenciar Questões (EAP 1.5.2.1)

> **Como** professor/administrador **quero** criar, editar, visualizar e excluir questões **para** manter o banco de questões da plataforma.

- [x] Acesso restrito a PROFESSOR/ADMINISTRADOR.
- [x] Campos: tema, enunciado, tipo, alternativas com a correta indicada e explicação ("saiba mais").
- [x] Upload opcional de imagem para a questão (MinIO/S3).
- [x] Listagem com edição e exclusão (com confirmação).
- [x] Versionamento de questão (`questaoOriginalId`).

### US — Realizar Quiz (EAP 1.5.2.2)

> **Como** aluno **quero** responder um quiz dinâmico **para** praticar anatomia e acompanhar meu desempenho.

- [x] Montagem dinâmica do quiz por tema/quantidade.
- [x] Registro de cada tentativa (`ResolucaoQuestao`).
- [x] Feedback de acerto/erro.
- [x] Agregação de histórico de tentativas.

### US — Recompensa por Quiz (EAP 1.5.2.3)

> **Como** aluno **quero** ganhar moedas ATP ao acertar questões **para** me manter engajado.

- [x] Crédito de moedas na carteira do aluno a cada acerto.
- [x] Recompensa única por questão (sem duplicar).

### US — Gerenciar Turmas (EAP 1.5.2.4)

> **Como** professor/administrador **quero** criar e gerenciar turmas e vincular alunos **para** organizar o acompanhamento.

- [x] CRUD de turmas restrito a PROFESSOR/ADMINISTRADOR.
- [x] Vínculo e desvínculo de alunos.
- [x] Professor gerencia apenas as turmas que criou.

### US — Turmas (Aluno) (EAP 1.5.2.5)

> **Como** aluno **quero** ver as turmas em que estou vinculado **para** acessar o conteúdo da turma.

- [x] Aluno vê apenas turmas vinculadas e ATIVAs.
- [x] Acesso a turma sem vínculo retorna 404 (não vaza existência).
- [x] Detalhe da turma exibe o professor responsável.

### US — Gerenciar Lista de Questões (EAP 1.5.2.6)

> **Como** professor **quero** montar listas de questões e compartilhá-las com turmas **para** direcionar o estudo.

- [x] Criação de listas com itens ordenados.
- [x] Compartilhamento de lista com turmas.
- [x] Estatísticas da lista por turma.

## Project Backlog (Tarefas técnicas)

| Tarefa | Descrição | Repositório |
|--------|-----------|-------------|
| Introdução do BFF | Único ponto de entrada público; validação de JWT e injeção de `X-Internal-Token` (DP16–DP19) | BFF |
| Fragmentação Quiz-Service | Extração do domínio de quiz, banco próprio (Quiz DB) e storage MinIO/S3 (DP20) | Quiz-Service |
| Endpoint `/usuarios/:id` | Resolução pública de nome/papel para compor telas (ex.: professor da turma) | Usuario-Service |
| CI/CD dos novos repositórios | Pipelines com lint, build, testes, cobertura e SonarCloud + export de métricas | BFF, Quiz-Service |

## Replanejamento

O planejamento inicial previa também os dashboards de aluno e professor e a visualização de ranking. Devido a atrasos na resolução de questões/histórico, ao acréscimo da recompensa por questão, à refatoração arquitetural e à redução da equipe, essas frentes foram movidas para a [Release Major 3](release-major-3.md). O registro detalhado está em [Sprints](../processo/sprints.md) e na [Validação Release Minor 3](../processo/validacao-release-minor-3.md).

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação do backlog da Release Major 2 com histórias entregues e tarefas técnicas | [Miguel Moreira](https://github.com/EhOMiguel) |
