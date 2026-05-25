# Validação da Release Minor 3

## Objetivo da validação

Registrar a validação assíncrona da Release Minor 3 e consolidar observações dos participantes para ajustes futuros.

## Informações gerais

| Campo | Valor |
|-------|-------|
| Release | Minor 3 |
| Release Major associada | Major 2 |
| Formulário utilizado | [Validação Release Minor 3](https://docs.google.com/forms/d/e/1FAIpQLScp4gdhQIPucyjYIpQ0hY2tAX9RWldtN1CA1stPMwlrL2Pcew/viewform?usp=dialog) |
| Momento da validação | Após a entrega da Release Minor 3 |
| Resposta de Hugo | 22/05/2026, 01:02 |
| Resposta de Chaffin | 22/05/2026, 17:06 |
| Participantes | Hugo, aluno de Medicina participante do projeto; Professor Chaffin, PO/cliente |
| US avaliadas | Cadastro de Professor; Cadastro e Gestão de Questões |

## Critérios avaliados

### US - Cadastro de Professor

| Critério | Hugo | Chaffin | Observações |
|----------|------|---------|-------------|
| Validar obrigatoriamente nome completo, email institucional, SIAPE, departamento, curso e senha com mínimo de 8 caracteres. | Aprovado | Aprovado | Chaffin indicou atenção ao tratamento dos dados de entrada, como espaços, sinais gráficos e sensibilidade ao caixa. |
| Manter o campo Instituição pré-preenchido e bloqueado com o valor "Universidade de Brasília — UnB". | Aprovado | Aprovado | - |
| Exigir email pertencente ao domínio ou subdomínios da UnB. | Aprovado | Aprovado | - |
| Exigir SIAPE com exatamente 7 dígitos numéricos e único no sistema. | Aprovado | Aprovado | - |
| Informar o campo duplicado quando email ou SIAPE já estiverem cadastrados. | Aprovado | Aprovado | - |
| Criar usuário com status inicial PENDING, impedindo login até aprovação administrativa. | Aprovado | Aprovado | - |

### US - Cadastro e Gestão de Questões

| Critério | Hugo | Chaffin | Observações |
|----------|------|---------|-------------|
| Permitir acesso à página exclusivamente para usuários autenticados com perfil Professor ou Admin. | Aprovado | Aprovado | - |
| Permitir inserção obrigatória de tema, enunciado, tipo, alternativas com correta indicada e explicação pedagógica. | Aprovado | Reprovado | Chaffin avaliou que os campos cobrem parcialmente o modelo esperado; o campo Tema está genérico e faltam campos estruturados. |
| Permitir campo opcional para upload ou link de imagem que ilustre o enunciado. | Aprovado | Aprovado | - |
| Habilitar o botão "Salvar" apenas quando todos os campos obrigatórios estiverem preenchidos, incluindo resposta correta. | Aprovado | Aprovado | - |
| Exibir tabela com questões cadastradas pelo professor, com edição completa e exclusão com confirmação via modal. | Aprovado | Reprovado | Chaffin apontou ausência de campos de estado e workflow na listagem, como status da questão, validação e revisão. |
| Exibir notificação visual de sucesso após salvar ou excluir uma questão. | Aprovado | Aprovado | - |

## Feedbacks qualitativos recebidos

### Hugo

- Realçar que o produto é focado em anatomia radiológica, não em anatomia humana genérica.
- Corrigir persistência de palavras-chave das questões, pois os termos informados não permanecem salvos.
- Corrigir a pesquisa de questões quando não há resultados, pois o campo fica bloqueado e exige recarregar a página.
- Avaliar obrigatoriedade do comentário da questão.

### Chaffin

- Cadastro de Professor considerado satisfatório, com sugestão de reforçar validações de entrada e mensagens durante o preenchimento.
- O campo Tema deve ser decomposto em campos normalizados: modalidade, plano, região anatômica e estrutura alvo.
- Faltam campos de workflow: status, status_validacao e status_revisao.
- Faltam campos pedagógicos: nivel_dificuldade, nivel_bloom e justificativa_espacial.
- Sem esses campos, busca, filtros, revisão e avaliação pedagógica ficam limitados.

## Resultado da validação

A validação indicou aprovação da US Cadastro de Professor, com ajustes de validação de entrada.

A US Cadastro e Gestão de Questões foi aprovada parcialmente: Hugo aprovou os critérios, mas Chaffin reprovou os critérios de campos obrigatórios e de listagem/gestão por lacunas no modelo estruturado de questão.

## Encaminhamentos

| Feedback | Tipo | Prioridade | Ação sugerida | Issue | Status |
|----------|------|------------|---------------|-------|--------|
| Mensagem inicial do WebApp não evidencia anatomia radiológica. | Produto/UX | Média | Revisar textos da página inicial para explicitar o foco em anatomia radiológica e imaginologia. | [#43](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/43) | Issue criada |
| Entradas dos cadastros de professor e aluno precisam de tratamento mais robusto. | Técnico/UX | Média | Normalizar e validar o campo nome para evitar caracteres especiais indevidos. | [#39](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/39), [#40](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/40) | Issues criadas |
| Palavras-chave das questões não ficam salvas. | Funcional | Alta | Corrigir persistência e retorno das palavras-chave no fluxo de criação/edição de questões. | [#42](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/42) | Issue criada |
| Pesquisa de questões bloqueia após busca sem resultados. | Funcional | Alta | Permitir limpar o campo e realizar nova busca sem recarregar a página. | [#41](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/41) | Issue criada |
| Comentário da questão deveria ser obrigatório. | Produto/Requisito | Média | Alinhar com PO se o comentário equivale à explicação pedagógica ou se exige novo campo obrigatório. | [#44](https://app.zenhub.com/workspaces/2026-1-anatoquizup-69bc08ebd4e9ec001c0c3229/issues/gh/fga-eps-mds/2026-1-anatoquizup-doc/44) | Issue criada |
| Campo Tema está genérico para o modelo esperado. | Produto/Modelagem | Alta | Analisar se o modelo atual já contempla modalidade, plano, região anatômica e estrutura alvo antes de criar issue. | A definir | Em análise |
| Campos de workflow da questão estão ausentes. | Produto/Modelagem | Alta | Verificar no modelo atual se já existem status, status_validacao e status_revisao antes de criar issue. | A definir | Em análise |
| Campos pedagógicos estruturados estão ausentes. | Produto/Modelagem | Média | Verificar se nivel_dificuldade, nivel_bloom e justificativa_espacial já existem ou se devem entrar no backlog. | A definir | Em análise |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 25/05/2026 | 1.0 | Registro inicial da validação da Release Minor 3 com resposta de Hugo e estrutura para consolidação da resposta de Chaffin | [Breno Fernandes](https://github.com/BrenoFrds) |
| 25/05/2026 | 1.1 | Consolidação da resposta de Chaffin e atualização do resultado da validação | [Breno Fernandes](https://github.com/BrenoFrds) |
| 25/05/2026 | 1.2 | Inclusão dos links das issues criadas e status dos encaminhamentos em análise | [Breno Fernandes](https://github.com/BrenoFrds) |
