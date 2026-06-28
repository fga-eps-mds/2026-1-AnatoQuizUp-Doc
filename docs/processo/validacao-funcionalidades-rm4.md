# Validação da Release Minor 4

## Objetivo da validação

Registrar a validação das funcionalidades da Release Minor 4 e consolidar observações dos participantes para ajustes futuros.

## Informações gerais

| Campo | Valor |
|-------|-------|
| Release | Minor 4 |
| Release Major associada | Major 2 |
| Formulário utilizado | Validação de Funcionalidades - RM4 (AnatoQuizUp) |
| Momento da validação | Após a entrega da Release Minor 4 |
| Resposta de Hugo | 28/05/2026 (considerada a resposta mais recente) |
| Participantes | Hugo, aluno de Medicina participante do projeto |
| US avaliadas | Dashboard de Evolução (Aluno); Dashboard de Desempenho da Turma (Professor); Sistema de Amizades (Gestão de Contatos); Lista de Questões (Aluno) |

## Critérios avaliados

### US - Dashboard de Evolução (Aluno)

| Critério | Hugo | Observações |
|----------|------|-------------|
| Página acessível exclusivamente para usuários autenticados com perfil Aluno. | Aprovado | - |
| Métricas Gerais: exibição de total de questões respondidas e porcentagem geral de acertos. | Aprovado | - |
| Distribuição por Tema: gráfico mostrando proporção de questões resolvidas por tema. | Aprovado | - |
| Desempenho por Tema: seção exibindo taxa de acertos e erros por tema específico. | Aprovado | - |
| Estado Vazio: exibir ilustração amigável incentivando a primeira questão quando não há histórico. | Aprovado | Hugo não pôde verificar diretamente pois sua conta já possui histórico; aprovado com base em reunião anterior. |

### US - Dashboard de Desempenho da Turma (Professor)

| Critério | Hugo | Observações |
|----------|------|-------------|
| Acesso: funcionalidade acessível a partir da tela de detalhes da turma, exclusiva para o professor responsável. | Aprovado | Hugo apontou que o link da turma é pouco intuitivo; sugere tornar a navegação mais clara. |
| Métricas Gerais (Visão Macro): cards com total de alunos, total de questões respondidas e taxa média de acertos. | Aprovado | - |
| Desempenho por Tema: gráfico ou lista com taxa de acerto da turma dividida por temas de anatomia. | Aprovado | - |
| Desempenho Individual (Visão Micro): tabela listando alunos com quantidade de questões respondidas e taxa de acerto individual. | Aprovado | - |
| Estado Vazio: mensagem amigável quando os alunos ainda não responderam nenhuma questão. | Aprovado | Hugo não pôde verificar diretamente pois todos os alunos já responderam questões; aprovado com base em reunião anterior. |

### US - Sistema de Amizades (Gestão de Contatos)

| Critério | Hugo | Observações |
|----------|------|-------------|
| Busca de Usuários: campo de pesquisa para procurar outros estudantes por nome ou email. | Aprovado | - |
| Envio de Solicitação: botão "Adicionar Amigo" para enviar convite de conexão. | Aprovado | - |
| Gestão de Convites Pendentes: área de "Convites" com opções de "Aceitar" ou "Recusar". | Aprovado | - |
| Listagem de Amigos: aba "Meus Amigos" com lista de conexões aprovadas. | Aprovado | - |
| Controle da Conexão: opção "Desfazer Amizade" na lista de amigos. | Aprovado | - |

### US - Lista de Questões (Aluno)

| Critério | Hugo | Observações |
|----------|------|-------------|
| O aluno deve visualizar as listas de questões pendentes dentro da página de detalhes da sua turma. | Aprovado | - |
| O sistema deve exibir claramente o título da lista, quantidade de questões e prazo limite de entrega. | Aprovado | - |
| O sistema deve ocultar o gabarito após confirmação da resposta, quando configurado pelo professor. | Aprovado | - |
| Após conclusão, a lista deve ter status atualizado como concluída e o gabarito deve ser visível após liberação pelo professor. | Aprovado | - |

## Feedbacks qualitativos recebidos

### Hugo

- O link de acesso ao dashboard a partir da tela de detalhes da turma é pouco intuitivo; seria interessante tornar mais evidente que o card da turma é clicável.
- O estado vazio do Dashboard de Evolução não pôde ser verificado diretamente, pois a conta utilizada já possui histórico de questões respondidas.
- O estado vazio do Dashboard de Desempenho da Turma não pôde ser verificado, pois todos os alunos já haviam respondido questões.
- Avaliação geral positiva: "Tudo aprovado, pessoal. Consegui verificar todos os recursos, exceto aquilo que eu pontuei na US de Dashboard de Evolução."

## Resultado da validação

Todas as US foram aprovadas integralmente por Hugo. Os estados vazios do Dashboard de Evolução e do Dashboard de Desempenho da Turma não foram testados diretamente durante a validação, mas Hugo os considerou aprovados com base em reuniões anteriores.

O participante Chaffin não respondeu este formulário.

## Encaminhamentos

| Feedback | Tipo | Prioridade | Ação sugerida | Issue | Status |
|----------|------|------------|---------------|-------|--------|
| Link de acesso ao dashboard da turma é pouco visível/intuitivo para o professor. | Produto/UX | Média | Avaliar destaque visual ou indicação explícita de que o card da turma é clicável e leva ao dashboard de desempenho. | A definir | Em análise |
| Estado vazio do Dashboard de Evolução não pôde ser verificado durante a validação. | Qualidade | Baixa | Validar o estado vazio em ambiente controlado com conta sem histórico de questões. | A definir | Em análise |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 28/06/2026 | 1.0 | Registro inicial da validação de Funcionalidades da RM4 com resposta de Hugo | [Breno Fernandes](https://github.com/BrenoFrds) |
