# Matriz de Riscos

## Como funciona a gestão de riscos

A gestão de riscos é o processo de identificar, avaliar e preparar respostas para eventos que podem impactar negativamente o projeto. No AnatoquizUp, cada risco é avaliado em duas dimensões:

**Probabilidade (P):** a chance de o risco se materializar durante a release, numa escala de 1 a 5.

| P | Significado |
|---|-------------|
| 1 | Muito baixa — improvável de acontecer |
| 2 | Baixa — pode acontecer mas é raro |
| 3 | Média — chance real de acontecer |
| 4 | Alta — provavelmente vai acontecer |
| 5 | Muito alta — quase certo |

**Impacto (I):** a consequência caso o risco se materialize, também numa escala de 1 a 5.

| I | Significado |
|---|-------------|
| 1 | Muito baixo — gera incômodo, sem afetar entrega |
| 2 | Baixo — atrasa uma tarefa pontual |
| 3 | Médio — atrasa entrega parcial ou exige retrabalho |
| 4 | Alto — compromete uma US ou tarefa crítica da release |
| 5 | Muito alto — inviabiliza a entrega da release no prazo |

O **Score** é o produto P × I e determina a classificação do risco:

| Faixa | Classificação | Ação esperada |
|-------|---------------|---------------|
| 1–6 | Baixo | Monitorar |
| 7–15 | Médio | Plano de mitigação resumido |
| 16–25 | Alto | Plano de resposta detalhado obrigatório |

Cada risco recebe uma **estratégia de tratamento**:

- **Mitigar** — reduzir a probabilidade ou o impacto com ações preventivas
- **Prevenir** — eliminar a causa raiz do risco antes que ele ocorra
- **Aceitar** — registrar o risco e seguir sem ação preventiva, monitorando
- **Transferir** — delegar a responsabilidade a um terceiro ou ferramenta

A matriz é revisada semanalmente pela liderança e atualizada conforme novos riscos surgem ou riscos existentes mudam de probabilidade/impacto ao longo do projeto.

---

## Matriz de Riscos — Release Major 1

| # | Risco | Categoria | Prob | Imp | Score | Estratégia | Plano de Resposta |
|---|-------|-----------|------|-----|-------|------------|-------------------|
| R01 | Mudanças tardias de escopo pelos POs | Cliente | 2 | 4 | 8 | Mitigar | PDF deixa claro escopo R1. Alteração só entra na R2. Registrar como decisão em MD. |
| R02 | Membros do time inativos no WhatsApp / sumindo | Equipe | 4 | 4 | **16** | Mitigar | Nunca alocar crítico exclusivamente a desengajado. Pareamento obrigatório. Daily cobra progresso. |
| R03 | Ausências por feriados, viagens ou outras disciplinas | Equipe | 5 | 3 | 15 | Mitigar | Levantar disponibilidade individual no início. |
| R04 | Deploy em produção quebra perto da entrega (27/04) | Técnico | 2 | 5 | 10 | Mitigar | Hello world deployado dia 19/04. Deploy intermediário a cada minor release. |
| R05 | Cobertura de testes não atinge 85% (CI bloqueia merge) | Qualidade | 4 | 4 | **16** | Mitigar | Branch protection bloqueia merge <85% desde PR #1. |
| R06 | Mudança de SSO para SIAPE atrasou | Escopo | 2 | 4 | 8 | Aceitar | Decisão fechada documentada em MD. Cadeado de escopo na R1. Qualquer rediscussão entra como débito para R2. |
| R07 | Docker no Windows com problemas de configuração | Infra | 3 | 2 | 6 | Mitigar | Time se ajuda no Discord. Setup documentado em README do back. |
| R08 | PR não revisado a tempo (gargalo na review) | Processo | 4 | 3 | 12 | Mitigar | Avisar abertura de PR no WhatsApp. Board segue fluxo da direita pra esquerda para dar prioridade às reviews. |
| R09 | Conflitos de merge complexos com 4 duplas paralelas | Técnico | 3 | 3 | 9 | Mitigar | Branches curtas (máx 2 dias). Rebase frequente da main. |
| R10 | Discrepância PT-BR vs EN entre back e front gera bugs | Técnico | 3 | 3 | 9 | Mitigar | Checklist no template de PR. Refator imediato se encontrar mistura. |
| R11 | Protótipos atrasarem e bloquearem devs frontend | Processo | 3 | 4 | 12 | Mitigar | Check diário. |
| R12 | Mocks no authService não removidos antes da entrega | Técnico | 3 | 3 | 9 | Mitigar | Flag VITE_USAR_MOCKS=true/false desde o início. Item explícito no checklist de pré-deploy: garantir flag false em produção. |
| R13 | SonarCloud quality gate falhar perto do code freeze | Qualidade | 3 | 4 | 12 | Mitigar | 1 dono de pipeline (Victor). Templates de workflow compartilhados. Code review observa code smells antes do PR subir. |
| R14 | Variáveis de ambiente sensíveis commitadas por engano | Segurança | 2 | 5 | 10 | Mitigar | .env no .gitignore desde commit 1. Pre-commit hook com gitleaks. Secrets reais só no Railway/Vercel. |
| R15 | Validação dos POs identifica gap não mapeado na apresentação | Cliente | 3 | 4 | 12 | Mitigar | Ensaio interno completo no domingo 26/04 com role-play. Checklist de critérios aberto na apresentação. |
| R16 | Falta de domínio sobre Microsoft Graph API (caso voltem ao SSO) | Técnico | 1 | 3 | 3 | Aceitar | Sem ação preventiva. Decisão de SSO já descartada para R1. |
| R17 | Setup inicial demorado por integração entre 4 repos | Processo | 2 | 3 | 6 | Mitigar | README claro em cada repo. Docker-compose unificado para back + banco. |
| R18 | Funcionalidade de email cair em produção (Resend/Gmail bloqueando) | Técnico | 2 | 3 | 6 | Mitigar | Spike TASK06 escolhe provedor confiável. Provedor secundário como fallback. Logar todos os envios. |

---

## Resumo

| Classificação | Quantidade | Riscos |
|---------------|------------|--------|
| Alto (≥16) | 2 | R02, R05 |
| Médio (7–15) | 12 | R01, R03, R04, R06, R08, R09, R10, R11, R13, R14, R15 |
| Baixo (≤6) | 4 | R07, R16, R17, R18 |

---

## Riscos materializados nas Releases Major 2 e 3

Ao longo das Releases Major 2 e 3, alguns riscos previstos na matriz efetivamente se materializaram. A tabela abaixo registra os principais, conectando-os à matriz e à resposta adotada.

| Risco da matriz | O que aconteceu | Resposta adotada |
|-----------------|-----------------|------------------|
| R02 / R03 — Saída e ausência de membros | A equipe foi reduzida de 12 para 8 integrantes ativos ao longo das releases (12 → 10 → 9 → 8), impactando a vazão das sprints | Reforço de pareamento e rotação de papéis; replanejamento de escopo (dashboards movidos para a Release Major 3) |
| R05 / R13 — Cobertura e Quality Gate no SonarCloud | O quality gate e o gate de cobertura de 85% bloquearam merges em vários momentos, exigindo esforço contínuo de testes | Cobertura tratada desde a abertura do PR; dono de pipeline acompanhando o SonarCloud |
| R08 — PR parado aguardando review | Identificado como o maior gargalo do fluxo: PRs ficavam parados esperando revisão | Aviso de abertura de PR nos canais do time; board priorizando as reviews (fluxo da direita para a esquerda) |
| R01 / R15 — Mudanças de escopo e gaps de validação | A validação dos POs reprovou parcialmente a criação de questões por faltarem campos estruturados para a IA, gerando retrabalho | Registro das mudanças como decisão; ajuste do backlog e do modelo de questão nas sprints seguintes |

> **Síntese da apresentação da Release 2:** os maiores desafios envolveram **mudanças de escopo e bloqueios técnicos**, **garantir que a cobertura de testes não caísse no SonarCloud** (quality gate travando) e o **gargalo de PRs parados aguardando revisão**.

---

## Cadência de monitoramento

| Frequência | O que verificar | Responsável |
|------------|-----------------|-------------|
| Diária (daily) | Status de cards, blockers, PRs sem review | Miguel ou Arthur |
| Diária | Dashboard de cobertura no SonarCloud | Miguel + Victor |
| Bi-semanal (seg e qui) | Riscos com score ≥ 12 | Miguel |
| Semanal (sextas) | Toda a matriz: revisar P, I e score | Miguel + Arthur |
| Pré-release | Checklist final + estado de riscos críticos | Liderança |

---

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 27/04/2026 | 1.0 | Criação da matriz de riscos da Release Major 1 | Equipe AnatoQuizUp |
| 02/06/2026 | 1.1 | Inclusão da seção de riscos materializados nas Releases Major 2 e 3 | [Miguel Moreira](https://github.com/EhOMiguel) |
