# Decisões do Projeto

## Objetivo

Este documento registra decisões relevantes do AnatoQuizUp que afetam escopo, arquitetura, processo, qualidade e integração entre os repositórios. Ele complementa as decisões arquiteturais registradas em [Arquitetura](../arquitetura/decisoes.md).

## Registro de decisões

| ID | Decisão | Impacto | Status |
|----|---------|---------|--------|
| DP01 | Adotar Git Flow e Conventional Commits | Padroniza branches, PRs e rastreabilidade do histórico | Consolidada |
| DP02 | Incluir três perfis de acesso: aluno, professor e administrador | Define regras de cadastro, login, autorização e painel administrativo | Consolidada |
| DP03 | Separar o projeto em repositórios independentes por responsabilidade (inicialmente API, Web, Doc e AI; evoluído na Release 2 — ver DP19 e DP20) | Permite ciclos independentes para cada serviço, frontend, documentação e Inteligência Artificial | Consolidada |
| DP04 | Usar MkDocs Material para a documentação e publicar via GitHub Pages | Centraliza a documentação em site navegável e automatiza deploy com `mkdocs gh-deploy` | Consolidada |
| DP05 | Adotar Feature-Sliced Design no frontend | Organiza a aplicação em `app`, `pages`, `widgets`, `features`, `entities` e `shared` | Consolidada |
| DP06 | Organizar os serviços de domínio por módulos e camadas | Cada domínio segue rotas, controller, service, repository, schemas e DTOs | Consolidada |
| DP07 | Usar Prisma e PostgreSQL como base de persistência | Viabiliza migrations, modelagem relacional e seed de administrador | Consolidada |
| DP08 | Aplicar quality gate de cobertura mínima de 85% | PRs precisam manter testes e cobertura para evitar regressões | Consolidada |
| DP09 | Incluir três perfis de acesso: aluno, professor e administrador | Define regras de cadastro, login, autorização e painel administrativo | Consolidada |
| DP10 | Criar professores com aprovação administrativa | Professores entram como pendentes e dependem de aprovação do administrador | Consolidada |
| DP11 | Substituir a hipótese de SSO Microsoft na Release Major 1 por cadastro local de professor com SIAPE | Reduz dependência externa e adia integração Microsoft para release futura, mas replaneja US03 e US04 | Consolidada |
| DP12 | Padronizar domínio e respostas em português brasileiro | Evita mistura de termos PT-BR/inglês em contratos, mensagens e enums de domínio | Em implantação |
| DP13 | Controlar mocks do frontend por variável de ambiente | Permite desenvolvimento e demonstração com fallback sem esconder a integração real | Consolidada |
| DP14 | Usar Brevo para email transacional | Implementa envio de email de redefinição de senha com template HTML e texto puro | Consolidada |
| DP15 | Medir Sprint 1 com EVM ágil | Permite acompanhar SPI, CPI, valor planejado, valor agregado e custo real | Consolidada |
| DP16 | Adotar BFF (Backend-For-Frontend) entre Frontend e serviços de domínio | Frontend passa a falar apenas com o BFF; Usuario-Service e AI evoluem de forma independente; isolamento entre regras de negócio e integração com AI | Consolidada |
| DP17 | Manter Usuario-Service, Quiz-Service e AI privados, com tráfego controlado por `X-Internal-Token` (combinado com rede privada do Railway) | Reduz superfície de ataque; impõe que clientes externos só alcancem o sistema via BFF; o token funciona como rede de segurança caso a privatização de rede falhe | Consolidada |
| DP18 | Validar JWT em duas camadas (BFF e cada serviço de domínio) | Defesa em profundidade: comprometer o BFF não basta para acessar dados do Usuario-Service ou Quiz-Service, que continuam revalidando o token e o status do usuário | Consolidada |
| DP19 | Renomear repositório `2026-1-AnatoQuizUp-API` para `2026-1-AnatoQuizUp-Usuario-Service`; criar `2026-1-AnatoQuizUp-BFF` | Elimina ambiguidade entre o intermediário (BFF) e o serviço de regras de negócio; alinha o nome do repositório à sua função | Consolidada |
| DP20 | Fragmentar o domínio de quiz em um `Quiz-Service` próprio, com banco e storage (MinIO/S3) dedicados | Isola o domínio de questões/quiz; bancos por serviço; IDs de usuário viram referências externas sem FK | Consolidada |
| DP21 | Abrir a leitura de turmas para o ALUNO com filtro por papel no service | Aluno vê apenas turmas vinculadas e ATIVAs; `?status=` é rejeitado com 400 e turma sem vínculo retorna 404 (não vaza existência) | Consolidada |
| DP22 | Recompensar o aluno com moedas ATP por acerto de questão | `CarteiraMoedas` + `TransacaoMoeda` com recompensa única por questão (constraint de unicidade) | Consolidada |
| DP23 | Introduzir listas de questões compartilháveis por turma | `ListaQuestao`/`ListaQuestaoItem`/`ListaTurma`; professor monta listas e compartilha com turmas | Consolidada |
| DP24 | Disponibilizar dashboards de desempenho (aluno e turma) | Agregação a partir das resoluções; aluno vê o próprio desempenho, professor/admin veem a turma (macro e individual) | Consolidada |
| DP25 | Adicionar funcionalidades sociais de amizade entre alunos | Convites, busca por visibilidade e vínculo; status `PENDENTE`/`ATIVO`/`RECUSADO`; flag `visivel` no usuário | Consolidada |
| DP26 | Substituir o construtor de personalização de avatar por avatares prontos e cosméticos em uma Loja Virtual generalizada | Remove do MVP da R3 a customização de avatar por montagem de peças (alto esforço de arte, sem competência interna no time); a personalização passa a ser feita por itens cosméticos adquiridos na loja (ícones de perfil, molduras, avatares estáticos, títulos e planos de fundo) e equipados em Personalizar Perfil, dando uso às moedas ATP; decisão negociada com os POs na reunião de 22/06 | Consolidada |


## Decisões abertas ou em acompanhamento

| Tema | Estado | Próximo passo |
|------|--------|---------------|
| Fluxo completo de professor | Concluída | Cadastro, login e aprovação administrativa com SIAPE implementados |
| Funcionalidades pedagógicas da Release Major 2 | Concluída | Questões, quiz, turmas, listas e recompensa entregues |
| Endpoints definitivos em português | Em implantação | Padronizar rotas novas e revisar rotas legadas |
| Exportação de métricas do SonarCloud para Doc | Em ajuste | Incluir defeitos, vulnerabilidades e code smells no export |
| Estrutura de IA/RAG para geração de questões | Em andamento | Pipeline de ingestão de questões no banco vetorial (Release Major 3) |

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Registro inicial das decisões de projeto consolidadas até a Sprint 1 | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 05/05/2026 | 1.1 | Inclusão das decisões DP16 (adoção de BFF), DP17 (serviços de domínio privados com `X-Internal-Token`), DP18 (JWT em duas camadas) e DP19 (renomeação de repositórios) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 02/06/2026 | 1.2 | Inclusão das decisões DP20–DP25 (Quiz-Service, turmas por papel, moedas, listas, dashboards e amizade), atualização do status de DP10/DP11 e das decisões em acompanhamento | [Miguel Moreira](https://github.com/EhOMiguel) |
| 07/07/2026 | 1.3 | Inclusão da decisão DP26 (substituição do construtor de avatar por avatares prontos e cosméticos na Loja Virtual generalizada, negociada com os POs em 22/06) | [Breno Fernandes](https://github.com/BrenoFrds) |
