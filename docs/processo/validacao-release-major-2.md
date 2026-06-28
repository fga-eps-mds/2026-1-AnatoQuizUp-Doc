# Validação da Release Major 2

## Objetivo da validação

Registrar a validação da Release Major 2 e consolidar observações dos participantes para ajustes futuros.

## Informações gerais

| Campo | Valor |
|-------|-------|
| Release | Major 2 |
| Release Major associada | Major 2 |
| Formulário utilizado | Validação Release Major 2 |
| Momento da validação | Após a entrega da Release Major 2 |
| Resposta de Neysa | 29/05/2026 |
| Participantes | Neysa, aluna de Medicina participante do projeto |
| US avaliadas | Visualização de Turmas (Aluno); Listas de Questões; Sistema de Recompensas por Acertos (Moedas Virtuais); Tela de Controle de Administrador |

## Critérios avaliados

### US - Visualização de Turmas (Aluno)

| Critério | Neysa | Observações |
|----------|-------|-------------|
| Página acessível exclusivamente para usuários autenticados com perfil Aluno. | Aprovado | - |
| Exibir grade ou lista de cards com todas as turmas vinculadas ao aluno. Cada card deve mostrar Nome da Turma e Semestre. | Aprovado | - |
| Se o aluno não estiver vinculado a nenhuma turma, exibir ilustração e mensagem amigável. | Aprovado | - |
| Ao clicar no card de uma turma, o aluno deve ser redirecionado para a visualização detalhada. | Aprovado | - |
| A tela de detalhes deve exibir: Nome da Turma, Semestre, Descrição da matéria e Nome do professor responsável. | Aprovado | - |
| A listagem e a tela de detalhes devem adaptar-se corretamente para uso em telas de celulares. | Aprovado | - |

### US - Listas de Questões

| Critério | Neysa | Observações |
|----------|-------|-------------|
| O professor deve conseguir buscar questões existentes (por tema, tipo ou palavra-chave) e selecionar múltiplas para compor a lista. | Aprovado | - |
| O sistema deve permitir nomear a lista, reordenar as questões selecionadas e salvar o progresso no perfil do professor. | Reprovado | - |
| Após montar a lista, exibir as opções "Publicar na Turma" e "Gerar PDF", podendo realizar uma ou ambas. | Reprovado | - |
| Caso escolha publicar, o sistema deve solicitar a seleção das turmas de destino e disponibilizar a lista para os alunos. | Reprovado | - |
| Caso escolha gerar PDF, o sistema deve montar documento formatado com cabeçalho padrão, enunciados, imagens e alternativas. | Reprovado | - |
| Junto ao PDF, o sistema deve fornecer gabarito com explicações pedagógicas para uso exclusivo do professor. | Reprovado | - |

### US - Sistema de Recompensas por Acertos (Moedas Virtuais)

| Critério | Neysa | Observações |
|----------|-------|-------------|
| A quantidade de moedas deve ser atrelada ao nível de dificuldade da questão (Fácil = 10, Média = 25, Difícil = 50). | Reprovado | - |
| Ao acertar, a interface deve exibir animação clara com o valor de moedas ganhas junto ao card de explicação. | Aprovado | - |
| O saldo total de moedas deve ser atualizado instantaneamente no front-end e persistido no banco de dados. | Aprovado | - |
| O sistema deve possuir trava de segurança no back-end para impedir farm de moedas por recarga de página ou repetição da mesma questão. | Aprovado | - |
| O total acumulado de moedas deve estar sempre visível para o aluno (cabeçalho ou Dashboard). | Aprovado | - |

### US - Tela de Controle de Administrador

| Critério | Neysa | Observações |
|----------|-------|-------------|
| A tela de gerenciamento deve ser acessível apenas por usuários com perfil Administrador; outros perfis devem ser redirecionados para a home. | Aprovado | - |
| O painel deve exibir cards indicadores com contagem de usuários (Pendentes, Ativos, Inativos) e tabela com Nome, E-mail, Perfil e Status. | Aprovado | - |
| O administrador deve poder filtrar por abas de status (Todos, Ativos, Pendentes, Inativos) e buscar por nome ou e-mail. | Reprovado | - |
| O administrador deve conseguir aprovar clicando em "Ativar" ou inativar clicando em "Bloquear", com atualização imediata e notificação de sucesso. | Aprovado | - |
| O administrador logado não pode bloquear a própria conta; o sistema deve aplicar a tag "Sua conta" e remover os botões de ação daquela linha. | Aprovado | - |

## Feedbacks qualitativos recebidos

### Neysa

- Visualização de Turmas funcionou perfeitamente ("Perfeito!!!!!").
- Não foi possível gerar lista como professor nem responder como aluno na US de Listas de Questões.
- ATP não aparece no local indicado e questão difícil não concedeu recompensa de moedas virtuais.
- Seria interessante exibir a contagem individual de professores e alunos no painel de administrador, além do total.
- O sistema está permitindo cadastro de e-mails inexistentes (ex: 221026069@unb.br).
- Avaliação geral positiva: "Gostamos muito porém, atentar para os pontos indicados."

## Resultado da validação

A US Visualização de Turmas (Aluno) foi aprovada integralmente por Neysa em todos os critérios.

A US Listas de Questões foi reprovada — a funcionalidade não estava operacional durante a validação, não sendo possível criar lista como professor nem respondê-la como aluno.

A US Sistema de Recompensas por Acertos (Moedas Virtuais) foi aprovada parcialmente — animação e saldo funcionam corretamente, mas o ATP não aparece no local indicado e a questão difícil não concedeu a recompensa esperada.

A US Tela de Controle de Administrador foi aprovada parcialmente — o filtro por abas de status apresentou problema, e foram identificadas melhorias de UX na diferenciação de perfis e falha na validação de e-mail no cadastro.

O participante Chaffin não respondeu este formulário.

## Encaminhamentos

| Feedback | Tipo | Prioridade | Ação sugerida | Issue | Status |
|----------|------|------------|---------------|-------|--------|
| Funcionalidade de Listas de Questões não estava operacional durante a validação. | Funcional | Alta | Investigar e corrigir o fluxo de criação de listas pelo professor e de resposta pelo aluno. | A definir | Em análise |
| Saldo de ATP não aparece no local indicado após acerto. | Funcional | Alta | Verificar exibição do saldo de moedas no cabeçalho ou Dashboard conforme especificado. | A definir | Em análise |
| Questão difícil não concedeu recompensa de ATP. | Funcional | Alta | Corrigir lógica de concessão de moedas por nível de dificuldade no back-end. | A definir | Em análise |
| Filtro por abas de status não funcionou corretamente no painel de administrador. | Funcional | Alta | Corrigir comportamento das abas de filtragem (Todos, Ativos, Pendentes, Inativos) no painel admin. | A definir | Em análise |
| Ausência de contagem individual de professores e alunos no painel admin. | Produto/UX | Média | Adicionar cards ou indicadores separados com contagem de professores e alunos além do total geral. | A definir | Em análise |
| Sistema permite cadastro de e-mails inexistentes (ex: 221026069@unb.br). | Técnico | Alta | Implementar validação de domínio e/ou verificação de existência do e-mail no cadastro. | A definir | Em análise |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 28/06/2026 | 1.0 | Registro inicial da validação da Release Major 2 com resposta de Neysa | [Breno Fernandes](https://github.com/BrenoFrds) |
