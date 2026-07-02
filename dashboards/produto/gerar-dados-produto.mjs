import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DOCS_RAIZ = join(AQUI, "..", "..", "..");
const RAW_DATA = join(DOCS_RAIZ, "analytics-raw-data");
const TEST_RESULTS_MANUAIS = join(RAW_DATA, "test-results-manuais");

const FORMATADOR_DIA_LOCAL = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

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

function diaLocal(data) {
  const partes = Object.fromEntries(
    FORMATADOR_DIA_LOCAL.formatToParts(data).map((parte) => [parte.type, parte.value]),
  );
  return `${partes.year}-${partes.month}-${partes.day}`;
}

function dataTabela(nome) {
  const data = dataArquivo(nome ?? "");
  return data ? diaLocal(data) : null;
}

function releaseDaData(data) {
  if (!data) return null;
  const dia = diaLocal(data);
  if (dia >= "2026-03-16" && dia <= "2026-04-27") return 1;
  if (dia >= "2026-04-28" && dia <= "2026-05-25") return 2;
  if (dia >= "2026-05-26" && dia <= "2026-06-29") return 3;
  return null;
}

function versaoArquivo(nome) {
  const match = (nome ?? "").match(/-(\d+\.\d+\.\d+)\.json$/);
  if (!match) return "N/A";
  const [, minor = "0", patch = "0"] = match[1].split(".");
  const release = releaseDaData(dataArquivo(nome));
  return release ? `${release}.${minor}.${patch}` : match[1];
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

async function lerResultadoTestesManual(repo) {
  try {
    const payload = JSON.parse((await readFile(join(TEST_RESULTS_MANUAIS, `${repo}.json`), "utf8")).replace(/^\uFEFF/, ""));
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.resultados)) return payload.resultados;
    return payload ? [payload] : [];
  } catch {
    return [];
  }
}

function dataResultadoManual(resultadoManual) {
  return resultadoManual?.dataColeta ?? resultadoManual?.data ?? resultadoManual?.collectedAt ?? null;
}

function sonarDoResultadoManual(sonarFiles, resultadoManual) {
  const dataManual = dataResultadoManual(resultadoManual);
  if (!dataManual) return sonarFiles.at(-1) ?? null;
  return sonarFiles.filter((item) => dataTabela(item.nome) <= dataManual).at(-1) ?? null;
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

  const comCobertura = arquivos.filter((a) => a.medidas.coverage !== undefined);
  const conta = (lista, pred) => lista.filter(pred).length;
  const fracao = (parte, total) => total ? parte / total : null;
  const arquivosNaoComplexos = conta(arquivos, (a) => {
    const funcoes = a.medidas.functions ?? 0;
    return funcoes === 0 || (a.medidas.complexity ?? 0) / funcoes <= 10;
  });
  const arquivosComentariosOk = conta(arquivos, (a) => (a.medidas.comment_lines_density ?? 0) >= 10 && (a.medidas.comment_lines_density ?? 0) <= 30);
  const arquivosDuplicacaoOk = conta(arquivos, (a) => (a.medidas.duplicated_lines_density ?? 0) < 5);
  const arquivosCoberturaOk = conta(comCobertura, (a) => a.medidas.coverage >= 80);

  return {
    complexidade: fracao(arquivosNaoComplexos, arquivos.length),
    comentarios: fracao(arquivosComentariosOk, arquivos.length),
    duplicacao: fracao(arquivosDuplicacaoOk, arquivos.length),
    cobertura: fracao(arquivosCoberturaOk, comCobertura.length),
    totalArquivos: arquivos.length,
    brutos: {
      totalArquivos: arquivos.length,
      arquivosNaoComplexos,
      arquivosComentariosOk,
      arquivosDuplicacaoOk,
      totalArquivosComCobertura: comCobertura.length,
      arquivosCoberturaOk,
    },
  };
}

function qualidadeProduto(dens) {
  const parcelas = Object.entries(PESOS_QRAPIDS)
    .filter(([nome]) => Number.isFinite(dens[nome]))
    .map(([nome, peso]) => dens[nome] * peso);
  return parcelas.length ? arred(parcelas.reduce((a, b) => a + b, 0), 2) : null;
}

function metricasTeste(medidas = {}, runs = [], resultadoManual = null) {
  const totalTestesManual = resultadoManual?.numTotalTests;
  const errosManual = resultadoManual?.numRuntimeErrorTestSuites;
  const falhasManual = resultadoManual?.numFailedTests;
  const totalTestes = Number.isFinite(totalTestesManual) ? totalTestesManual : medidas.tests;
  const erros = Number.isFinite(errosManual) ? errosManual : medidas.test_errors;
  const falhas = Number.isFinite(falhasManual) ? falhasManual : medidas.test_failures;
  const possuiContagens = Number.isFinite(totalTestes)
    && totalTestes > 0
    && Number.isFinite(erros)
    && Number.isFinite(falhas);
  const buildsDeTeste = runs
    .filter((run) => run.status === "completed" && /(^|\W)ci(\W|$)/i.test(run.name ?? ""))
    .map((run) => ({ inicio: new Date(run.run_started_at), fim: new Date(run.updated_at) }))
    .filter(({ inicio, fim }) => Number.isFinite(inicio.getTime()) && Number.isFinite(fim.getTime()) && fim >= inicio);
  const buildsRapidos = buildsDeTeste.filter(({ inicio, fim }) => fim - inicio < 300000);

  return {
    testSuccess: possuiContagens
      ? Math.max(0, totalTestes - erros - falhas) / totalTestes
      : null,
    fastTests: buildsDeTeste.length ? buildsRapidos.length / buildsDeTeste.length : null,
    brutos: {
      fonte: resultadoManual ? "manual" : "sonar",
      totalTestes: Number.isFinite(totalTestes) ? totalTestes : null,
      testesAprovados: possuiContagens ? Math.max(0, totalTestes - erros - falhas) : null,
      falhas: Number.isFinite(falhas) ? falhas : null,
      erros: Number.isFinite(erros) ? erros : null,
      suitesFalhando: Number.isFinite(resultadoManual?.numFailedTestSuites) ? resultadoManual.numFailedTestSuites : null,
      totalSuites: Number.isFinite(resultadoManual?.numTotalTestSuites) ? resultadoManual.numTotalTestSuites : null,
      buildsCiConcluidas: buildsDeTeste.length,
      buildsCiRapidas: buildsRapidos.length,
    },
  };
}

function metricasTabela(latestSonar, medidas, densidades, runs = [], resultadoManual = null) {
  const testes = metricasTeste(medidas, runs, resultadoManual);
  const testSuccess = testes.testSuccess;
  const fastTests = testes.fastTests;
  const cobertura = densidades.cobertura ?? null;

  const codeQuality = [densidades.complexidade, densidades.comentarios, densidades.duplicacao].every(Number.isFinite)
    ? (
      densidades.complexidade * PESOS_NOTEBOOK.codeQuality.complexidade
      + densidades.comentarios * PESOS_NOTEBOOK.codeQuality.comentarios
      + densidades.duplicacao * PESOS_NOTEBOOK.codeQuality.duplicacao
    )
    : null;

  const testingStatus = [testSuccess, fastTests, cobertura].every(Number.isFinite)
    ? (
      testSuccess * PESOS_NOTEBOOK.testingStatus.testSuccess
      + fastTests * PESOS_NOTEBOOK.testingStatus.fastTests
      + cobertura * PESOS_NOTEBOOK.testingStatus.cobertura
    )
    : null;

  const maintainability = Number.isFinite(codeQuality) ? codeQuality * PESOS_NOTEBOOK.maintainability : null;
  const reliability = Number.isFinite(testingStatus) ? testingStatus * PESOS_NOTEBOOK.reliability : null;

  return {
    release: releaseDaData(dataArquivo(latestSonar?.nome)),
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
    brutos: {
      sonar: {
        arquivo: latestSonar?.nome ?? null,
        ncloc: medidas.ncloc ?? null,
        complexity: medidas.complexity ?? null,
        commentLinesDensity: medidas.comment_lines_density ?? null,
        duplicatedLinesDensity: medidas.duplicated_lines_density ?? null,
        coverage: medidas.coverage ?? null,
        files: medidas.files ?? null,
        functions: medidas.functions ?? null,
        securityRating: medidas.security_rating ?? null,
      },
      qrapids: densidades.brutos ?? null,
      testes: testes.brutos ?? null,
      manual: resultadoManual ?? null,
    },
  };
}

function recalcularFatores(linha) {
  const codeQuality = [linha.complexity, linha.comments, linha.duplication].every(Number.isFinite)
    ? linha.complexity * PESOS_NOTEBOOK.codeQuality.complexidade
      + linha.comments * PESOS_NOTEBOOK.codeQuality.comentarios
      + linha.duplication * PESOS_NOTEBOOK.codeQuality.duplicacao
    : null;
  const testingStatus = [linha.testSuccess, linha.fastTests, linha.coverage].every(Number.isFinite)
    ? linha.testSuccess * PESOS_NOTEBOOK.testingStatus.testSuccess
      + linha.fastTests * PESOS_NOTEBOOK.testingStatus.fastTests
      + linha.coverage * PESOS_NOTEBOOK.testingStatus.cobertura
    : null;

  linha.maintainability = arred(Number.isFinite(codeQuality) ? codeQuality * PESOS_NOTEBOOK.maintainability : null, 4);
  linha.reliability = arred(Number.isFinite(testingStatus) ? testingStatus * PESOS_NOTEBOOK.reliability : null, 4);
  linha.scoreTotal = arred(
    Number.isFinite(linha.maintainability) && Number.isFinite(linha.reliability)
      ? linha.maintainability + linha.reliability
      : null,
    4,
  );
  return linha;
}

function preencherAtributosAusentes(linhas) {
  const campos = ["ncloc", "complexity", "comments", "duplication", "fastTests", "coverage"];
  const ultimoValor = {};
  const ultimaOrigem = {};

  for (let indice = linhas.length - 1; indice >= 0; indice -= 1) {
    const linha = linhas[indice];
    linha.herdados = {};
    for (const campo of campos) {
      if (Number.isFinite(linha[campo])) {
        ultimoValor[campo] = linha[campo];
        ultimaOrigem[campo] = linha.data;
      } else if (Number.isFinite(ultimoValor[campo])) {
        linha[campo] = ultimoValor[campo];
        linha.herdados[campo] = ultimaOrigem[campo];
      }
    }
    recalcularFatores(linha);
  }
  return linhas;
}

function historicoSonar(sonarFiles) {
  const serie = {};
  for (const item of sonarFiles) {
    const medidas = medidasParaObjeto(item.payload?.baseComponent?.measures ?? []);
    const data = dataTabela(item.nome);
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

  const runsCandidates = arquivos
    .filter((nome) => nome.startsWith("GitHub_API-Runs-") && nome.endsWith(".json"))
    .map((nome) => ({ nome, data: dataArquivo(nome) }))
    .filter((item) => item.data)
    .sort((a, b) => a.data - b.data);
  const runsFiles = [];
  for (const item of runsCandidates) {
    runsFiles.push({ ...item, payload: await lerJson(repo.pasta, item.nome) });
  }

  const latestSonar = sonarFiles.at(-1);
  const latestRuns = runsFiles.at(-1);
  const latestIssues = escolherMaisRecente(arquivos, (nome) => nome.startsWith("GitHub_API-Issues-") && nome.endsWith(".json"));
  const resultadosTestesManuais = await lerResultadoTestesManual(repo.nome);

  const medidas = medidasParaObjeto(latestSonar?.payload?.baseComponent?.measures ?? []);
  const densidades = densidadesQRapids(latestSonar?.payload?.components ?? []);
  const qualidade = qualidadeProduto(densidades);
  const runsPayload = latestRuns?.payload ?? null;
  const builds = runsPayload ? estabilidadeBuilds(runsPayload) : { sucesso: 0, concluidas: 0, estabilidade: null };
  const issues = latestIssues ? indicadoresIssues(await lerJson(repo.pasta, latestIssues.nome), repo.github) : {
    bloqueios: null,
    conclusaoTarefas: null,
    detalheIssues: { total: 0, comDescricao: 0, fechadas: 0 },
  };

  const resultadosPorSonar = new Map();
  for (const resultado of resultadosTestesManuais) {
    const sonarManual = sonarDoResultadoManual(sonarFiles, resultado);
    if (sonarManual) resultadosPorSonar.set(sonarManual.nome, resultado);
  }

  const historicoTabela = preencherAtributosAusentes([...sonarFiles].reverse().map((sonar) => {
    const runsDoPeriodo = runsFiles.filter((item) => item.data <= sonar.data).at(-1);
    const medidasHistoricas = medidasParaObjeto(sonar.payload?.baseComponent?.measures ?? []);
    const densidadesHistoricas = densidadesQRapids(sonar.payload?.components ?? []);
    return metricasTabela(
      sonar,
      medidasHistoricas,
      densidadesHistoricas,
      runsDoPeriodo?.payload?.workflow_runs ?? [],
      resultadosPorSonar.get(sonar.nome) ?? null,
    );
  }));

  return {
    medidas,
    densidades,
    tabela: historicoTabela[0]
      ?? metricasTabela(latestSonar, medidas, densidades, runsPayload?.workflow_runs ?? [], resultadosTestesManuais.at(-1) ?? null),
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
    historicoTabela,
    snapshot: {
      sonar: latestSonar?.nome ?? null,
      runs: latestRuns?.nome ?? null,
      issues: latestIssues?.nome ?? null,
      testesManuais: resultadosTestesManuais.length ? `${repo.nome}.json` : null,
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



