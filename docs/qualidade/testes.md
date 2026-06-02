# Plano de Testes Funcionais

## Objetivo

Este documento registra o planejamento dos testes funcionais das **novas funcionalidades** entregues nas Releases Major 2 e 3. O foco é validar o comportamento do sistema do ponto de vista do usuário (caixa-preta), complementando os testes automatizados (Jest, com cobertura mínima de 85% descrita no [Plano de Qualidade](qualidade.md)) e a validação com os Product Owners (ver [Validação Release Minor 3](../processo/validacao-release-minor-3.md)).

## Abordagem

- **Testes automatizados:** unitários e de integração em cada repositório, executados no CI a cada PR.
- **Testes funcionais manuais:** execução dos cenários abaixo no ambiente de homologação antes de cada entrega.
- **Validação com o cliente:** os Product Owners validam as funcionalidades por formulário e reunião, gerando ajustes registrados como issues.

## Funcionalidades cobertas

- Quiz Dinâmico
- Tela de Histórico (Desempenho)
- Turmas (Vínculo)
- Painel do Administrador

## Cenários de teste

### Quiz Dinâmico

| Cenário | Passos | Resultado esperado |
|---------|--------|--------------------|
| Iniciar quiz | Aluno seleciona tema e quantidade de questões e inicia | Quiz é montado dinamicamente com as questões do tema escolhido |
| Responder questão | Aluno marca uma alternativa e confirma | Sistema indica acerto/erro e registra a tentativa |
| Recompensa por acerto | Aluno acerta uma questão | Moedas ATP são creditadas na carteira do aluno (sem duplicar para a mesma questão) |
| Finalizar quiz | Aluno conclui o quiz | É exibido o resumo de desempenho da sessão |

### Tela de Histórico (Desempenho)

| Cenário | Passos | Resultado esperado |
|---------|--------|--------------------|
| Listar tentativas | Aluno acessa a tela de histórico | São exibidas as tentativas anteriores com data e desempenho |
| Revisar questão | Aluno abre uma tentativa | É possível revisar a questão, a resposta marcada e a resposta correta |
| Histórico vazio | Aluno sem tentativas acessa a tela | Mensagem amigável de histórico vazio, sem erro |

### Turmas (Vínculo)

| Cenário | Passos | Resultado esperado |
|---------|--------|--------------------|
| Criar turma | Professor cria uma turma | Turma criada com código, nome, semestre e ano |
| Vincular aluno | Professor vincula um aluno à turma | Aluno passa a constar na lista de alunos da turma |
| Aluno vê suas turmas | Aluno acessa "Minhas Turmas" | São exibidas apenas as turmas ativas em que o aluno está vinculado |
| Acesso indevido | Aluno tenta acessar turma em que não está vinculado | Retorno 404 (não vaza a existência da turma) |
| Desvincular aluno | Professor remove um aluno da turma | Aluno deixa de ver a turma em "Minhas Turmas" |

### Painel do Administrador

| Cenário | Passos | Resultado esperado |
|---------|--------|--------------------|
| Listar usuários | Admin acessa o painel | Lista paginada com busca e filtro por status |
| Aprovar professor | Admin aprova um professor pendente | Status muda para ATIVO e o professor consegue logar |
| Rejeitar professor | Admin rejeita um professor pendente | Status muda para RECUSADO/INATIVO; cadastro mantido para histórico |
| Desativar/Reativar | Admin desativa e reativa um usuário | Status alterna entre INATIVO e ATIVO |
| Restrições | Admin tenta desativar a si mesmo ou outro admin | Ação bloqueada |
| Acesso indevido | Aluno/professor tenta acessar o painel | Acesso negado e redirecionamento |

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/06/2026 | 1.0 | Criação do plano de testes funcionais das novas funcionalidades (Quiz Dinâmico, Histórico, Turmas e Painel do Administrador) | [Miguel Moreira](https://github.com/EhOMiguel) |
