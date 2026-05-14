# Visao Geral da Arquitetura

O AnatoQuizUp e uma plataforma web de quiz de anatomia organizada em servicos com responsabilidades separadas. O Frontend consome somente o BFF. O BFF e o unico endereco publico da camada de servicos e roteia chamadas para Backend/Auth, Quiz-Service ou AI conforme o caminho da URL.

A arquitetura atual possui bancos separados por servico:

- **Backend/Auth DB:** usuarios, refresh tokens, tokens de redefinicao e dados administrativos.
- **Quiz DB:** temas, questoes, alternativas, resolucoes e metadados de quiz.
- **AI DB futuro:** dados de IA quando o servico for implementado.

## Diagrama geral

```mermaid
flowchart LR
    user(["Usuario"])
    web["Frontend Web<br/>React + Vite<br/>(publico)"]
    bff["BFF<br/>Node + Express<br/>(publico)"]
    auth["Backend/Auth<br/>Express + Prisma<br/>(privado)"]
    quiz["Quiz-Service<br/>Express + Prisma<br/>(privado)"]
    ai["AI Service<br/>(futuro, privado)"]
    authDb["Auth DB<br/>PostgreSQL"]
    quizDb["Quiz DB<br/>PostgreSQL"]
    aiDb["AI DB<br/>futuro"]
    storage["Storage de imagens<br/>MinIO/S3"]

    user --> web
    web -->|"HTTPS REST<br/>Bearer JWT"| bff
    bff -->|"/autenticacao, /admin, /exemplos<br/>Bearer JWT + X-Internal-Token"| auth
    bff -->|"/questoes<br/>Bearer JWT + X-Internal-Token"| quiz
    bff -.->|"/ia<br/>X-Internal-Token"| ai
    auth --> authDb
    quiz --> quizDb
    quiz --> storage
    ai -.-> aiDb
```

## Componentes

### Frontend Web

Aplicacao React responsavel por telas, formularios, navegacao e estado de autenticacao no cliente. Acessa apenas o BFF, nunca Backend/Auth, Quiz-Service ou AI diretamente.

### BFF

Proxy de orquestracao sem banco e sem regra de negocio. Valida JWT na borda, injeta `X-Internal-Token`, repassa `Authorization` e headers auxiliares (`X-User-Id`, `X-User-Papel`, `X-User-Status`) e preserva o contrato publico usado pelo Web.

### Backend/Auth

Servico privado responsavel por autenticacao, identidade, administracao de usuarios, exemplos tecnicos e banco de autenticacao. Nao possui mais logica, tabelas ou storage de questoes.

### Quiz-Service

Servico privado responsavel pelo dominio de quiz ja existente: temas, questoes, alternativas, resolucoes e infraestrutura de imagens de questoes. Valida o JWT localmente com `JWT_SECRET_KEY`; os headers `X-User-*` sao apenas informativos.

### AI Service

Servico reservado para semestres futuros. Permanece sem funcionalidade nesta etapa, mas a arquitetura ja reserva banco proprio e roteamento pelo BFF.

## Visoes detalhadas

- [Visao Logica](./visoes/logica.md): modulos, componentes e responsabilidades logicas do sistema.
- [Visao de Processos](./visoes/processos.md): fluxos de execucao e interacao entre componentes.
- [Visao de Implementacao](./visoes/implementacao.md): organizacao fisica do codigo e repositorios.
- [Visao de Implantacao](./visoes/implantacao.md): ambientes, infraestrutura e deploy.
- [Banco de Dados](./banco-de-dados/v1.md): modelagem e estrutura de persistencia.
- [Tecnologias](./tecnologias.md): stack tecnologica utilizada.
- [Decisoes Arquiteturais](./decisoes.md): decisoes consolidadas e suas consequencias.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criacao do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) |
| 26/04/2026 | 1.1 | Reorganizacao da secao de arquitetura | [Ana Catarina](https://github.com/an4catarina) |
| 27/04/2026 | 1.2 | Atualizacao da visao geral com resumo dos conteineres | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.3 | Atualizacao para refletir a introducao do BFF | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualizacao para Backend/Auth, Quiz-Service e bancos por servico | Miguel Moreira |
