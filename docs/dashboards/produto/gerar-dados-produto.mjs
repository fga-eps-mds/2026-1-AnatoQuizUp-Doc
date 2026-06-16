import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DOCS_RAIZ = join(AQUI, "..", "..", "..");
const RAW_DATA = join(DOCS_RAIZ, "analytics-raw-data");

const PESOS_QRAPIDS = { complexidade: 0.35, comentarios: 0.10, duplicacao: 0.25, cobertura: 0.30 };
const PESOS_NOTEBOOK = {
  codeQuality: { complexidade: 0.33, comentarios: 0.33, duplicacao: 0.33 },
  testingStatus: { testSuccess: 0.25, fastTests: 0.25, cobertura: 0.50 },
  maintainability: 0.50,
  reliability: 0.50,
};
const REPOS = [
  { nome: "Quiz-Service", pasta: "Quiz-Service", github: "2026-1-AnatoQuizUp-Quiz-Service" },
  { nome: "Usuario-Service", pasta: "Usuario-Service", github: "2026-1-AnatoQuizUp-Usuario-Service" },
  { nome: "Web", pasta: "web", github: "2026-1-AnatoQuizUp-Web" },
  { nome: "BFF", pasta: "BFF", github: "2026-1-AnatoQuizUp-BFF" },
];

const arred = (valor, casas = 2) => Number.isFinite(valor) ? Math.round(valor * 10 ** casas) / 10 ** casas : null;
const numero = (valor) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : undefined;
};

function dataArquivo(nome) {
  const match = nome.match(/(\d{2}-\d{2}-\d{4}-\d{2}-\d{2}-\d{2})/);
  if (!match) return null;
  const [mes, dia, ano, hora, minuto, segundo] = match[1].split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia, hora, minuto, segundo));
}

function dataTabela(nome) {
  const data = dataArquivo(nome ?? "");
  return data ? data.toISOString().slice(0, 10) : null;
}

function versaoArquivo(nome) {
  const match = (nome ?? "").match(/-(\d+\.\d+\.\d+)\.json$/);
  return match?.[1] ?? "N/A";
}

async function arquivosDaPasta(pasta) {
  try {
    return await readdir(join(RAW_DATA, pasta));
  } catch {
    return [];
  }
}

function escolherMaisRecente(arquivos, predicado) {
  return arquivos
    .filter(predicado)
    .map((nome) => ({ nome, data: dataArquivo(nome) }))
    .filter((item) => item.data)
    .sort((a, b) => a.data - b.data)
    .at(-1) ?? null;
}

async function lerJson(pasta, nome) {
  return JSON.parse(await readFile(join(RAW_DATA, pasta, nome), "utf8"));
}

function medidasParaObjeto(lista = []) {
  return Object.fromEntries(lista.map((m) => [m.metric, numero(m.value)]));
}

function medidasComponente(componente) {
  return medidasParaObjeto(componente?.measures ?? []);
}

function densidadesQRapids(componentes = []) {
  const arquivos = componentes
    .filter((c) => c.qualifier === "FIL")
    .map((c) => ({ caminho: c.path, medidas: medidasComponente(c) }))
    .filter((a) => (a.medidas.ncloc ?? 0) > 0);

  const comFuncoes = arquivos.filter((a) => (a.medidas.functions ?? 0) > 0);
  const comCobertura = arquivos.filter((a) => a.medidas.coverage !== undefined);
  const frac = (lista, pred) => lista.length ? lista.filter(pred).length / lista.length : null;

  return {
    complexidade: frac(comFuncoes, (a) => a.medidas.complexity / a.medidas.functions <= 10),
    comentarios: frac(arquivos, (a) => (a.medidas.comment_lines_density ?? 0) >= 10 && (a.medidas.comment_lines_density ?? 0) <= 30),
    duplicacao: frac(arquivos, (a) => (a.medidas.duplicated_lines_density ?? 0) < 5),
    cobertura: frac(comCobertura, (a) => a.medidas.coverage >= 85),
    totalArquivos: arquivos.length,
  };
}

function qualidadeProduto(dens) {
  const parcelas = Object.entries(PESOS_QRAPIDS)
    .filter(([nome]) => Number.isFinite(dens[nome]))
    .map(([nome, peso]) => dens[nome] * peso);
  return parcelas.length ? arred(parcelas.reduce((a, b) => a + b, 0), 2) : null;
}

function metricasTeste(componentes = []) {
  const testes = componentes
    .filter((c) => c.qualifier === "UTS")
    .map((c) => medidasComponente(c));

  const totalTestes = testes.reduce((total, m) => total + (m.tests ?? 0), 0);
  const erros = testes.reduce((total, m) => total + (m.test_errors ?? 0), 0);
  const falhas = testes.reduce((total, m) => total + (m.test_failures ?? 0), 0);
  const comTempo = testes.filter((m) => Number.isFinite(m.test_execution_time));
  const rapidos = comTempo.filter((m) => m.test_execution_time < 300000);

  return {
    testSuccess: totalTestes ? (totalTestes - erros - falhas) / totalTestes : null,
    fastTests: comTempo.length ? rapidos.length / comTempo.length : null,
  };
}

function metricasTabela(latestSonar, medidas, densidades) {
  const testes = metricasTeste(latestSonar?.payload?.components ?? []);
  const testSuccess = testes.testSuccess ?? 0;
  const fastTests = testes.fastTests ?? 1;
  const cobertura = densidades.cobertura ?? null;

  const codeQuality = [densidades.complexidade, densidades.comentarios, densidades.duplicacao].every(Number.isFinite)
    ? (
      densidades.complexidade * PESOS_NOTEBOOK.codeQuality.complexidade
      + densidades.comentarios * PESOS_NOTEBOOK.codeQuality.comentarios
      + densidades.duplicacao * PESOS_NOTEBOOK.codeQuality.duplicacao
    )
    : null;

  const testingStatus = Number.isFinite(cobertura)
    ? (
      testSuccess * PESOS_NOTEBOOK.testingStatus.testSuccess
      + fastTests * PESOS_NOTEBOOK.testingStatus.fastTests
      + cobertura * PESOS_NOTEBOOK.testingStatus.cobertura
    )
    : null;

  const maintainability = Number.isFinite(codeQuality) ? codeQuality * PESOS_NOTEBOOK.maintainability : null;
  const reliability = Number.isFinite(testingStatus) ? testingStatus * PESOS_NOTEBOOK.reliability : null;

  return {
    versao: versaoArquivo(latestSonar?.nome),
    data: dataTabela(latestSonar?.nome),
    ncloc: medidas.ncloc ?? null,
    complexity: arred(densidades.complexidade, 4),
    comments: arred(densidades.comentarios, 4),
    duplication: arred(densidades.duplicacao, 4),
    testSuccess: arred(testSuccess, 4),
    fastTests: arred(fastTests, 4),
    coverage: arred(cobertura, 4),
    maintainability: arred(maintainability, 4),
    reliability: arred(reliability, 4),
    scoreTotal: arred(Number.isFinite(maintainability) && Number.isFinite(reliability) ? maintainability + reliability : null, 4),
  };
}

function historicoSonar(sonarFiles) {
  const serie = {};
  for (const item of sonarFiles) {
    const medidas = medidasParaObjeto(item.payload?.baseComponent?.measures ?? []);
    const data = item.data.toISOString().slice(0, 10);
    for (const [metric, valor] of Object.entries(medidas)) {
      if (valor === undefined) continue;
      serie[metric] ??= [];
      serie[metric].push({ data, valor });
    }
  }
  return serie;
}

function estabilidadeBuilds(payload) {
  const runs = payload?.workflow_runs ?? [];
  const concluidas = runs.filter((r) => ["success", "failure"].includes(r.conclusion));
  const sucesso = concluidas.filter((r) => r.conclusion === "success");
  return {
    sucesso: sucesso.length,
    concluidas: concluidas.length,
    estabilidade: concluidas.length ? arred(sucesso.length / concluidas.length, 2) : null,
  };
}

function indicadoresIssues(payload, githubRepo) {
  const itens = Array.isArray(payload) ? payload : payload?.items ?? payload?.issues ?? [];
  const issues = itens.filter((i) => !i.ehPr && !i.pull_request && (!i.repository || i.repository?.name === githubRepo));
  const comDescricao = issues.filter((i) => i.temDescricao ?? Boolean(i.body)).length;
  const fechadas = issues.filter((i) => i.fechadaEm ?? i.closed_at).length;
  return {
    bloqueios: issues.length ? arred(comDescricao / issues.length, 2) : null,
    conclusaoTarefas: issues.length ? arred(fechadas / issues.length, 2) : null,
    detalheIssues: { total: issues.length, comDescricao, fechadas },
  };
}

async function montarRepositorio(repo) {
  const arquivos = await arquivosDaPasta(repo.pasta);
  const sonarCandidates = arquivos
    .filter((nome) => nome.endsWith(".json"))
    .filter((nome) => !nome.startsWith("GitHub_API-"))
    .filter((nome) => nome !== "latest.json")
    .map((nome) => ({ nome, data: dataArquivo(nome) }))
    .filter((item) => item.data)
    .sort((a, b) => a.data - b.data);

  const sonarFiles = [];
  for (const item of sonarCandidates) {
    sonarFiles.push({ ...item, payload: await lerJson(repo.pasta, item.nome) });
  }

  const latestSonar = sonarFiles.at(-1);
  const latestRuns = escolherMaisRecente(arquivos, (nome) => nome.startsWith("GitHub_API-Runs-") && nome.endsWith(".json"));
  const latestIssues = escolherMaisRecente(arquivos, (nome) => nome.startsWith("GitHub_API-Issues-") && nome.endsWith(".json"));

  const medidas = medidasParaObjeto(latestSonar?.payload?.baseComponent?.measures ?? []);
  const densidades = densidadesQRapids(latestSonar?.payload?.components ?? []);
  const qualidade = qualidadeProduto(densidades);
  const builds = latestRuns ? estabilidadeBuilds(await lerJson(repo.pasta, latestRuns.nome)) : { sucesso: 0, concluidas: 0, estabilidade: null };
  const issues = latestIssues ? indicadoresIssues(await lerJson(repo.pasta, latestIssues.nome), repo.github) : {
    bloqueios: null,
    conclusaoTarefas: null,
    detalheIssues: { total: 0, comDescricao: 0, fechadas: 0 },
  };

  return {
    medidas,
    densidades,
    tabela: metricasTabela(latestSonar, medidas, densidades),
    qualidadeProduto: qualidade,
    indicadores: {
      qualidadeProduto: qualidade,
      bloqueios: issues.bloqueios,
      conclusaoTarefas: issues.conclusaoTarefas,
      estabilidadeBuilds: builds.estabilidade,
      prontidao: builds.estabilidade,
      detalheIssues: issues.detalheIssues,
      detalheBuilds: { sucesso: builds.sucesso, concluidas: builds.concluidas },
    },
    historico: historicoSonar(sonarFiles),
    snapshot: {
      sonar: latestSonar?.nome ?? null,
      runs: latestRuns?.nome ?? null,
      issues: latestIssues?.nome ?? null,
    },
  };
}

const porRepo = {};
for (const repo of REPOS) {
  porRepo[repo.nome] = await montarRepositorio(repo);
}

const saida = {
  geradoEm: new Date().toISOString(),
  fonte: "analytics-raw-data",
  pesos: PESOS_QRAPIDS,
  repositorios: REPOS.map((r) => r.nome),
  porRepo,
};

await writeFile(join(AQUI, "dados-produto.js"), `window.DADOS_PRODUTO = ${JSON.stringify(saida)};\n`, "utf8");
console.log("docs/dashboards/produto/dados-produto.js gerado.");
for (const repo of REPOS) {
  const dados = porRepo[repo.nome];
  console.log(`${repo.nome}: sonar=${dados.snapshot.sonar ?? "N/A"} qualidade=${dados.qualidadeProduto ?? "N/A"} prontidao=${dados.indicadores.prontidao ?? "N/A"}`);
}
