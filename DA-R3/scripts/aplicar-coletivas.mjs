// Atribui as cerimônias coletivas da R1 (repo de planejamento, "Todos") aos 8
// integrantes indicados pelo time. São issues nativas do ZenHub: o assignee de
// board costuma falhar, então o efeito principal é no snapshot (dashboard).
// Uso: ZENHUB_GRAPHQL_TOKEN=... node aplicar-coletivas.mjs [--dry]
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
const DRY = process.argv.includes("--dry");
const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ARQ = join(DADOS, "zenhub-issues.json");
const dados = JSON.parse(await readFile(ARQ, "utf8"));
const WS = "69bc08ebd4e9ec001c0c3229";
const PLAN = "2026-1-AnatoQuizUp";

const EQUIPE = ["EhOMiguel", "trindadea", "GenilsonJrs", "Brenofrds", "EhOBruno", "Joa0V", "marialuisa214", "pkbceira03"];

async function gql(query, variables = {}) {
  const r = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

const ATIVAS = ["Sprint Backlog", "In Progress", "Review/QA", "Blocked", "Rework"];
const trabalhada = (i) => Boolean(i.fechadaEm) || ATIVAS.includes(i.pipeline);

// as 33 coletivas = issues do repo de planejamento, trabalhadas, ainda sem responsável
const alvo = dados.issues.filter((i) => i.repo === PLAN && trabalhada(i) && i.responsaveis.length === 0);
console.log(`${alvo.length} cerimônias coletivas -> ${EQUIPE.length} integrantes\n`);

// mapa login->id e issueId (para tentar o board ao vivo)
const mapaId = new Map(), issueId = new Map();
let cursor = null;
do {
  const d = await gql(`query($c:String){ searchClosedIssues(workspaceId:"${WS}",filters:{},first:50,after:$c){ pageInfo{hasNextPage endCursor} nodes{ id number repository{name} assignees{nodes{id login}} } } }`, { c: cursor });
  for (const node of d.searchClosedIssues.nodes) {
    issueId.set(`${node.repository.name}#${node.number}`, node.id);
    for (const a of node.assignees.nodes) mapaId.set(a.login, a.id);
  }
  cursor = d.searchClosedIssues.pageInfo.hasNextPage ? d.searchClosedIssues.pageInfo.endCursor : null;
} while (cursor);
const ids = EQUIPE.map((l) => mapaId.get(l)).filter(Boolean);

let live = 0, soSnap = 0;
for (const issue of alvo) {
  issue.responsaveis = [...EQUIPE]; // patch snapshot (o que o dashboard usa)
  if (DRY) { soSnap++; continue; }
  const iid = issueId.get(`${issue.repo}#${issue.numero}`);
  try {
    if (!iid) throw new Error("sem id");
    await gql(`mutation($input:AddAssigneesToIssuesInput!){ addAssigneesToIssues(input:$input){ clientMutationId } }`, { input: { issueIds: [iid], assigneeIds: ids } });
    live++;
  } catch { soSnap++; }
}
if (!DRY) {
  dados.patchColetivas = { aplicadoEm: new Date().toISOString(), integrantes: EQUIPE, total: alvo.length, motivo: "cerimônias coletivas da R1 (Lean Inception, arquitetura, setup) — decisão do time 14/06" };
  await writeFile(ARQ, JSON.stringify(dados, null, 1), "utf8");
}
console.log(`${DRY ? "(dry) " : ""}${alvo.length} marcadas no snapshot · board ao vivo: ${live} ok, ${soSnap} só snapshot (issues nativas do ZenHub).`);
