# Visão Geral da Arquitetura

O AnatoQuizUp é uma plataforma web de quiz de anatomia composta por **quatro contêineres principais**: **frontend**, **BFF (Backend-For-Frontend)**, **backend** e **banco de dados**. Há ainda um quinto serviço, **AI**, reservado para semestres futuros. Essa separação organiza a solução em camadas com responsabilidades claras e permite que interface, ponto de entrada, regras de negócio e persistência evoluam de forma independente.

O frontend é responsável pela experiência do usuário no navegador. O BFF é o ponto de entrada público da plataforma e roteia chamadas para o backend ou para o serviço de AI conforme o caminho da URL, validando o JWT e injetando um token interno compartilhado. O backend concentra as regras de negócio, autenticação, autorização e exposição da API REST. O banco de dados persiste usuários, sessões, tokens e, nas próximas evoluções, questões, respostas e dados de desempenho.

## Diagrama geral

```mermaid
flowchart LR
    user(["Usuário"])
    web["Frontend Web<br/>React + Vite<br/>(Vercel — público)"]
    bff["BFF<br/>Node + Express<br/>(Railway — público)"]
    backend["Backend<br/>Node + Express + Prisma<br/>(Railway — privado)"]
    ai["AI Service<br/>(reservado, Railway — privado)"]
    db["PostgreSQL 18<br/>(Railway)"]

    user --> web
    web -->|HTTPS REST<br/>Bearer JWT| bff
    bff -->|HTTP REST<br/>Bearer JWT + X-Internal-Token<br/>(rede privada)| backend
    bff -.->|HTTP REST<br/>X-Internal-Token<br/>(futuro)| ai
    backend -->|DATABASE_URL| db
```

## Contêineres principais

### Frontend Web

Aplicação React responsável por telas, formulários, navegação, estado de autenticação no cliente e comunicação com o BFF. A organização interna segue Feature-Sliced Design, separando `app`, `pages`, `widgets`, `features`, `entities` e `shared`. Acessa apenas o BFF — nunca o backend ou o AI diretamente.

### BFF (Backend-For-Frontend)

Aplicação Node.js com Express que atua como **proxy 100% orquestração** entre o frontend e os serviços de domínio. Não tem regras de negócio próprias nem persistência. Suas responsabilidades:

- Validar o JWT (assinatura/expiração) antes de repassar.
- Injetar o header `X-Internal-Token` (segredo compartilhado) e cabeçalhos auxiliares (`X-User-Id`, `X-User-Profile`, `X-User-Status`) nas chamadas downstream.
- Rotear por path: `/api/v1/autenticacao/*`, `/api/v1/admin/*`, `/api/v1/exemplos/*` → Backend; `/api/v1/ia/*` → AI.
- Padronizar respostas de erro vindas do downstream.

### Backend API

Aplicação Node.js com Express responsável pelos endpoints REST, validações, autenticação, autorização, regras de negócio e integração com o banco via Prisma. Os módulos de domínio seguem uma estrutura baseada em controller, service, repository, schemas, DTOs e rotas. **Em produção fica em rede privada** e aceita apenas requisições com `X-Internal-Token` válido (defesa em profundidade combinada à validação de JWT).

### AI Service

Serviço reservado para semestres futuros, responsável por geração de questões, geração de imagens anatômicas e chatbot educacional. **Sem código nesta release** — os endpoints `/api/v1/ia/*` no BFF respondem 503 com código `IA_INDISPONIVEL` enquanto o serviço estiver vazio. Quando habilitado, ficará em rede privada como o backend.

### Banco de Dados

Banco PostgreSQL responsável pela persistência dos dados estruturados do sistema. Na base atual, armazena usuários, refresh tokens e tokens de redefinição de senha; futuramente também armazenará entidades relacionadas a questões, respostas e desempenho.

## Visões detalhadas

- [Visão Lógica](./visoes/logica.md): módulos, componentes e responsabilidades lógicas do sistema.
- [Visão de Processos](./visoes/processos.md): fluxos de execução e interação entre componentes.
- [Visão de Implementação](./visoes/implementacao.md): organização física do código e repositórios.
- [Visão de Implantação](./visoes/implantacao.md): ambientes, infraestrutura e deploy.
- [Banco de Dados](./banco-de-dados/v1.md): modelagem e estrutura de persistência.
- [Tecnologias](./tecnologias.md): stack tecnológica utilizada.
- [Decisões Arquiteturais](./decisoes.md): decisões consolidadas e suas consequências.

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criação do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) |
| 26/04/2026 | 1.1 | Reorganização da seção de arquitetura, mantendo apenas a visão geral da solução | [Ana Catarina](https://github.com/an4catarina) |
| 27/04/2026 | 1.2 | Atualização da visão geral com resumo dos contêineres e links para as visões arquiteturais | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.3 | Atualização da arquitetura para refletir a introdução do BFF | [Miguel Moreira](https://github.com/miguelmsoliveira) |
