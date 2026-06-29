// Re-extrai as issues do ZenHub no estado ATUAL (limpeza de 27/06 já aplicada) e
// faz MERGE com o snapshot anterior, preservando o trabalho da equipe de pontuação,
// responsáveis e sprints (patches que vivem só no snapshot — issues nativas do ZenHub
// e as 33 cerimônias coletivas da R1).
//
// Regras de merge (por issue, casada por repo#numero):
//   - estado/pipeline/fechadaEm/criadaEm/url/labels  -> SEMPRE do board atual (verdade de hoje)
//   - estimate        -> board atual se houver; senão o do snapshot (preserva patch nativo)
//   - responsaveis    -> board atual se não-vazio; senão o do snapshot (preserva coletivas)
//   - sprints         -> união (board ∪ snapshot)
//   - possivelDuplicata -> preserva flag do snapshot
//   - abandonado      -> marca true se o card foi fechado na limpeza de board de 27/06
//
// Uso: ZENHUB_GRAPHQL_TOKEN=... node scripts/reextrair-issues.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ARQ = join(AQUI, "..", "dados", "zenhub-issues.json");
const WS = "69bc08ebd4e9ec001c0c3229";
const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
if (!TOKEN) throw new Error("Defina ZENHUB_GRAPHQL_TOKEN");

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
async function gql(query, variables = {}, tentativa = 1) {
  const res = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429 && tentativa <= 5) { await pausa(30000); return gql(query, variables, tentativa + 1); }
  const j = await res.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors).slice(0, 400));
  return j.data;
}

const CAMPOS = `
  number title state pullRequest htmlUrl ghCreatedAt closedAt
  estimate { value }
  repository { name ghId }
  labels(first: 15) { nodes { name } }
  assignees(first: 15) { nodes { login } }
  sprints(first: 10) { nodes { name startAt endAt } }
`;
const simplificar = (n, pipeline = null) => ({
  repo: n.repository?.name, repoGhId: n.repository?.ghId, numero: n.number, titulo: n.title, estado: n.state,
  ehPr: n.pullRequest ?? false, url: n.htmlUrl, criadaEm: n.ghCreatedAt, fechadaEm: n.closedAt,
  estimate: n.estimate?.value ?? null,
  labels: (n.labels?.nodes ?? []).map((l) => l.name),
  responsaveis: (n.assignees?.nodes ?? []).map((a) => a.login),
  sprints: (n.sprints?.nodes ?? []).map((s) => s.name),
  pipeline,
});

// --- pull fresh: fechadas + abertas por pipeline
const ws = await gql(`query{ workspace(id:"${WS}"){ pipelines{ id name } } }`);
const fresh = [];
let cursor = null;
do {
  const d = await gql(`query($cursor:String){ searchClosedIssues(workspaceId:"${WS}",filters:{},first:50,after:$cursor){ totalCount pageInfo{hasNextPage endCursor} nodes{ ${CAMPOS} } } }`, { cursor });
  const pg = d.searchClosedIssues;
  fresh.push(...pg.nodes.map((n) => simplificar(n)));
  cursor = pg.pageInfo.hasNextPage ? pg.pageInfo.endCursor : null;
  console.log(`  fechadas: ${fresh.length}/${pg.totalCount}`);
} while (cursor);
for (const p of ws.workspace.pipelines) {
  let cur = null, n0 = fresh.length;
  do {
    const d = await gql(`query($pid:ID!,$cursor:String){ searchIssuesByPipeline(pipelineId:$pid,filters:{},first:50,after:$cursor){ pageInfo{hasNextPage endCursor} nodes{ ${CAMPOS} } } }`, { pid: p.id, cursor: cur });
    const pg = d.searchIssuesByPipeline;
    fresh.push(...pg.nodes.map((n) => simplificar(n, p.name)));
    cur = pg.pageInfo.hasNextPage ? pg.pageInfo.endCursor : null;
  } while (cur);
  if (fresh.length > n0) console.log(`  pipeline "${p.name}": ${fresh.length - n0}`);
}

// --- merge com snapshot
const velho = JSON.parse(await readFile(ARQ, "utf8"));
const mapVelho = new Map(velho.issues.map((i) => [`${i.repo}#${i.numero}`, i]));
const abandon = JSON.parse(await readFile(join(AQUI, "_cards-a-fechar.json"), "utf8"));
const abandonSet = new Set(abandon.map((c) => `${c.repo}#${c.numero}`));

let preservEstimate = 0, preservResp = 0, marcadosAbandono = 0;
const merged = fresh.map((f) => {
  const key = `${f.repo}#${f.numero}`;
  const o = mapVelho.get(key);
  if (o) {
    if (f.estimate == null && o.estimate != null) { f.estimate = o.estimate; preservEstimate++; }
    if ((!f.responsaveis || f.responsaveis.length === 0) && o.responsaveis?.length) { f.responsaveis = o.responsaveis; preservResp++; }
    f.sprints = [...new Set([...(f.sprints || []), ...(o.sprints || [])])];
    if (o.possivelDuplicata) f.possivelDuplicata = true;
  }
  // só marca abandonado se o card CONTINUA fechado (os 3 de release foram reabertos)
  if (abandonSet.has(key) && f.estado === "CLOSED") { f.abandonado = true; marcadosAbandono++; }
  mapVelho.delete(key);
  return f;
});
// issues que existiam no snapshot e não voltaram na re-extração (raro): mantém
let soNoSnapshot = 0;
for (const [, o] of mapVelho) { merged.push(o); soNoSnapshot++; }

const saida = {
  extraidoEm: new Date().toISOString(),
  reextraidoEm: new Date().toISOString(),
  reextracaoNota: "Estado do board em 27/06 (pós-limpeza). Merge preserva estimate/responsaveis/sprints do snapshot 12/06 onde o board não os tem (issues nativas + 33 cerimônias coletivas). Cards fechados na limpeza marcados com abandonado=true.",
  total: merged.length,
  patchEstimativas: velho.patchEstimativas,
  patchSprints: velho.patchSprints,
  patchResponsaveis: velho.patchResponsaveis,
  patchColetivas: velho.patchColetivas,
  patchEstimativas23: velho.patchEstimativas23,
  issues: merged,
};
await writeFile(ARQ, JSON.stringify(saida, null, 1), "utf8");
console.log(`\nMerge concluído: ${merged.length} issues`);
console.log(`  estimate preservado do snapshot: ${preservEstimate}`);
console.log(`  responsaveis preservados do snapshot: ${preservResp}`);
console.log(`  marcados abandonado=true (limpeza 27/06): ${marcadosAbandono}`);
console.log(`  só no snapshot (mantidos): ${soNoSnapshot}`);
