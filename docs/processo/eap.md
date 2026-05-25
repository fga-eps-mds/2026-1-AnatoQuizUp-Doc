# Estrutura Analítica do Projeto (EAP)

Uma Estrutura Analítica do Projeto (EAP) representa a decomposição hierárquica do escopo e das entregas de um projeto. Seu objetivo é subdividir o trabalho em partes menores, mais organizadas e gerenciáveis, permitindo maior clareza no planejamento e na execução. Cada nível da EAP apresenta um grau crescente de detalhamento, até alcançar os pacotes de trabalho, que constituem o nível mais baixo da estrutura e podem ser estimados em termos de custo, prazo e esforço, além de serem monitorados e controlados durante o desenvolvimento do projeto.

A EAP contempla todo o trabalho necessário para a realização do projeto, incluindo atividades técnicas, operacionais e gerenciais. Dessa forma, ela garante uma visão completa das entregas previstas e segue a regra dos 100%, segundo a qual o conjunto dos elementos “filhos” deve representar integralmente o trabalho definido pelo elemento “pai” em cada nível da hierarquia.


## EAP Visual

Abaixo está a representação Estrutura Analítica do Projeto do AnatoQuizUp:

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/board/5pOhtCBCDxJlxSVNZcpWTF/Vis%C3%A3o-do-Produto-AnatoQuizUP-2026-1?node-id=13066-1913&embed-host=share" allowfullscreen></iframe>

## 1.1 Gerenciamento do Projeto
A subdivisão de gerenciamento do projeto reúne as atividades responsáveis pelo planejamento, monitoramento e controle do desenvolvimento do sistema. Essas entregas garantem alinhamento entre equipe, cronograma, riscos e objetivos do produto.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.1.1 | Cronograma | Organização temporal das atividades e marcos do projeto. |
| 1.1.2 | Definição de Escopo | Delimitação das funcionalidades e objetivos do sistema. |
| 1.1.3 | Custo | Estimativas de recursos e esforço do projeto. |
| 1.1.4 | Planejamento de Riscos | Identificação e mitigação de riscos do projeto. |

## 1.2 Documentação
A subdivisão de documentação concentra os artefatos necessários para registrar decisões, arquitetura, processos e conhecimento do projeto.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.2.1 | Lean Inception | Definição inicial da visão do produto e MVP. |
| 1.2.2 | Backlog | Lista priorizada de funcionalidades e tarefas. |
| 1.2.3 | Arquitetura | Estrutura técnica e organização do sistema. |
| 1.2.4 | Protótipos | Modelos visuais das interfaces e funcionalidades. |
| 1.2.5 | Quadro de Conhecimentos | Visão do conhecimento dos integrantes do time desenvolvimento do projeto. |
| 1.2.6 | Política de Contribuição | Regras e padrões para colaboração da equipe. |
| 1.2.7 | Planejado x Realizado | Comparação entre planejamento e execução. |
| 1.2.8 | Decisões | Registro das decisões relevantes do projeto. |

## 1.3 Analítico
A subdivisão analítica reúne dashboards e indicadores responsáveis pelo acompanhamento do produto, projeto e processos.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.3.1 | Dashboard Produto | Painel de métricas relacionadas ao produto. |
| 1.3.2 | Dashboard Projeto | Monitoramento do andamento do projeto. |
| 1.3.3 | Dashboard Processos | Acompanhamento da eficiência dos processos. |

## 1.4 Configuração
A subdivisão de configuração contempla a infraestrutura de desenvolvimento e integração contínua necessária para sustentar o projeto.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.4.1 | Configuração Repositórios | Organização dos repositórios do projeto. |
| 1.4.2 | Pipeline CI/CD | Automação de integração, testes e deploy. |

## 1.5 MVP
A subdivisão do MVP reúne as funcionalidades incrementais do sistema organizadas em releases progressivas.

### 1.5.1 Release Major 1
Primeira entrega funcional do sistema, focada em autenticação e estrutura básica de acesso dos usuários.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.5.1.1 | Cadastro de Usuário | Funcionalidade de registro de usuários. |
| 1.5.1.2 | Controle de Acesso | Gerenciamento de autenticação e permissões. |
| 1.5.1.3 | Validação Release Major 1 | Testes e homologação da primeira release major. |

### 1.5.2 Release Major 2
Segunda entrega incremental do sistema, concentrando funcionalidades centrais relacionadas à criação e execução de quizzes.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.5.2.1 | Gerenciar Questões | Administração das questões do sistema. |
| 1.5.2.2 | Realizar Quiz | Execução de quizzes pelos estudantes. |
| 1.5.2.3 | Recompensas por Quiz | Recompensas em moedas virtuais do sistema. |
| 1.5.2.4 | Gerenciar Turmas | Administração de turmas pelos professores. |
| 1.5.2.5 | Turmas (Aluno) | Funcionalidades de participação dos estudantes em turmas. |
| 1.5.2.6 | Gerenciar Lista de Questões | Organização de listas de exercícios. |
| 1.5.2.7 | Validação Release Major 2 | Homologação da segunda release major. |

### 1.5.3 Release Major 3
Terceira entrega incremental do sistema, focada em recursos avançados de acompanhamento, gamificação e personalização.

| Código | Nome | Breve Explicação |
|---|---|---|
| 1.5.3.1 | Responder Lista de Questões | Resolução de listas estruturadas de exercícios. |
| 1.5.3.2 | Dashboard de Aluno | Painel individual de desempenho do estudante. |
| 1.5.3.3 | Dashboard de Rendimento da Turma | Indicadores coletivos de desempenho da turma. |
| 1.5.3.4 | Conquistas | Sistema de recompensa por marcos de progressão nos estudos. |
| 1.5.3.5 | Loja Virtual | Ambiente de utilização das moedas virtuais. |
| 1.5.3.6 | Personalizar Perfil | Customização do perfil do usuário. |
| 1.5.3.7 | Estrutura RAG e Tratamento de Texto | Processamento textual e recuperação aumentada por geração. |
| 1.5.3.8 | Validação Release Major 3 | Testes e validação final da terceira release. |

## Referências

> Project Management Institute. 2006. Practice Standard for Work Breakdown Structures (WBS), Second Edition. Newtown Square, PA: Author.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 02/05/2026 | 1.0 | Criação do documento de EAP e conteúdo inicial | [Genilson Junior](https://github.com/GenilsonJrs) |
| 24/05/2026 | 1.1 | Atualização do documento de EAP | [João Vitor](https://github.com/Joa0V) |