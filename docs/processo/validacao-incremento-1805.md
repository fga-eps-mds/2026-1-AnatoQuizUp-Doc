# Validação do Incremento 18/05

## Objetivo da validação

Registrar a validação do incremento entregue em 18/05 e consolidar observações do participante para ajustes futuros.

## Informações gerais

| Campo | Valor |
|-------|-------|
| Release | Incremento 18/05 |
| Release Major associada | Major 2 |
| Formulário utilizado | Validação Incremento 18/05 |
| Momento da validação | Após a entrega do incremento de 18/05 |
| Resposta de Hugo | 28/05/2026, 19:22 |
| Participantes | Hugo, aluno de Medicina participante do projeto |
| US avaliadas | Criação de Turmas e Alocação de Alunos; Quiz Dinâmico |

## Critérios avaliados

### US - Criação de Turmas e Alocação de Alunos

| Critério | Hugo | Observações |
|----------|------|-------------|
| Funcionalidade acessível exclusivamente para usuários autenticados com perfil Professor ou Admin. | Aprovado | - |
| O sistema deve fornecer um formulário com campos obrigatórios: Turma, Semestre e Descrição. | Aprovado | - |
| O e-mail deve pertencer obrigatoriamente ao domínio ou subdomínios da UnB. | Aprovado | - |
| O botão "Criar Turma" só deve ser habilitado se todos os campos obrigatórios estiverem preenchidos. | Aprovado | - |
| Após a criação com sucesso, o professor deve ser redirecionado para a interface de "Adicionar Alunos". | Aprovado | - |
| A interface de adição deve permitir pesquisar alunos cadastrados (por nome ou matrícula) e vinculá-los à turma. | Aprovado | - |
| Exibir notificações de sucesso tanto ao criar a turma quanto ao vincular um aluno. | Aprovado | - |

### US - Quiz Dinâmico

| Critério | Hugo | Observações |
|----------|------|-------------|
| A ordenação das questões deve ser feita de forma aleatória diretamente no servidor. | Aprovado | - |
| Não deve haver limite fixo de questões; o aluno pode progredir por todas as disponíveis no tema. | Aprovado | - |
| Gabaritos e explicações pedagógicas não devem ser retornados no payload inicial da requisição. | Aprovado | - |
| O aluno deve poder selecionar uma alternativa e clicar em um botão de confirmação. | Aprovado | - |
| Após a confirmação, o sistema deve bloquear a troca de resposta. | Aprovado | - |
| O sistema deve destacar a resposta correta em verde e, em caso de erro, a marcada pelo aluno em vermelho. | Aprovado | - |
| O sistema deve exibir o feedback com a explicação técnica/pedagógica somente após a submissão. | Aprovado | - |
| O fluxo deve permitir a transição para a próxima questão de forma fluida após o feedback. | Aprovado | - |

## Feedbacks qualitativos recebidos

### Hugo

- Ao esgotar as questões disponíveis no tema e tentar avançar, a plataforma repete a mesma questão indefinidamente, permitindo aumentar a taxa de acertos sem esforço.
- Ausência de recurso para eliminar alternativas durante o quiz; seria interessante para auxiliar o raciocínio do aluno.
- Avaliação geral positiva: "Incremento muito bom. WebApp está tomando forma progressivamente."

## Resultado da validação

Ambas as US foram aprovadas por Hugo em todos os critérios avaliados. O participante Chaffin não respondeu este formulário.

## Encaminhamentos

| Feedback | Tipo | Prioridade | Ação sugerida | Issue | Status |
|----------|------|------------|---------------|-------|--------|
| Loop infinito de questões ao esgotar o banco do tema selecionado. | Funcional | Alta | Implementar lógica de encerramento do quiz ao esgotar as questões disponíveis, exibindo tela de conclusão em vez de repetir a última questão. | A definir | Em análise |
| Ausência de recurso para eliminar alternativas durante o quiz. | Produto/UX | Baixa | Avaliar a inclusão de mecanismo para o aluno descartar alternativas como recurso de apoio ao raciocínio. | A definir | Em análise |

## Histórico de Versão

| Data | Versão | Descrição | Autor(es) |
|------|--------|-----------|-----------|
| 28/06/2026 | 1.0 | Registro inicial da validação do Incremento 18/05 com resposta de Hugo | [Breno Fernandes](https://github.com/BrenoFrds) |
