// Consolidador de indicadores — DA-R3
//
// Lê DA-R3/dados/*.json (brutos) e produz DA-R3/dados/dados-consolidados.json
// com os indicadores dos três eixos (Produto, Processo, Projeto), seguindo:
//  - Produto: modelo Q-Rapids/MeasureSoftGram com pesos do Plano de Qualidade
//    (docs/qualidade/qualidade.md): Complexidade 35%, Comentários 10%,
//    Duplicação 25%, Cobertura 30%; densidades normalizadas [0-1].
//  - Processo: Kanban — CFD, lead/cycle time, throughput e limites WIP pela
//    Lei de Little (WIP = TP × LT, Brechner) sobre os eventos reais do board.
//  - Projeto: AgileEVM (Sulaiman/Barton/Blackburn) em onda rolante: SPI em SP,
//    CPI em R$ com AC derivado da equipe efetiva por sprint (plano de custos).
//
// Uso: node consolidar.mjs

import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DADOS = join(AQUI, "..", "dados");
const RAIZ_REPO = join(AQUI, "..", "..");

const DIA_MS = 24 * 3600 * 1000;
const dias = (a, b) => (new Date(b) - new Date(a)) / DIA_MS;
const arred = (x, c = 2) => Math.round(x * 10 ** c) / 10 ** c;
const mediana = (v) => {
  if (v.length === 0) return null;
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const media = (v) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);

const ler = async (nome) => JSON.parse(await readFile(join(DADOS, nome), "utf8"));

const workspace = await ler("zenhub-workspace.json");
const { issues } = await ler("zenhub-issues.json");
const { eventos } = await ler("zenhub-eventos.json");
const github = await ler("github-issues.json");
const sonar = await ler("sonarcloud.json");
const sonarArq = await ler("sonarcloud-arquivos.json");

const HOJE = new Date().toISOString().slice(0, 10);

// ------------------------------------------------------------------ parâmetros

// Janelas de sprint na cadência documentada (docs/processo/sprints.md +
// releases minor). Planejado/entregue S1–S4: relatórios de sprint publicados.
// S5+: planejado vem das sprints ZenHub (mapeadas por maior sobreposição de
// janela), entregue é medido das issues fechadas na janela com estimate.
const SPRINTS = [
  { id: "S1", inicio: "2026-04-19", fim: "2026-04-26", equipe: 12, planejadoSP: 91, entregueSP: 71, fontePlanejado: "doc", fonteEntregue: "doc" },
  { id: "S2", inicio: "2026-04-27", fim: "2026-05-04", equipe: 10, planejadoSP: 31, entregueSP: 16, fontePlanejado: "doc", fonteEntregue: "doc" },
  { id: "S3", inicio: "2026-05-05", fim: "2026-05-11", equipe: 9, planejadoSP: 29, entregueSP: 26, fontePlanejado: "doc", fonteEntregue: "doc" },
  { id: "S4", inicio: "2026-05-12", fim: "2026-05-18", equipe: 9, planejadoSP: 25, entregueSP: 14, fontePlanejado: "doc", fonteEntregue: "doc" },
  { id: "S5", inicio: "2026-05-19", fim: "2026-05-25", equipe: 9, planejadoSP: 30, entregueSP: null, fontePlanejado: "doc", fonteEntregue: "zenhub" },
  { id: "S6", inicio: "2026-05-26", fim: "2026-06-01", equipe: 9, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S7", inicio: "2026-06-02", fim: "2026-06-08", equipe: 9, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S8", inicio: "2026-06-09", fim: "2026-06-15", equipe: 9, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S9", inicio: "2026-06-16", fim: "2026-06-22", equipe: 9, planejadoSP: null, entregueSP: null, fontePlanejado: "futuro", fonteEntregue: "futuro" },
  { id: "S10", inicio: "2026-06-23", fim: "2026-06-29", equipe: 9, planejadoSP: null, entregueSP: null, fontePlanejado: "futuro", fonteEntregue: "futuro" },
];

// Plano de custos (docs/processo/plano-de-custos.md), carga DOCUMENTADA de 14 h/sem
// por pessoa (4h presencial + 10h remota) — a mesma base do total de R$ 66.434,30
// (equipe completa de 12 × 17 semanas):
//   trabalho 309,02 + computador 13,46 + energia 1,26 + internet 1,39 = 325,13/pessoa
const CUSTO_POR_PESSOA_SEMANA = 309.02 + 13.46 + 1.26 + 1.39; // 325,13
const CUSTO_FIXO_SEMANA = 6.34; // Railway Hobby (fixo, por equipe)
// Baseline do PLANO = equipe completa no início do semestre (12). O PV/BAC do EVM usa
// esse plano; o AC usa a equipe EFETIVA de cada sprint (12→10→9→8), que encolheu.
const EQUIPE_BASELINE = 12;
const custoSemana = (pessoas) => pessoas * CUSTO_POR_PESSOA_SEMANA + CUSTO_FIXO_SEMANA;

const RELEASES = [
  { nome: "Release Major 1", tipo: "major", prazo: "2026-04-27" },
  { nome: "Release Minor 2", tipo: "minor", prazo: "2026-05-04" },
  { nome: "Release Minor 3", tipo: "minor", prazo: "2026-05-11" },
  { nome: "Release Major 2", tipo: "major", prazo: "2026-05-25" },
  { nome: "Release Minor 4", tipo: "minor", prazo: "2026-06-01" },
  { nome: "Release Minor 5", tipo: "minor", prazo: "2026-06-08" },
  { nome: "Release Minor 6", tipo: "minor", prazo: "2026-06-15" },
  { nome: "Release Major 3 (final)", tipo: "major", prazo: "2026-06-29" },
];

// Plano de Qualidade (docs/qualidade/qualidade.md)
const PESOS_QRAPIDS = { complexidade: 0.35, comentarios: 0.10, duplicacao: 0.25, cobertura: 0.30 };
const REPO_CURTO = {
  "fga-eps-mds_2026-1-AnatoQuizUp-Usuario-Service": "Usuario-Service",
  "fga-eps-mds_2026-1-AnatoQuizUp-Quiz-Service": "Quiz-Service",
  "fga-eps-mds_2026-1-AnatoQuizUp-BFF": "BFF",
  "fga-eps-mds_2026-1-AnatoQuizUp-Web": "Web",
};

// ------------------------------------------------------------------ EIXO PRODUTO

function densidadesQRapids(arquivos) {
  // Densidade = fração de arquivos dentro da faixa ideal do Plano de Qualidade
  const prod = arquivos.filter((a) => a.medidas.ncloc > 0);
  const comFuncoes = prod.filter((a) => (a.medidas.functions ?? 0) > 0);
  const comCobertura = prod.filter((a) => a.medidas.coverage !== undefined);
  const frac = (lista, pred) => (lista.length ? lista.filter(pred).length / lista.length : null);
  return {
    complexidade: frac(comFuncoes, (a) => a.medidas.complexity / a.medidas.functions <= 10),
    comentarios: frac(prod, (a) => (a.medidas.comment_lines_density ?? 0) >= 10 && (a.medidas.comment_lines_density ?? 0) <= 30),
    duplicacao: frac(prod, (a) => (a.medidas.duplicated_lines_density ?? 0) < 5),
    cobertura: frac(comCobertura, (a) => a.medidas.coverage >= 85),
    totalArquivos: prod.length,
  };
}

const produto = { porRepo: {}, global: {}, historico: {}, indicadores: {} };

{
  // Métricas atuais + densidades por repositório
  const todosArquivos = [];
  for (const [chave, arquivos] of Object.entries(sonarArq.projetos)) {
    const nome = REPO_CURTO[chave];
    const medidas = Object.fromEntries((sonar.atual[chave] ?? []).map((m) => [m.metric, Number(m.value)]));
    const dens = densidadesQRapids(arquivos);
    const qualidade =
      dens.complexidade * PESOS_QRAPIDS.complexidade +
      dens.comentarios * PESOS_QRAPIDS.comentarios +
      dens.duplicacao * PESOS_QRAPIDS.duplicacao +
      dens.cobertura * PESOS_QRAPIDS.cobertura;
    produto.porRepo[nome] = { medidas, densidades: dens, qualidadeProduto: arred(qualidade, 2) };
    todosArquivos.push(...arquivos);
  }

  // Densidades globais (todos os arquivos dos 4 repos juntos)
  const densGlobal = densidadesQRapids(todosArquivos);
  const qualidadeGlobal =
    densGlobal.complexidade * PESOS_QRAPIDS.complexidade +
    densGlobal.comentarios * PESOS_QRAPIDS.comentarios +
    densGlobal.duplicacao * PESOS_QRAPIDS.duplicacao +
    densGlobal.cobertura * PESOS_QRAPIDS.cobertura;
  produto.global = { densidades: densGlobal, qualidadeProduto: arred(qualidadeGlobal, 2) };

  // Histórico (SonarCloud search_history)
  for (const [chave, medidas] of Object.entries(sonar.historico)) {
    const nome = REPO_CURTO[chave];
    produto.historico[nome] = {};
    for (const m of medidas) {
      produto.historico[nome][m.metric] = (m.history ?? [])
        .filter((h) => h.value !== undefined)
        .map((h) => ({ data: h.date.slice(0, 10), valor: Number(h.value) }));
    }
  }
}

// Issues bem definidas (Bloqueios) — issues não-PR do GitHub com descrição
{
  const ghIssues = Object.values(github).flat().filter((i) => Array.isArray(i) ? false : !i.ehPr);
  const todas = Object.entries(github)
    .filter(([k]) => k !== "extraidoEm")
    .flatMap(([, v]) => v)
    .filter((i) => !i.ehPr);
  const comDescricao = todas.filter((i) => i.temDescricao).length;
  const fechadas = todas.filter((i) => i.fechadaEm).length;
  produto.indicadores.bloqueios = arred(comDescricao / todas.length, 2);
  produto.indicadores.conclusaoTarefas = arred(fechadas / todas.length, 2);
  produto.indicadores.detalheIssues = { total: todas.length, comDescricao, fechadas };
}

// Estabilidade de builds (Prontidão) — último export de runs por repo
{
  const pastas = ["BFF", "Quiz-Service", "Usuario-Service", "web"];
  let sucesso = 0, concluidas = 0;
  const porRepo = {};
  for (const pasta of pastas) {
    try {
      const dir = join(RAIZ_REPO, "analytics-raw-data", pasta);
      const arquivos = (await readdir(dir)).filter((f) => f.startsWith("GitHub_API-Runs-")).sort();
      if (arquivos.length === 0) continue;
      const runs = JSON.parse(await readFile(join(dir, arquivos.at(-1)), "utf8")).workflow_runs ?? [];
      const conc = runs.filter((r) => ["success", "failure"].includes(r.conclusion));
      const suc = conc.filter((r) => r.conclusion === "success");
      porRepo[pasta] = { sucesso: suc.length, concluidas: conc.length, arquivo: arquivos.at(-1) };
      sucesso += suc.length;
      concluidas += conc.length;
    } catch { /* pasta ausente */ }
  }
  produto.indicadores.estabilidadeBuilds = concluidas ? arred(sucesso / concluidas, 2) : null;
  produto.indicadores.buildsPorRepo = porRepo;
  produto.indicadores.prontidao = produto.indicadores.estabilidadeBuilds; // fórmula do Plano de Qualidade
  produto.indicadores.qualidadeProduto = produto.global.qualidadeProduto;
}

// ------------------------------------------------------------------ EIXO PROCESSO

const naoPr = issues.filter((i) => !i.ehPr);
const prs = issues.filter((i) => i.ehPr);
const mapaEventos = new Map(eventos.map((e) => [`${e.repo}#${e.numero}`, e.eventos]));

// Linha do tempo de pipelines de cada issue: [{pipeline, de, ate}]
function linhaDoTempo(issue) {
  const evs = (mapaEventos.get(`${issue.repo}#${issue.numero}`) ?? [])
    .filter((e) => e.type === "transferIssue")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const trechos = [];
  let pipelineAtual = evs.length ? evs[0].from_pipeline.name : (issue.pipeline ?? "New Issues");
  let inicio = issue.criadaEm;
  for (const e of evs) {
    trechos.push({ pipeline: pipelineAtual, de: inicio, ate: e.created_at });
    pipelineAtual = e.to_pipeline.name;
    inicio = e.created_at;
  }
  const fim = issue.fechadaEm ?? new Date().toISOString();
  trechos.push({ pipeline: pipelineAtual, de: inicio, ate: fim });
  return trechos;
}

const linhas = new Map(naoPr.map((i) => [i, linhaDoTempo(i)]));

// CFD diário desde a primeira sprint
const ORDEM_CFD = ["Closed", "Done", "Review/QA", "Blocked", "In Progress", "Rework", "Sprint Backlog", "Product Backlog", "Project Backlog", "Icebox", "New Issues"];
const cfd = [];
for (let d = new Date("2026-04-19"); d <= new Date(); d = new Date(d.getTime() + DIA_MS)) {
  const corte = new Date(d.getTime() + DIA_MS - 1); // fim do dia
  const contagem = Object.fromEntries(ORDEM_CFD.map((p) => [p, 0]));
  for (const [issue, trechos] of linhas) {
    if (new Date(issue.criadaEm) > corte) continue;
    if (issue.fechadaEm && new Date(issue.fechadaEm) <= corte) { contagem["Closed"]++; continue; }
    const trecho = trechos.find((t) => new Date(t.de) <= corte && corte < new Date(t.ate)) ?? trechos.at(-1);
    contagem[trecho.pipeline] = (contagem[trecho.pipeline] ?? 0) + 1;
  }
  cfd.push({ data: d.toISOString().slice(0, 10), ...contagem });
}

// Lead time e cycle time (issues fechadas)
const fechadas = naoPr.filter((i) => i.fechadaEm);
const passouEmProgresso = (i) => linhas.get(i).some((t) => t.pipeline === "In Progress");
const fluxoDeCodigo = fechadas.filter(passouEmProgresso);

const leadTimes = fechadas.map((i) => ({ repo: i.repo, numero: i.numero, titulo: i.titulo, dias: arred(dias(i.criadaEm, i.fechadaEm), 2), fechadaEm: i.fechadaEm.slice(0, 10), fluxo: passouEmProgresso(i) }));
const cycleTimes = fluxoDeCodigo.map((i) => {
  const entradaProgresso = linhas.get(i).find((t) => t.pipeline === "In Progress").de;
  return { repo: i.repo, numero: i.numero, dias: arred(dias(entradaProgresso, i.fechadaEm), 2), fechadaEm: i.fechadaEm.slice(0, 10) };
});

// Tempo médio por etapa (Lei de Little) — apenas issues que passaram pela etapa
const ETAPAS = ["Sprint Backlog", "In Progress", "Review/QA"];
const tempoPorEtapa = {};
for (const etapa of ETAPAS) {
  const duracoes = [];
  for (const i of fechadas) {
    const total = linhas.get(i).filter((t) => t.pipeline === etapa).reduce((s, t) => s + dias(t.de, t.ate), 0);
    if (total > 0) duracoes.push(total);
  }
  tempoPorEtapa[etapa] = { mediaDias: arred(media(duracoes) ?? 0, 2), medianaDias: arred(mediana(duracoes) ?? 0, 2), amostra: duracoes.length };
}

// Throughput: issues fechadas por semana (e por dia útil nas últimas 4 semanas)
const porSemana = {};
for (const i of fechadas) {
  const dt = new Date(i.fechadaEm);
  const seg = new Date(dt.getTime() - ((dt.getUTCDay() + 6) % 7) * DIA_MS).toISOString().slice(0, 10);
  porSemana[seg] = (porSemana[seg] ?? 0) + 1;
}
const semanas = Object.entries(porSemana).sort().map(([semana, qtd]) => ({ semana, fechadas: qtd }));
const corte4sem = new Date(Date.now() - 28 * DIA_MS);
const fechadas4sem = fluxoDeCodigo.filter((i) => new Date(i.fechadaEm) >= corte4sem);
const tpDiaUtil = fechadas4sem.length / 20; // 4 semanas × 5 dias úteis

// Lei de Little: WIP = TP × LT (TP da etapa gargalo; margem de 50% de Brechner)
const leiDeLittle = {
  tpDiaUtil: arred(tpDiaUtil, 2),
  base: "issues de fluxo de código fechadas nas últimas 4 semanas / 20 dias úteis",
  etapas: Object.fromEntries(ETAPAS.map((e) => {
    const lt = tempoPorEtapa[e].mediaDias;
    const wip = tpDiaUtil * lt;
    return [e, { ltMedioDias: lt, wipCalculado: Math.ceil(wip), wipComMargem50: Math.ceil(wip * 1.5) }];
  })),
};

// WIP atual por pipeline (issues abertas)
const wipAtual = {};
for (const i of naoPr.filter((x) => !x.fechadaEm)) wipAtual[i.pipeline ?? "(sem pipeline)"] = (wipAtual[i.pipeline ?? "(sem pipeline)"] ?? 0) + 1;

// PRs: throughput e tempo de revisão
const prsFechados = prs.filter((p) => p.fechadaEm);
const prPorSemana = {};
for (const p of prsFechados) {
  const dt = new Date(p.fechadaEm);
  const seg = new Date(dt.getTime() - ((dt.getUTCDay() + 6) % 7) * DIA_MS).toISOString().slice(0, 10);
  prPorSemana[seg] = (prPorSemana[seg] ?? 0) + 1;
}
const tempoRevisaoPr = prsFechados.map((p) => dias(p.criadaEm, p.fechadaEm));

// Higiene de dados do board.
// Distingue o débito REAL (itens trabalhados: fechados ou em pipeline ativa) do
// backlog normal (Icebox/Product/Project Backlog/New Issues), que legitimamente
// pode não ter estimate/sprint/responsável por ainda não ter sido planejado.
const PIPELINES_ATIVAS = ["Sprint Backlog", "In Progress", "Review/QA", "Blocked", "Rework"];
const trabalhada = (i) => Boolean(i.fechadaEm) || PIPELINES_ATIVAS.includes(i.pipeline);
const trab = naoPr.filter(trabalhada);
const higiene = {
  totalIssues: naoPr.length,
  semEstimate: naoPr.filter((i) => i.estimate == null).length,
  semResponsavel: naoPr.filter((i) => i.responsaveis.length === 0).length,
  semSprint: naoPr.filter((i) => i.sprints.length === 0).length,
  // débito real, só em itens trabalhados (é o que de fato compromete velocity/EVM)
  totalTrabalhadas: trab.length,
  semEstimateTrab: trab.filter((i) => i.estimate == null).length,
  semResponsavelTrab: trab.filter((i) => i.responsaveis.length === 0).length,
  semSprintTrab: trab.filter((i) => i.sprints.length === 0).length,
  fechadasEmLote1206: fechadas.filter((i) => i.fechadaEm.startsWith("2026-06-12T23:4")).length,
  paradasMais14d: naoPr.filter((i) => !i.fechadaEm && PIPELINES_ATIVAS.includes(i.pipeline) && dias(i.criadaEm, new Date().toISOString()) > 14).length,
};

// Distribuição por membro (issues fechadas + PRs de autoria)
const porMembro = {};
for (const i of fechadas) for (const r of i.responsaveis) {
  porMembro[r] ??= { issuesFechadas: 0, prs: 0 };
  porMembro[r].issuesFechadas++;
}
for (const [repo, itens] of Object.entries(github)) {
  if (repo === "extraidoEm") continue;
  for (const p of itens.filter((x) => x.ehPr && x.autor)) {
    porMembro[p.autor] ??= { issuesFechadas: 0, prs: 0 };
    porMembro[p.autor].prs++;
  }
}

// ===== MÉTRICAS ANALÍTICAS NOVAS (não existem no ZenHub) =====

// Flow Efficiency = cycle time / lead time. Fração do tempo em que a tarefa está
// sendo trabalhada vs esperando em fila. Lean/Kanban; ZenHub não calcula.
const ltMedianaFluxo = mediana(leadTimes.filter((l) => l.fluxo).map((l) => l.dias)) ?? 0;
const ctMediana = mediana(cycleTimes.map((c) => c.dias)) ?? 0;
const flowEfficiency = {
  valor: ltMedianaFluxo ? arred(ctMediana / ltMedianaFluxo, 3) : null,
  cycleMediana: arred(ctMediana, 2),
  leadMediana: arred(ltMedianaFluxo, 2),
  esperaMediana: arred(ltMedianaFluxo - ctMediana, 2),
};

// Taxa de retrabalho: issues de fluxo que passaram por Rework ou voltaram do Review/QA
function teveRetrabalho(issue) {
  const trechos = linhas.get(issue) ?? [];
  if (trechos.some((t) => t.pipeline === "Rework")) return true;
  for (let k = 1; k < trechos.length; k++) {
    if (trechos[k - 1].pipeline === "Review/QA" && ["In Progress", "Sprint Backlog", "Rework"].includes(trechos[k].pipeline)) return true;
  }
  return false;
}
const fluxoFechadas = fechadas.filter(passouEmProgresso);
const comRetrabalho = fluxoFechadas.filter(teveRetrabalho);
const retrabalho = {
  base: fluxoFechadas.length,
  comRetrabalho: comRetrabalho.length,
  taxa: fluxoFechadas.length ? arred(comRetrabalho.length / fluxoFechadas.length, 3) : null,
  exemplos: comRetrabalho.slice(0, 8).map((i) => `${i.repo.replace("2026-1-AnatoQuizUp-", "")}#${i.numero}`),
};

// Aging do WIP atual: itens abertos em pipeline ativa, dias na pipeline atual
const agora = new Date().toISOString();
const agingWip = naoPr
  .filter((i) => !i.fechadaEm && PIPELINES_ATIVAS.includes(i.pipeline))
  .map((i) => {
    const trechos = linhas.get(i);
    const entrada = trechos?.length ? trechos.at(-1).de : i.criadaEm;
    return { repo: i.repo.replace("2026-1-AnatoQuizUp-", ""), numero: i.numero, titulo: i.titulo, pipeline: i.pipeline, diasNaPipeline: arred(dias(entrada, agora), 1) };
  })
  .sort((a, b) => b.diasNaPipeline - a.diasNaPipeline);

// Lei de Little empírica: WIP (de pipelines ativas) ao longo do tempo, do CFD
const wipSerie = cfd.map((d) => ({
  data: d.data,
  wip: (d["In Progress"] ?? 0) + (d["Review/QA"] ?? 0) + (d["Sprint Backlog"] ?? 0) + (d["Blocked"] ?? 0) + (d["Rework"] ?? 0),
}));

// ===== Q-RAPIDS — Indicador Estratégico "Process Performance" =====
// Mapeia as métricas de fluxo do board para os fatores e assessed metrics do modelo
// Q-Rapids (Martínez-Fernández et al., IEEE Access 2019). Cada métrica é uma
// DENSIDADE [0–1] = fração dentro da faixa ideal, no mesmo espírito do eixo Produto.
// Limiares "user defined" do Q-Rapids: lead ≤ 14d, idade de WIP ≤ 14d, revisão de PR ≤ 2d.
const LIM_LEAD = 14, LIM_IDADE = 14, LIM_REVISAO = 2;
const ehBug = (i) => i.labels.some((l) => /bug/i.test(l)) || /\[bug\]/i.test(i.titulo);
const abertasNaoPr = naoPr.filter((i) => !i.fechadaEm);
const resolvidas = fechadas.filter((i) => !i.abandonado);
const fluxoResolvido = fluxoDeCodigo.filter((i) => !i.abandonado);
const totalNaoAband = naoPr.filter((i) => !i.abandonado).length;
const idadeAberta = (i) => dias(i.criadaEm, agora);
const dens = (num, den) => (den ? arred(num / den, 3) : null);

const qrTeamThroughput = dens(resolvidas.length, totalNaoAband);
const qrResolvedTP = dens(fluxoResolvido.filter((i) => dias(i.criadaEm, i.fechadaEm) <= LIM_LEAD).length, fluxoResolvido.length);
const qrOldIssues = dens(abertasNaoPr.filter((i) => idadeAberta(i) <= LIM_IDADE).length, abertasNaoPr.length);
const qrBugsRatio = dens(abertasNaoPr.filter((i) => !ehBug(i)).length, abertasNaoPr.length);
const qrCommitReview = dens(prsFechados.filter((p) => dias(p.criadaEm, p.fechadaEm) <= LIM_REVISAO).length, prsFechados.length);

const qrapids = {
  indicador: "Process Performance",
  referencia: "Q-Rapids (Martínez-Fernández et al., IEEE Access 2019)",
  limiares: { leadDias: LIM_LEAD, idadeDias: LIM_IDADE, revisaoDias: LIM_REVISAO },
  fatores: [
    {
      fator: "Issues' Velocity",
      descricao: "capacidade de fechar as issues planejadas (vazão, atualidade e qualidade do fluxo)",
      metricas: [
        { metrica: "Team Throughput", densidade: qrTeamThroughput, formula: "issues resolvidas / total de issues", bruto: `${resolvidas.length} / ${totalNaoAband}`, fonte: "ZenHub + GitHub" },
        { metrica: "Resolved Issues' Throughput", densidade: qrResolvedTP, formula: `resolvidas em ≤ ${LIM_LEAD}d / total resolvidas (fluxo de código)`, bruto: `${fluxoResolvido.filter((i) => dias(i.criadaEm, i.fechadaEm) <= LIM_LEAD).length} / ${fluxoResolvido.length}`, fonte: "ZenHub (eventos)" },
        { metrica: "Old Issues", densidade: qrOldIssues, formula: `issues abertas com idade ≤ ${LIM_IDADE}d / total abertas`, bruto: `${abertasNaoPr.filter((i) => idadeAberta(i) <= LIM_IDADE).length} / ${abertasNaoPr.length}`, fonte: "ZenHub" },
        { metrica: "Bugs Ratio", densidade: qrBugsRatio, formula: "issues abertas não-bug / total abertas", bruto: `${abertasNaoPr.filter((i) => !ehBug(i)).length} / ${abertasNaoPr.length}`, fonte: "GitHub (labels)" },
      ],
    },
    {
      fator: "Development Speed",
      descricao: "eficiência das atividades de integração contínua e revisão",
      metricas: [
        { metrica: "Commit review duration", densidade: qrCommitReview, formula: `PRs revisados em ≤ ${LIM_REVISAO}d / total de PRs fechados`, bruto: `${prsFechados.filter((p) => dias(p.criadaEm, p.fechadaEm) <= LIM_REVISAO).length} / ${prsFechados.length}`, fonte: "GitHub (PRs)" },
      ],
    },
  ],
};
qrapids.valor = arred(media([qrTeamThroughput, qrResolvedTP, qrOldIssues, qrBugsRatio, qrCommitReview].filter((v) => v != null)), 3);

// Dados brutos do processo: cada quantidade (num/den das densidades) com a fonte
// exata e o critério de coleta — "do zero", sem normalização. Só ZenHub + GitHub.
qrapids.dadosBrutos = [
  { quantidade: "Total de issues (não-PR)", valor: totalNaoAband, fonte: "ZenHub + GitHub", coleta: "todas as issues que não são Pull Request, exceto as encerradas na limpeza de board (abandonadas)" },
  { quantidade: "Issues resolvidas (fechadas)", valor: resolvidas.length, fonte: "ZenHub + GitHub", coleta: "issues não-PR com data de fechamento (closedAt), excluindo abandonadas" },
  { quantidade: "Issues de fluxo de código resolvidas", valor: fluxoResolvido.length, fonte: "ZenHub (eventos)", coleta: "issues fechadas que passaram pela pipeline 'In Progress', reconstruído dos eventos de movimentação do board" },
  { quantidade: `Issues de fluxo resolvidas em ≤ ${LIM_LEAD} dias`, valor: fluxoResolvido.filter((i) => dias(i.criadaEm, i.fechadaEm) <= LIM_LEAD).length, fonte: "ZenHub (eventos)", coleta: `das de fluxo, com (data de fechamento − data de criação) ≤ ${LIM_LEAD} dias` },
  { quantidade: "Issues abertas (total)", valor: abertasNaoPr.length, fonte: "ZenHub + GitHub", coleta: "issues não-PR sem data de fechamento" },
  { quantidade: `Issues abertas com idade ≤ ${LIM_IDADE} dias`, valor: abertasNaoPr.filter((i) => idadeAberta(i) <= LIM_IDADE).length, fonte: "ZenHub + GitHub", coleta: `das abertas, com (hoje − data de criação) ≤ ${LIM_IDADE} dias` },
  { quantidade: "Issues abertas não-bug", valor: abertasNaoPr.filter((i) => !ehBug(i)).length, fonte: "GitHub (labels)", coleta: "das abertas, sem a label \"bug\" e sem \"[BUG]\" no título" },
  { quantidade: "PRs fechados (total)", valor: prsFechados.length, fonte: "GitHub", coleta: "todos os Pull Requests com data de fechamento" },
  { quantidade: `PRs revisados em ≤ ${LIM_REVISAO} dias`, valor: prsFechados.filter((p) => dias(p.criadaEm, p.fechadaEm) <= LIM_REVISAO).length, fonte: "GitHub", coleta: `dos PRs fechados, com (data de fechamento − data de criação) ≤ ${LIM_REVISAO} dias` },
];

const processo = {
  pipelines: workspace.pipelines.map((p) => p.name),
  qrapids,
  flowEfficiency,
  retrabalho,
  agingWip,
  wipSerie,
  cfd,
  leadTime: {
    todas: { mediaDias: arred(media(leadTimes.map((l) => l.dias)), 2), medianaDias: arred(mediana(leadTimes.map((l) => l.dias)), 2), amostra: leadTimes.length },
    fluxoDeCodigo: { mediaDias: arred(media(leadTimes.filter((l) => l.fluxo).map((l) => l.dias)), 2), medianaDias: arred(mediana(leadTimes.filter((l) => l.fluxo).map((l) => l.dias)), 2), amostra: leadTimes.filter((l) => l.fluxo).length },
    pontos: leadTimes,
  },
  cycleTime: { mediaDias: arred(media(cycleTimes.map((c) => c.dias)), 2), medianaDias: arred(mediana(cycleTimes.map((c) => c.dias)), 2), amostra: cycleTimes.length, pontos: cycleTimes },
  tempoPorEtapa,
  throughputSemanal: semanas,
  leiDeLittle,
  wipAtual,
  prs: {
    total: prs.length,
    fechados: prsFechados.length,
    porSemana: Object.entries(prPorSemana).sort().map(([semana, qtd]) => ({ semana, fechados: qtd })),
    tempoRevisao: { mediaDias: arred(media(tempoRevisaoPr), 2), medianaDias: arred(mediana(tempoRevisaoPr), 2) },
  },
  higiene,
  porMembro,
};

// ------------------------------------------------------------------ EIXO PROJETO

// Pontos entregues medidos: issues não-PR com estimate fechadas na janela
function entregueMedido(inicio, fim) {
  const ini = new Date(inicio), f = new Date(new Date(fim).getTime() + DIA_MS - 1);
  return naoPr
    // exclui trackers de US no Doc que duplicam trabalho já contado no código (sem dupla contagem)
    // e exclui os cards encerrados na limpeza de board de 27/06 (abandonado, não entregue)
    .filter((i) => i.estimate != null && !i.possivelDuplicata && !i.abandonado && i.fechadaEm && new Date(i.fechadaEm) >= ini && new Date(i.fechadaEm) <= f)
    .reduce((s, i) => s + i.estimate, 0);
}

// Planejado por sprint = soma dos estimates das issues ATRIBUÍDAS àquela sprint
// (campo `sprints` da issue), contadas na primeira sprint em que foram planejadas.
// Período consistente com o entregue (ambos derivados das issues) e estável — não
// depende do `totalPoints` volátil das sprints do ZenHub, que mede janelas diferentes.
const zhSprints = workspace.sprints.nodes ?? workspace.sprints;
const sprintZhParaS = {}; // nome da sprint ZenHub -> id da janela S (maior sobreposição)
for (const z of zhSprints) {
  const zi = new Date(z.startAt), zf = new Date(z.endAt);
  let melhor = null, melhorOverlap = 0;
  for (const s of SPRINTS) {
    const ov = Math.min(zf, new Date(s.fim)) - Math.max(zi, new Date(s.inicio));
    if (ov > melhorOverlap) { melhorOverlap = ov; melhor = s.id; }
  }
  if (melhor) sprintZhParaS[z.name] = melhor;
}
const ordemS = Object.fromEntries(SPRINTS.map((s, idx) => [s.id, idx]));
const planejadoAtribuido = Object.fromEntries(SPRINTS.map((s) => [s.id, 0]));
for (const i of naoPr) {
  if (i.estimate == null || i.possivelDuplicata || i.abandonado) continue;
  const ids = [...new Set((i.sprints || []).map((n) => sprintZhParaS[n]).filter(Boolean))];
  if (!ids.length) continue;
  ids.sort((a, b) => ordemS[a] - ordemS[b]);
  planejadoAtribuido[ids[0]] += i.estimate; // conta na 1ª sprint em que foi planejada
}

const sprintsCalc = SPRINTS.map((s) => {
  const decorrida = new Date(s.fim) <= new Date();
  const emAndamento = !decorrida && new Date(s.inicio) <= new Date();
  let planejado = s.planejadoSP, fontePlanejado = s.fontePlanejado;
  if (planejado == null && (decorrida || emAndamento)) {
    planejado = planejadoAtribuido[s.id] ?? 0;
    fontePlanejado = "atribuição de sprint (estimates das issues planejadas no ZenHub)";
  }
  let entregue = s.entregueSP, fonteEntregue = s.fonteEntregue;
  if (entregue == null && (decorrida || emAndamento)) {
    entregue = entregueMedido(s.inicio, s.fim);
    fonteEntregue = "medido (issues fechadas na janela com estimate)";
  }
  const entregueMedidoJanela = entregueMedido(s.inicio, s.fim); // p/ comparação doc × medido
  return { ...s, decorrida, emAndamento, planejadoSP: planejado, entregueSP: entregue, fontePlanejado, fonteEntregue, entregueMedidoSP: entregueMedidoJanela, custoPlanejado: arred(custoSemana(EQUIPE_BASELINE), 2), custoReal: arred(custoSemana(s.equipe), 2) };
});

// Série EVM cumulativa — EVM ágil em story points (mesmo enquadramento do
// exemplo do professor: BAC/EV/SPI em SP), com o custo em R$ derivado do
// Plano de Custos para o CPI exigido:
//   PV(SP) = Σ planejado acumulado      EV(SP) = Σ entregue acumulado
//   SPI    = EV(SP) / PV(SP)            (aderência de escopo ao plano)
//   PV(R$) = custo baseline × n         (orçamento previsto acumulado)
//   EV(R$) = SPI × PV(R$)               (valor agregado em R$)
//   AC(R$) = custo real incorrido acumulado (equipe efetiva por sprint)
//   CPI    = EV(R$) / AC(R$)            (eficiência de custo)
//   BAC    = custo baseline × PS (release inteira) · EAC = BAC/CPI
//   ETC    = EAC − AC · VAC = BAC − EAC
const PS = SPRINTS.length;
const BAC = arred(custoSemana(EQUIPE_BASELINE) * PS, 2);
let pvSp = 0, evSp = 0, acR = 0, n = 0;
const serieEvm = [];
for (const s of sprintsCalc) {
  if (!s.decorrida && !s.emAndamento) continue;
  n += 1;
  pvSp += s.planejadoSP ?? 0;
  evSp += s.entregueSP ?? 0;
  acR += custoSemana(s.equipe);
  const spi = pvSp ? evSp / pvSp : null;
  const pvR = custoSemana(EQUIPE_BASELINE) * n;
  const evR = (spi ?? 0) * pvR;
  const cpi = acR ? evR / acR : null;
  serieEvm.push({
    sprint: s.id, fim: s.fim, emAndamento: s.emAndamento,
    prp: pvSp, pvPts: pvSp, evPts: evSp,
    spiSprint: s.planejadoSP ? arred((s.entregueSP ?? 0) / s.planejadoSP, 2) : null,
    pvReais: arred(pvR, 2), evReais: arred(evR, 2), acReais: arred(acR, 2),
    spi: arred(spi, 2), cpi: arred(cpi, 2),
    eac: cpi ? arred(BAC / cpi, 2) : null,
    etc: cpi ? arred(BAC / cpi - acR, 2) : null,
    vac: cpi ? arred(BAC - BAC / cpi, 2) : null,
  });
}

// Velocity e previsão de ritmo
const velocidades = sprintsCalc.filter((s) => s.decorrida).map((s) => s.entregueSP ?? 0);
const velocidadeMediana = mediana(velocidades);
// Backlog em aberto = TODAS as issues de trabalho abertas (com estimate ou não),
// exceto os épicos de release do repo de planejamento (2026-1-AnatoQuizUp).
const backlogAbertoItens = naoPr
  .filter((i) => !i.fechadaEm && i.repo !== "2026-1-AnatoQuizUp")
  .map((i) => ({ repo: i.repo, numero: i.numero, titulo: i.titulo, estimate: i.estimate, pipeline: i.pipeline }))
  .sort((a, b) => (b.estimate ?? 0) - (a.estimate ?? 0));
const backlogAbertoSP = backlogAbertoItens.reduce((s, i) => s + (i.estimate ?? 0), 0);
const sprintsRestantes = sprintsCalc.filter((s) => !s.decorrida).length;

// ===== MÉTRICAS ANALÍTICAS NOVAS (cruzam fontes; não existem no ZenHub) =====

// Custo por SP entregue (R$/SP) — eficiência de custo. Cruza Plano de Custos × velocity.
const custoPorSp = serieEvm.filter((e) => e.evPts > 0).map((e) => ({ sprint: e.sprint, acumulado: arred(e.acReais / e.evPts, 2) }));
const custoPorSpSprint = sprintsCalc.filter((s) => s.decorrida && (s.entregueSP ?? 0) > 0).map((s) => ({ sprint: s.id, valor: arred(s.custoReal / s.entregueSP, 2) }));

// Previsão Monte Carlo: amostra a velocity histórica até zerar o backlog restante.
const velsHist = sprintsCalc.filter((s) => s.decorrida).map((s) => s.entregueSP ?? 0).filter((v) => v > 0);
function monteCarlo(backlog, sims = 10000) {
  if (!velsHist.length || backlog <= 0) return null;
  const res = [];
  for (let k = 0; k < sims; k++) {
    let resto = backlog, n = 0;
    while (resto > 0 && n < 60) { resto -= velsHist[(Math.random() * velsHist.length) | 0]; n++; }
    res.push(n);
  }
  res.sort((a, b) => a - b);
  const pct = (p) => res[Math.min(res.length - 1, Math.floor(sims * p))];
  return { backlogSp: backlog, p50: pct(0.5), p85: pct(0.85), p95: pct(0.95), media: arred(media(res), 1), sprintsRestantes };
}
const monte = monteCarlo(backlogAbertoSP);

// Qualidade × Velocidade: por sprint, SP entregue vs cobertura média ao fim da sprint.
function coberturaNaData(dataIso) {
  const vals = [];
  for (const r of Object.keys(produto.historico)) {
    const ate = (produto.historico[r]?.coverage ?? []).filter((p) => p.data <= dataIso);
    if (ate.length) vals.push(ate.at(-1).valor);
  }
  return vals.length ? arred(media(vals), 1) : null;
}
const qualidadeVelocidade = sprintsCalc.filter((s) => s.decorrida).map((s) => ({ sprint: s.id, entregueSP: s.entregueSP, coberturaFim: coberturaNaData(s.fim) }));

// ===== PRP — Pontos Planejados por Release =====
// Agrupa o PV(SP) das sprints nas 3 releases major e evidencia ONDE o PRP mudou
// (a equipe encolheu de sprint a sprint, reduzindo a capacidade e o planejado).
const RELEASES_MAJOR = [
  { release: "R1", nome: "Release Major 1", prazo: "2026-04-27", ate: "2026-04-27" },
  { release: "R2", nome: "Release Major 2", prazo: "2026-05-25", ate: "2026-05-25" },
  { release: "R3", nome: "Release Major 3", prazo: "2026-06-29", ate: "2026-06-29" },
];
const releaseDaSprint = (s) =>
  new Date(s.fim) <= new Date("2026-04-27") ? "R1"
  : new Date(s.fim) <= new Date("2026-05-25") ? "R2" : "R3";
// PRP por sprint (com equipe) — base do "onde mudou": cada queda de equipe muda a capacidade
const prpPorSprint = sprintsCalc
  .filter((s) => s.decorrida || s.emAndamento)
  .map((s, i, arr) => ({
    sprint: s.id, release: releaseDaSprint(s), equipe: s.equipe,
    planejadoSP: s.planejadoSP ?? 0, entregueSP: s.entregueSP ?? 0,
    mudouEquipe: i > 0 && s.equipe !== arr[i - 1].equipe, // marca a sprint onde a equipe caiu
  }));
const prpReleases = RELEASES_MAJOR.map((r) => {
  const ss = sprintsCalc.filter((s) => (s.decorrida || s.emAndamento) && releaseDaSprint(s) === r.release);
  const eq = ss.map((s) => s.equipe);
  const prp = ss.reduce((a, s) => a + (s.planejadoSP ?? 0), 0);
  const entregue = ss.reduce((a, s) => a + (s.entregueSP ?? 0), 0);
  return {
    release: r.release, nome: r.nome, prazo: r.prazo,
    sprints: ss.map((s) => s.id),
    equipeInicial: eq[0] ?? null, equipeFinal: eq.at(-1) ?? null,
    equipeMin: eq.length ? Math.min(...eq) : null, equipeMax: eq.length ? Math.max(...eq) : null,
    prpSP: prp, entregueSP: entregue,
    spiRelease: prp ? arred(entregue / prp, 2) : null,
  };
});

const projeto = {
  parametros: {
    custoPorPessoaSemana: arred(CUSTO_POR_PESSOA_SEMANA, 2),
    custoFixoSemana: CUSTO_FIXO_SEMANA,
    equipeBaseline: EQUIPE_BASELINE,
    custoSemanaBaseline: arred(custoSemana(EQUIPE_BASELINE), 2),
    bac: BAC,
    ps: PS,
    totalSprints: SPRINTS.length,
  },
  sprints: sprintsCalc,
  evm: serieEvm,
  velocity: sprintsCalc.filter((s) => s.decorrida || s.emAndamento).map((s) => ({ sprint: s.id, planejado: s.planejadoSP, entregue: s.entregueSP, emAndamento: s.emAndamento })),
  previsao: {
    velocidadeMedianaSP: velocidadeMediana,
    backlogAbertoEstimadoSP: backlogAbertoSP,
    backlogAberto: backlogAbertoItens,
    sprintsRestantes,
    capacidadeRestanteSP: velocidadeMediana != null ? arred(velocidadeMediana * sprintsRestantes, 0) : null,
  },
  custoPorSp,
  custoPorSpSprint,
  monteCarlo: monte,
  qualidadeVelocidade,
  prp: { releases: prpReleases, porSprint: prpPorSprint },
  releases: RELEASES,
};

// ------------------------------------------------------------------ saída

const consolidado = {
  geradoEm: new Date().toISOString(),
  premissas: [
    "Produto: densidades Q-Rapids calculadas por arquivo (SonarCloud component_tree) com faixas ideais e pesos do Plano de Qualidade (complexidade 35%, comentários 10%, duplicação 25%, cobertura 30%).",
    "Produto: Bloqueios = issues com descrição / total (GitHub, repos públicos); Prontidão = builds com sucesso / concluídas (último export de runs por repo).",
    "Processo: linha do tempo de cada issue reconstruída dos eventos transferIssue do ZenHub; issues sem eventos permanecem no pipeline de criação até fechar.",
    "Processo: lead time = criação→fechamento; cycle time = 1ª entrada em In Progress→fechamento; 'fluxo de código' = issues que passaram por In Progress.",
    "Processo: limites WIP pela Lei de Little (WIP = TP × LT) com TP das últimas 4 semanas e margem de 50% (Brechner).",
    "Projeto: EVM ágil em story points (mesmo enquadramento do exemplo do professor) — PV(SP) = planejado acumulado; EV(SP) = entregue acumulado; SPI = EV/PV em SP. Planejado/entregue S1–S4 dos relatórios de sprint publicados; S5+ medido do ZenHub.",
    "Projeto: custo em R$ derivado do Plano de Custos para o CPI — PV(R$) = custo baseline (12 pessoas, R$ 3.907,90/sem) × sprints decorridas; EV(R$) = SPI × PV(R$); AC(R$) = custo real incorrido (equipe efetiva 12→10→9 × R$ 325,13/pessoa, carga de 14 h/sem); CPI = EV(R$)/AC(R$).",
    "Projeto: o baseline do PLANO é a equipe completa de 12 (início do semestre). O time não registra horas reais, então AC é aproximado pela equipe EFETIVA de cada sprint. Como a equipe encolheu de 12 para 9, o AC fica abaixo do PV: o projeto gasta MENOS que o orçado (CPI > 1, sob orçamento) mas entrega MENOS escopo que o planejado (SPI < 1) — dois desvios independentes, que é justamente o que o CPI≠SPI passa a revelar.",
    "Projeto: BAC = custo semanal baseline (12 pessoas, R$ 3.907,90) × PS = 10 sprints (S1 19/04 → S10 29/06) = R$ 39.079,00; EAC = BAC/CPI; VAC = BAC − EAC.",
    `Qualidade dos dados: ${higiene.semEstimate}/${higiene.totalIssues} issues sem estimate; ${higiene.semResponsavel} sem responsável; ${higiene.fechadasEmLote1206} fechadas em lote em 12/06 (limpeza de board) — análise crítica no notebook.`,
  ],
  produto,
  processo,
  projeto,
};

await writeFile(join(DADOS, "dados-consolidados.json"), JSON.stringify(consolidado, null, 1), "utf8");
console.log("dados-consolidados.json gerado.");

// Cópia em JS para os dashboards estáticos (funciona inclusive via file://)
const { mkdir } = await import("node:fs/promises");
const DIR_DASH = join(RAIZ_REPO, "docs", "dashboards");
await mkdir(DIR_DASH, { recursive: true });
await writeFile(join(DIR_DASH, "dados-consolidados.js"), `window.DADOS = ${JSON.stringify(consolidado)};\n`, "utf8");
console.log("docs/dashboards/dados-consolidados.js gerado.");

// ----- Datasets CSV (dados brutos baixáveis; espelham as tabelas dos dashboards)
const DIR_DATASETS = join(DIR_DASH, "datasets");
await mkdir(DIR_DATASETS, { recursive: true });
const toCsv = (headers, rows) => {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n") + "\n";
};
const escreverCsv = async (nome, headers, rows) => {
  await writeFile(join(DIR_DATASETS, nome), toCsv(headers, rows), "utf8");
  console.log(`  dataset: datasets/${nome} (${rows.length} linhas)`);
};
const sprintsAtivas = sprintsCalc.filter((s) => s.decorrida || s.emAndamento);

await escreverCsv("projeto-evm.csv",
  ["sprint", "equipe", "pv_sp", "ev_sp", "pv_reais", "ev_reais", "ac_reais", "spi", "cpi", "eac", "vac"],
  serieEvm.map((e) => {
    const s = sprintsCalc.find((x) => x.id === e.sprint);
    return [e.sprint, s?.equipe, e.pvPts, e.evPts, e.pvReais, e.evReais, e.acReais, e.spi, e.cpi, e.eac, e.vac];
  }));
await escreverCsv("projeto-insumos-sprint.csv",
  ["sprint", "inicio", "fim", "equipe", "planejado_sp", "fonte_planejado", "entregue_sp", "ac_reais"],
  sprintsAtivas.map((s) => [s.id, s.inicio, s.fim, s.equipe, s.planejadoSP, s.fontePlanejado, s.entregueSP, s.custoReal]));
await escreverCsv("projeto-backlog.csv",
  ["repo", "numero", "titulo", "estimate", "pipeline"],
  backlogAbertoItens.map((i) => [i.repo, i.numero, i.titulo, i.estimate, i.pipeline]));
await escreverCsv("projeto-prp.csv",
  ["release", "nome", "prazo", "sprints", "equipe_inicial", "equipe_final", "prp_sp", "entregue_sp", "spi_release"],
  prpReleases.map((r) => [r.release, r.nome, r.prazo, r.sprints.join(" "), r.equipeInicial, r.equipeFinal, r.prpSP, r.entregueSP, r.spiRelease]));
// Processo não exporta CSV: as métricas são densidades resumidas; os dados brutos
// (issues/PRs do ZenHub+GitHub) são exibidos com fonte e critério na própria página.
console.log("datasets CSV gerados em docs/dashboards/datasets/ (projeto).");
console.log("\n== Resumo ==");
console.log("Qualidade do Produto (global):", produto.global.qualidadeProduto);
console.log("Densidades globais:", JSON.stringify(produto.global.densidades));
console.log("Bloqueios:", produto.indicadores.bloqueios, "| Prontidão:", produto.indicadores.prontidao, "| Conclusão de tarefas:", produto.indicadores.conclusaoTarefas);
console.log("Lead time (fluxo de código) mediana:", processo.leadTime.fluxoDeCodigo.medianaDias, "dias | Cycle time mediana:", processo.cycleTime.medianaDias, "dias");
console.log("Lei de Little:", JSON.stringify(leiDeLittle.etapas));
console.log("WIP atual:", JSON.stringify(wipAtual));
console.log("\nSprints:");
for (const s of sprintsCalc.filter((x) => x.decorrida || x.emAndamento)) {
  console.log(` ${s.id} ${s.inicio}→${s.fim} plan=${s.planejadoSP} entregue=${s.entregueSP} (medido=${s.entregueMedidoSP}) equipe=${s.equipe}${s.emAndamento ? " [em andamento]" : ""}`);
}
console.log("\nEVM (última sprint decorrida):", JSON.stringify(serieEvm.at(-1)));
