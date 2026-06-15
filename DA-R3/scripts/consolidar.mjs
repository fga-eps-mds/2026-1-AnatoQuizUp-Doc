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
  { id: "S6", inicio: "2026-05-26", fim: "2026-06-01", equipe: 8, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S7", inicio: "2026-06-02", fim: "2026-06-08", equipe: 8, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S8", inicio: "2026-06-09", fim: "2026-06-15", equipe: 8, planejadoSP: null, entregueSP: null, fontePlanejado: "zenhub", fonteEntregue: "zenhub" },
  { id: "S9", inicio: "2026-06-16", fim: "2026-06-22", equipe: 8, planejadoSP: null, entregueSP: null, fontePlanejado: "futuro", fonteEntregue: "futuro" },
  { id: "S10", inicio: "2026-06-23", fim: "2026-06-29", equipe: 8, planejadoSP: null, entregueSP: null, fontePlanejado: "futuro", fonteEntregue: "futuro" },
];

// Plano de custos (docs/processo/plano-de-custos.md), regime de 4 h/sem por
// pessoa adotado nos EVMs das sprints 2–5:
//   trabalho 309,02×(4/14) + computador 13,46 + energia 1,26×(4/10) + internet 1,39×(4/10)
const CUSTO_POR_PESSOA_SEMANA = 88.29 + 13.46 + 0.504 + 0.556; // 102,81
const CUSTO_FIXO_SEMANA = 6.34; // Railway Hobby
const EQUIPE_BASELINE = 9; // baseline do plano de custos
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

const processo = {
  pipelines: workspace.pipelines.map((p) => p.name),
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
    .filter((i) => i.estimate != null && !i.possivelDuplicata && i.fechadaEm && new Date(i.fechadaEm) >= ini && new Date(i.fechadaEm) <= f)
    .reduce((s, i) => s + i.estimate, 0);
}

// Planejado via sprint ZenHub com maior sobreposição de janela
const zhSprints = workspace.sprints.nodes ?? workspace.sprints;
function planejadoZenhub(inicio, fim) {
  const ini = new Date(inicio), f = new Date(fim);
  let melhor = null, melhorOverlap = 0;
  for (const s of zhSprints) {
    const si = new Date(s.startAt), sf = new Date(s.endAt);
    const overlap = Math.min(f, sf) - Math.max(ini, si);
    if (overlap > melhorOverlap) { melhorOverlap = overlap; melhor = s; }
  }
  return melhor ? { pontos: melhor.totalPoints ?? 0, sprintZenhub: melhor.name } : { pontos: 0, sprintZenhub: null };
}

const sprintsCalc = SPRINTS.map((s) => {
  const decorrida = new Date(s.fim) <= new Date();
  const emAndamento = !decorrida && new Date(s.inicio) <= new Date();
  let planejado = s.planejadoSP, fontePlanejado = s.fontePlanejado;
  if (planejado == null && (decorrida || emAndamento)) {
    const zh = planejadoZenhub(s.inicio, s.fim);
    planejado = zh.pontos;
    fontePlanejado = `zenhub (${zh.sprintZenhub})`;
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
const backlogAbertoSP = naoPr.filter((i) => !i.fechadaEm && i.estimate != null).reduce((s, i) => s + i.estimate, 0);
const sprintsRestantes = sprintsCalc.filter((s) => !s.decorrida).length;

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
    sprintsRestantes,
    capacidadeRestanteSP: velocidadeMediana != null ? arred(velocidadeMediana * sprintsRestantes, 0) : null,
  },
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
    "Projeto: custo em R$ derivado do Plano de Custos para o CPI — PV(R$) = custo baseline (9 pessoas) × sprints decorridas; EV(R$) = SPI × PV(R$); AC(R$) = custo real incorrido (equipe efetiva 12,10,9,9,9,8,8,8 × regime de 4 h/sem); CPI = EV(R$)/AC(R$).",
    "Projeto: o time não registra horas reais desde a S1, então AC é aproximado pela equipe efetiva — substituir por horas reais se voltarem a ser registradas. SPI e CPI ficam próximos porque a equipe efetiva (média ~9,3) acompanhou o baseline de 9; o desvio de 1,0 é quase todo de escopo, não de custo.",
    "Projeto: BAC = custo semanal baseline (9 pessoas, R$ 931,63) × PS = 10 sprints (S1 19/04 → S10 29/06) = R$ 9.316,30; EAC = BAC/CPI; VAC = BAC − EAC.",
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
