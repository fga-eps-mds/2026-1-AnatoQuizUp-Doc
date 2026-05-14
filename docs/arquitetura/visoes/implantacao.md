# Visao de Implantacao

A visao de implantacao mostra onde cada parte do sistema roda e como os servicos se comunicam. A topologia atual separa Backend/Auth e Quiz-Service, cada um com banco proprio.

## Visao geral

```mermaid
flowchart LR
    frontend["Frontend<br/>Vercel (publico)"]
    bff["BFF<br/>Railway (publico)"]
    auth["Backend/Auth<br/>Railway (privado)"]
    quiz["Quiz-Service<br/>Railway (privado)"]
    ai["AI<br/>Railway (futuro, privado)"]
    authDb["Auth DB<br/>PostgreSQL Railway"]
    quizDb["Quiz DB<br/>PostgreSQL Railway"]
    aiDb["AI DB<br/>futuro"]
    storage["MinIO/S3<br/>imagens de questoes"]

    frontend -->|"API REST<br/>Bearer JWT"| bff
    bff -->|"/autenticacao, /admin, /exemplos<br/>X-Internal-Token"| auth
    bff -->|"/questoes<br/>X-Internal-Token"| quiz
    bff -.->|"/ia<br/>X-Internal-Token"| ai
    auth --> authDb
    quiz --> quizDb
    quiz --> storage
    ai -.-> aiDb
```

## Ambiente local

| Parte | Ambiente local |
|-------|----------------|
| Frontend | `localhost:5173` |
| BFF | `localhost:4000` |
| Backend/Auth | `localhost:3333` |
| Quiz-Service | `localhost:3334` |
| AI | reservado |
| Auth DB | Postgres via Docker em `localhost:5432` |
| Quiz DB | Postgres via Docker em `localhost:5433` |
| MinIO API | `localhost:9000` |
| MinIO Console | `localhost:9001` |

Em desenvolvimento, o Web continua chamando apenas `http://localhost:4000/api/v1`. O BFF decide o destino interno por path.

## Producao planejada

| Parte | Servico planejado |
|-------|-------------------|
| Frontend | Vercel |
| BFF | Railway com dominio publico |
| Backend/Auth | Railway em rede privada |
| Quiz-Service | Railway em rede privada |
| AI | Railway em rede privada, futuro |
| Auth DB | PostgreSQL separado |
| Quiz DB | PostgreSQL separado |
| AI DB | PostgreSQL separado quando AI existir |
| Storage de questoes | MinIO/S3 sob responsabilidade do Quiz-Service |

O Railway continua sendo a opcao preferida porque permite rede privada entre BFF e servicos internos. O Backend/Auth e o Quiz-Service tambem validam `X-Internal-Token`, entao chamadas diretas sem o token sao rejeitadas.

## Variaveis essenciais

| Variavel | Usada por | Observacao |
|----------|-----------|------------|
| `BACKEND_URL` | BFF | URL privada do Backend/Auth |
| `QUIZ_SERVICE_URL` | BFF | URL privada do Quiz-Service |
| `AI_URL` | BFF | Vazio enquanto AI for placeholder |
| `JWT_SECRET_KEY` | BFF, Backend/Auth, Quiz-Service | Backend/Auth assina; BFF e Quiz-Service validam |
| `INTERNAL_TOKEN` | BFF, Backend/Auth, Quiz-Service | BFF injeta; servicos internos validam |
| `DATABASE_URL` | Backend/Auth, Quiz-Service, AI futuro | Cada servico usa sua propria URL de banco |

## Alternativa

Caso o custo do Railway nao seja aprovado, Render + Supabase continua sendo alternativa, mas com maior complexidade operacional e menor isolamento de rede privada. Nesse caso, `X-Internal-Token` fica ainda mais importante para proteger os servicos privados.

## Historico de Versao

| Data | Versao | Descricao | Autor(es) |
|------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criacao da visao de implantacao | [Breno Fernandes](https://github.com/Brenofrds) |
| 05/05/2026 | 1.1 | Atualizacao para refletir BFF publico e Backend/AI privados | [Miguel Moreira](https://github.com/miguelmsoliveira) |
| 13/05/2026 | 2.0 | Atualizacao para Quiz-Service privado e bancos por servico | Miguel Moreira |
