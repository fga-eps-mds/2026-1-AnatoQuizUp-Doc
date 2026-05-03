# Estrutura Analítica do Projeto (EAP)

A Estrutura Analítica do Projeto (EAP) do AnatoQuizUp organiza e subdivide o escopo total do trabalho em pacotes de entrega menores e mais gerenciáveis, facilitando o planejamento e a distribuição de tarefas nas Sprints.

## EAP Visual

Abaixo está a representação hierárquica dos módulos do sistema:

*   **1.0 AnatoQuizUp**
    *   **1.1 Autenticação e Gestão de Acesso**
        *   1.1.1 Cadastro de Aluno
        *   1.1.2 Login de Aluno (E-mail/Senha)
        *   1.1.3 Autenticação de Professor (Integração Microsoft/UnB)
        *   1.1.4 Login de Administrador
        *   1.1.5 Recuperação de Senha
    *   **1.2 Gestão de Conteúdo (Anatomia Radiológica)**
        *   1.2.1 Banco de Questões
        *   1.2.2 Cadastro e Edição de Quizzes (Professor)
        *   1.2.3 Sequenciador de Dificuldade
    *   **1.3 Gamificação e Área do Aluno**
        *   1.3.1 Resolução de Quizzes
        *   1.3.2 Sistema de Pontuação
        *   1.3.3 Painel de Conquistas e Emblemas
        *   1.3.4 Histórico de Desempenho
    *   **1.4 Infraestrutura e Arquitetura**
        *   1.4.1 Configuração do Banco de Dados (PostgreSQL + Prisma)
        *   1.4.2 Integração Contínua e Deploy (CI/CD)
        *   1.4.3 Refatoração para Microsserviços

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/05/2026 | 1.0 | Criação do documento de EAP e conteúdo inicial | [Genilson Junior](https://github.com/GenilsonJrs) |