# EVM Ágil — Sprint 1

## Parâmetros da sprint

| Parâmetro | Valor | Observação |
|-----------|-------|------------|
| Período | 19/04 a 26/04/2026 | Sprint de 8 dias |
| Duração | 8 dias | |
| Taxa horas por ponto | 3,0 h/pt | Inicial. Recalibrar após Sprint 1 com média real. |
| Baseline do projeto | 960 horas | 12 pessoas × 8 h/sem × 10 semanas |

---

## Valores da Sprint 1

### Métricas base

| Métrica | Valor | De onde vem |
|---------|-------|-------------|
| **VP** — Valor Planejado (pontos) | 91 | Soma dos pontos das US planejadas para a sprint |
| **VA** — Valor Agregado (pontos) | 71 | Soma dos pontos das US com status Done |
| **VP em horas-equivalente** | 273,0 h | VP × taxa h/pt |
| **VA em horas-equivalente** | 213,0 h | VA × taxa h/pt |
| **CR** — Custo Real (horas) | 140,0 h | Soma das horas registradas pelo time na sprint |

### Índices de desempenho

| Índice | Valor | Interpretação |
|--------|-------|---------------|
| **SPI** — Schedule Performance Index | **0,78** | < 1 → atrasado em relação ao planejado |
| **CPI** — Cost Performance Index | **1,52** | > 1 → eficiente (entregou mais valor por hora gasta) |

### Projeção

| Métrica | Valor | Descrição |
|---------|-------|-----------|
| Baseline do projeto | 960 h | Capacidade total planejada |
| **EAC** (Estimate at Completion) | 631 h | Baseline / CPI — projeção de horas totais |
| Desvio esperado | -329 h | EAC - Baseline (negativo = abaixo do orçamento) |

### Diagnóstico

!!! warning "Situação: Atrasado no cronograma, eficiente no custo"
    **SPI 0,78** indica que entregamos 78% do planejado. Os 20 pontos não entregues correspondem às US de professor (US03 e US04) que foram adiadas devido à mudança de escopo de SSO Microsoft para cadastro local com SIAPE. A decisão de adiar foi deliberada para evitar retrabalho enquanto a definição final do fluxo de professor é fechada com os POs.

    **CPI 1,52** indica que o time está entregando mais valor por hora investida do que o estimado. As horas reais ficaram abaixo do previsto, o que sugere que as estimativas de esforço foram conservadoras ou que o time foi produtivo acima da média.

---

## Gráfico de Gantt — Planejado vs Realizado

```mermaid
gantt
    title Sprint 1 — Planejado vs Realizado (19/04 a 26/04)
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Infraestrutura
    TASK01 Modelagem Prisma (planejado)         :done, t01p, 2026-04-19, 2d
    TASK01 Modelagem Prisma (real)              :done, t01r, 2026-04-19, 2d
    TASK02 Seed admin (planejado)               :done, t02p, 2026-04-21, 1d
    TASK02 Seed admin (real)                    :done, t02r, 2026-04-21, 1d
    TASK04 Configuração JWT (planejado)         :done, t04p, 2026-04-19, 2d
    TASK04 Configuração JWT (real)              :done, t04r, 2026-04-20, 2d
    TASK03 Setup módulo auth (planejado)        :done, t03p, 2026-04-21, 2d
    TASK03 Setup módulo auth (real)             :done, t03r, 2026-04-21, 3d
    TASK05 Setup FSD frontend (planejado)       :done, t05p, 2026-04-19, 2d
    TASK05 Setup FSD frontend (real)            :done, t05r, 2026-04-19, 2d

    section Middlewares e Infra Frontend
    TASK10 Middleware autenticação (planejado)   :done, t10p, 2026-04-21, 2d
    TASK10 Middleware autenticação (real)        :done, t10r, 2026-04-22, 2d
    TASK11 Middleware autorização (planejado)    :done, t11p, 2026-04-22, 1d
    TASK11 Middleware autorização (real)         :done, t11r, 2026-04-23, 1d
    TASK13 Rotas protegidas (planejado)         :done, t13p, 2026-04-22, 1d
    TASK13 Rotas protegidas (real)              :done, t13r, 2026-04-23, 1d
    TASK14 Header/Navbar (planejado)            :done, t14p, 2026-04-22, 2d
    TASK14 Header/Navbar (real)                 :done, t14r, 2026-04-22, 2d
    TASK15 Home placeholder (planejado)         :done, t15p, 2026-04-23, 1d
    TASK15 Home placeholder (real)              :done, t15r, 2026-04-23, 1d
    TASK16 Tela 404 (planejado)                 :done, t16p, 2026-04-23, 1d
    TASK16 Tela 404 (real)                      :done, t16r, 2026-04-24, 1d

    section US Aluno
    US01 Cadastro aluno (planejado)             :done, us01p, 2026-04-22, 3d
    US01 Cadastro aluno (real)                  :done, us01r, 2026-04-22, 3d
    US02 Login aluno (planejado)                :done, us02p, 2026-04-22, 3d
    US02 Login aluno (real)                     :done, us02r, 2026-04-22, 3d
    US05 Logout (planejado)                     :done, us05p, 2026-04-24, 1d
    US05 Logout (real)                          :done, us05r, 2026-04-24, 1d

    section US Professor
    US03 Cadastro professor (planejado)         :crit, us03p, 2026-04-23, 3d
    US03 Cadastro professor (real)              :active, us03r, 2026-04-23, 3d
    US04 Login professor (planejado)            :crit, us04p, 2026-04-24, 2d
    US04 Login professor (real)                 :active, us04r, 2026-04-24, 2d

    section US Admin e Outros
    US08 Painel admin (planejado)               :done, us08p, 2026-04-23, 3d
    US08 Painel admin (real)                    :done, us08r, 2026-04-23, 3d
    US07 Visão de aluno (planejado)             :done, us07p, 2026-04-24, 2d
    US07 Visão de aluno (real)                  :done, us07r, 2026-04-24, 2d

    section Spikes e Email
    TASK06 Spike email (planejado)              :done, t06p, 2026-04-19, 1d
    TASK06 Spike email (real)                   :done, t06r, 2026-04-20, 1d
    TASK09 Serviço email (planejado)            :done, t09p, 2026-04-21, 2d
    TASK09 Serviço email (real)                 :done, t09r, 2026-04-22, 2d
    US06 Recuperação senha (planejado)          :done, us06p, 2026-04-23, 2d
    US06 Recuperação senha (real)               :done, us06r, 2026-04-24, 2d

    section Refresh Token
    TASK12 Refresh token (planejado)            :done, t12p, 2026-04-23, 2d
    TASK12 Refresh token (real)                 :done, t12r, 2026-04-23, 2d
```

### Legenda do Gantt
- **done** (verde) = entregue conforme planejado
- **crit / active** (vermelho/azul) = não entregue na sprint — US03 e US04 (professor) adiadas por mudança de escopo

---

## Análise da Sprint 1

### O que foi entregue (71 pontos)

Toda a infraestrutura técnica (14 tasks), cadastro e login de aluno (US01, US02), logout (US05), recuperação de senha (US06), painel de administração (US08), visão de aluno do professor (US07) e refresh token (TASK12).

### O que não foi entregue (20 pontos)

US03 (Cadastro de professor — 8pts) e US04 (Login de professor — 5pts), além de ajustes planejados para o fluxo de aprovação no painel admin (estimados em ~7pts adicionais). A causa foi a mudança de escopo no fluxo de professor: a decisão de migrar de SSO Microsoft para cadastro local com SIAPE aconteceu durante a sprint e o time optou por adiar a implementação de professor para evitar retrabalho enquanto a definição final é fechada com os POs.

### Ações para a próxima sprint

1. Fechar definição do fluxo de professor com os POs (SSO ou SIAPE — decisão final)
2. Priorizar US03 e US04 como primeiros cards da Sprint 2
3. Melhorar registro de horas (R19 da matriz de riscos) — muitos membros não preencheram
4. Recalibrar taxa h/pt com base nas horas reais da Sprint 1
