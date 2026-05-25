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

| Feedback | Tipo | Prioridade | Ação sugerida | Status |
|----------|------|------------|---------------|--------|
| Mensagem inicial do WebApp não evidencia anatomia radiológica. | Produto/UX | Média | Revisar textos da página inicial para explicitar o foco em anatomia radiológica e imaginologia. | Issue a criar |
| Entradas do cadastro de professor precisam de tratamento mais robusto. | Técnico/UX | Média | Normalizar e validar espaços, sinais gráficos e sensibilidade ao caixa; avaliar mensagens durante preenchimento. | Issue a criar |
| Palavras-chave das questões não ficam salvas. | Funcional | Alta | Corrigir persistência e retorno das palavras-chave no fluxo de criação/edição de questões. | Issue a criar |
| Pesquisa de questões bloqueia após busca sem resultados. | Funcional | Alta | Permitir limpar o campo e realizar nova busca sem recarregar a página. | Issue a criar |
| Comentário da questão deveria ser obrigatório. | Produto/Requisito | Média | Alinhar com PO se o comentário equivale à explicação pedagógica ou se exige novo campo obrigatório. | Issue a criar |
| Campo Tema está genérico para o modelo esperado. | Produto/Modelagem | Alta | Decompor Tema em modalidade, plano, região anatômica e estrutura alvo. | Issue a criar |
| Campos de workflow da questão estão ausentes. | Produto/Modelagem | Alta | Incluir status, status_validacao e status_revisao no modelo e na listagem. | Issue a criar |
| Campos pedagógicos estruturados estão ausentes. | Produto/Modelagem | Média | Avaliar inclusão de nivel_dificuldade, nivel_bloom e justificativa_espacial. | Issue a criar |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 25/05/2026 | 1.0 | Registro inicial da validação da Release Minor 3 com resposta de Hugo e estrutura para consolidação da resposta de Chaffin | [Breno Fernandes](https://github.com/BrenoFrds) |
| 25/05/2026 | 1.1 | Consolidação da resposta de Chaffin e atualização do resultado da validação | [Breno Fernandes](https://github.com/BrenoFrds) |
