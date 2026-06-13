// Extrator de dados para o Dashboard Gerencial e Analítico — DA-R3
//
// Fontes: ZenHub (GraphQL + REST legada), GitHub REST, SonarCloud.
// Saída: DA-R3/dados/*.json (uma fase por arquivo; fase já extraída é pulada).
//
// Uso:
//   ZENHUB_GRAPHQL_TOKEN=... ZENHUB_REST_TOKEN=... [GITHUB_TOKEN=...] node extrair-dados.mjs [fase...]
//   Fases: zenhub-workspace | zenhub-issues | zenhub-eventos | github | sonarcloud
//   Sem argumentos, roda todas. Para reextrair uma fase, apague o JSON correspondente.

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const WORKSPACE_ID = "69bc08ebd4e9ec001c0c3229";
const ORG = "fga-eps-mds";
const REPOS = [
  "2026-1-AnatoQuizUp",
  "2026-1-AnatoQuizUp-Doc",
  "2026-1-AnatoQuizUp-Web",
  "2026-1-AnatoQuizUp-BFF",
  "2026-1-AnatoQuizUp-Usuario-Service",
  "2026-1-AnatoQuizUp-Quiz-Service",
  "2026-1-AnatoQuizUp-AI",
];
const SONAR_PROJETOS = [
  "fga-eps-mds_2026-1-AnatoQuizUp-Usuario-Service",
  "fga-eps-mds_2026-1-AnatoQuizUp-Quiz-Service",
  "fga-eps-mds_2026-1-AnatoQuizUp-BFF",
  "fga-eps-mds_2026-1-AnatoQuizUp-Front",
];
const SONAR_METRICAS = [
  "coverage", "bugs", "code_smells", "vulnerabilities", "duplicated_lines_density",
  "complexity", "cognitive_complexity", "ncloc", "comment_lines_density", "files",
  "functions", "reliability_rating", "security_rating", "sqale_rating",
  "tests", "test_failures", "test_errors", "test_success_density", "sqale_index",
];

const ZH_GQL = process.env.ZENHUB_GRAPHQL_TOKEN;
const ZH_REST = process.env.ZENHUB_REST_TOKEN;
const GH = process.env.GITHUB_TOKEN;

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

async function existe(caminho) {
  try { await access(caminho); return true; } catch { return false; }
}

async function salvar(nome, dados) {
  await mkdir(RAIZ, { recursive: true });
  await writeFile(join(RAIZ, nome), JSON.stringify(dados, null, 1), "utf8");
  console.log(`  -> ${nome} salvo`);
}

async function gql(query, variables = {}, tentativa = 1) {
  const res = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${ZH_GQL}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429 && tentativa <= 5) {
    console.log("  rate limit GraphQL, aguardando 30s...");
    await pausa(30000);
    return gql(query, variables, tentativa + 1);
  }
  const json = await res.json();
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors).slice(0, 500)}`);
  return json.data;
}

async function ghApi(caminho) {
  const headers = { "User-Agent": "anatoquizup-dashboards", Accept: "application/vnd.github+json" };
  if (GH) headers.Authorization = `Bearer ${GH}`;
  const res = await fetch(`https://api.github.com${caminho}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${caminho}`);
  return { dados: await res.json(), link: res.headers.get("link") ?? "" };
}

// ---------------------------------------------------------------- fases

async function faseZenhubWorkspace() {
  const d = await gql(`query {
    workspace(id: "${WORKSPACE_ID}") {
      id name
      pipelines { id name }
      sprints(first: 30) {
        nodes { id name startAt endAt state totalPoints completedPoints closedIssuesCount }
      }
    }
  }`);
  await salvar("zenhub-workspace.json", { extraidoEm: new Date().toISOString(), ...d.workspace });
  return d.workspace;
}

const CAMPOS_ISSUE = `
  number title state pullRequest htmlUrl ghCreatedAt closedAt
  estimate { value }
  repository { name ghId }
  labels(first: 15) { nodes { name } }
  assignees(first: 15) { nodes { login } }
  sprints(first: 10) { nodes { name startAt endAt } }
`;

function simplificarIssue(n, pipeline = null) {
  return {
    repo: n.repository?.name, repoGhId: n.repository?.ghId, numero: n.number, titulo: n.title, estado: n.state,
    ehPr: n.pullRequest ?? false, url: n.htmlUrl,
    criadaEm: n.ghCreatedAt, fechadaEm: n.closedAt,
    estimate: n.estimate?.value ?? null,
    labels: (n.labels?.nodes ?? []).map((l) => l.name),
    responsaveis: (n.assignees?.nodes ?? []).map((a) => a.login),
    sprints: (n.sprints?.nodes ?? []).map((s) => s.name),
    pipeline,
  };
}

async function faseZenhubIssues(workspace) {
  const issues = [];

  // Fechadas (saem do board; pipeline = null)
  let cursor = null;
  do {
    const d = await gql(`query($cursor: String) {
      searchClosedIssues(workspaceId: "${WORKSPACE_ID}", filters: {}, first: 50, after: $cursor) {
        totalCount pageInfo { hasNextPage endCursor }
        nodes { ${CAMPOS_ISSUE} }
      }
    }`, { cursor });
    const pagina = d.searchClosedIssues;
    issues.push(...pagina.nodes.map((n) => simplificarIssue(n)));
    cursor = pagina.pageInfo.hasNextPage ? pagina.pageInfo.endCursor : null;
    console.log(`  fechadas: ${issues.length}/${pagina.totalCount}`);
  } while (cursor);

  // Abertas, por pipeline
  for (const p of workspace.pipelines) {
    let cur = null;
    do {
      const d = await gql(`query($pid: ID!, $cursor: String) {
        searchIssuesByPipeline(pipelineId: $pid, filters: {}, first: 50, after: $cursor) {
          totalCount pageInfo { hasNextPage endCursor }
          nodes { ${CAMPOS_ISSUE} }
        }
      }`, { pid: p.id, cursor: cur });
      const pagina = d.searchIssuesByPipeline;
      issues.push(...pagina.nodes.map((n) => simplificarIssue(n, p.name)));
      cur = pagina.pageInfo.hasNextPage ? pagina.pageInfo.endCursor : null;
      if (pagina.totalCount > 0) console.log(`  pipeline "${p.name}": ${pagina.totalCount}`);
    } while (cur);
  }

  await salvar("zenhub-issues.json", { extraidoEm: new Date().toISOString(), total: issues.length, issues });
  return issues;
}

async function faseZenhubEventos(issues) {
  // Eventos de movimentação entre pipelines (REST legada). Só issues (PRs não andam no board).
  const alvo = issues.filter((i) => !i.ehPr && i.repoGhId);

  const eventos = [];
  let feitos = 0, comEventos = 0;
  for (const issue of alvo) {
    const repoId = issue.repoGhId;
    try {
      const res = await fetch(
        `https://api.zenhub.com/p1/repositories/${repoId}/issues/${issue.numero}/events`,
        { headers: { "X-Authentication-Token": ZH_REST, "User-Agent": "anatoquizup-dashboards" } },
      );
      if (res.status === 403) { // rate limit da REST: aguarda e repete
        console.log("  rate limit REST, aguardando 45s...");
        await pausa(45000);
        continue;
      }
      const evs = await res.json();
      if (Array.isArray(evs) && evs.length > 0) {
        comEventos++;
        eventos.push({ repo: issue.repo, numero: issue.numero, eventos: evs });
      }
    } catch (e) { console.log(`  erro ${issue.repo}#${issue.numero}: ${e.message}`); }
    feitos++;
    if (feitos % 25 === 0) console.log(`  eventos: ${feitos}/${alvo.length} issues consultadas (${comEventos} com histórico)`);
    await pausa(700); // ~85 req/min, abaixo do limite de 100/min
  }
  console.log(`  concluído: ${feitos} consultadas, ${comEventos} com histórico de movimentação`);
  await salvar("zenhub-eventos.json", { extraidoEm: new Date().toISOString(), totalConsultadas: feitos, comEventos, eventos });
}

async function faseGithub() {
  const resultado = {};
  for (const repo of REPOS) {
    const itens = [];
    try {
    for (let pagina = 1; pagina <= 10; pagina++) {
      const { dados } = await ghApi(`/repos/${ORG}/${repo}/issues?state=all&per_page=100&page=${pagina}`);
      itens.push(...dados.map((i) => ({
        numero: i.number, titulo: i.title, estado: i.state,
        ehPr: Boolean(i.pull_request), criadaEm: i.created_at, fechadaEm: i.closed_at,
        mergeadaEm: i.pull_request?.merged_at ?? null,
        labels: i.labels.map((l) => l.name), responsaveis: i.assignees.map((a) => a.login),
        autor: i.user?.login, milestone: i.milestone?.title ?? null,
        temDescricao: Boolean(i.body && i.body.trim().length > 0),
        comentarios: i.comments,
      })));
      if (dados.length < 100) break;
    }
    } catch (e) {
      console.log(`  ${repo}: inacessível (${e.message}) — pulando`);
      continue;
    }
    resultado[repo] = itens;
    console.log(`  ${repo}: ${itens.length} issues/PRs`);
  }
  await salvar("github-issues.json", { extraidoEm: new Date().toISOString(), ...resultado });
}

async function faseSonarcloud() {
  const resultado = { extraidoEm: new Date().toISOString(), atual: {}, historico: {} };
  for (const proj of SONAR_PROJETOS) {
    const atual = await fetch(
      `https://sonarcloud.io/api/measures/component?component=${proj}&metricKeys=${SONAR_METRICAS.join(",")}`,
      { headers: { "User-Agent": "anatoquizup-dashboards" } },
    ).then((r) => r.json());
    resultado.atual[proj] = atual.component?.measures ?? [];

    const hist = await fetch(
      `https://sonarcloud.io/api/measures/search_history?component=${proj}&metrics=${SONAR_METRICAS.slice(0, 15).join(",")}&ps=500`,
      { headers: { "User-Agent": "anatoquizup-dashboards" } },
    ).then((r) => r.json());
    resultado.historico[proj] = hist.measures ?? [];
    console.log(`  ${proj}: ok`);
  }
  await salvar("sonarcloud.json", resultado);
}

// ---------------------------------------------------------------- main

const pedidas = process.argv.slice(2);
const querFase = (f) => pedidas.length === 0 || pedidas.includes(f);

let workspace = null;
let issues = null;

if (querFase("zenhub-workspace")) {
  console.log("== zenhub-workspace ==");
  if (await existe(join(RAIZ, "zenhub-workspace.json"))) console.log("  já existe, pulando");
  else workspace = await faseZenhubWorkspace();
}

if (querFase("zenhub-issues")) {
  console.log("== zenhub-issues ==");
  if (await existe(join(RAIZ, "zenhub-issues.json"))) console.log("  já existe, pulando");
  else {
    workspace ??= (await faseZenhubWorkspace());
    issues = await faseZenhubIssues(workspace);
  }
}

if (querFase("github")) {
  console.log("== github ==");
  if (await existe(join(RAIZ, "github-issues.json"))) console.log("  já existe, pulando");
  else await faseGithub();
}

if (querFase("sonarcloud")) {
  console.log("== sonarcloud ==");
  if (await existe(join(RAIZ, "sonarcloud.json"))) console.log("  já existe, pulando");
  else await faseSonarcloud();
}

if (querFase("zenhub-eventos")) {
  console.log("== zenhub-eventos ==");
  if (await existe(join(RAIZ, "zenhub-eventos.json"))) console.log("  já existe, pulando");
  else {
    if (!issues) {
      const { readFile } = await import("node:fs/promises");
      issues = JSON.parse(await readFile(join(RAIZ, "zenhub-issues.json"), "utf8")).issues;
    }
    await faseZenhubEventos(issues);
  }
}

console.log("Extração concluída.");
