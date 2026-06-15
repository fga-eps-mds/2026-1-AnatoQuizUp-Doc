// Atribui responsável às issues trabalhadas, com os donos DECIDIDOS pelo time (14/06).
// Harvest do mapa login->zenhubUserId a partir de assignees existentes; aplica no
// ZenHub (addAssigneesToIssues) e no snapshot. Uso: ZENHUB_GRAPHQL_TOKEN=... node ... [--dry]
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
const DRY = process.argv.includes("--dry");
const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ARQ = join(DADOS, "zenhub-issues.json");
const dados = JSON.parse(await readFile(ARQ, "utf8"));
const WS = "69bc08ebd4e9ec001c0c3229";

async function gql(query, variables = {}) {
  const r = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

// nome informado pelo time -> login do GitHub
const LOGIN = {
  ana: "an4catarina", arthur: "trindadea", breno: "Brenofrds", bruno: "EhOBruno",
  caio: "caiobsantos", genilson: "GenilsonJrs", jv: "Joa0V", malu: "marialuisa214",
  miguel: "EhOMiguel", cabeceira: "pkbceira03", victor: "ViictorHugoo",
};

// (repo, número) -> donos (16 com dono individual; "Todos" tratados à parte)
const R = { US: "2026-1-AnatoQuizUp-Usuario-Service", WEB: "2026-1-AnatoQuizUp-Web", DOC: "2026-1-AnatoQuizUp-Doc", PLAN: "2026-1-AnatoQuizUp" };
const ATRIB = [
  { repo: R.US, n: 16, donos: ["ana"] },
  { repo: R.US, n: 18, donos: ["breno", "miguel"] },
  { repo: R.US, n: 70, donos: ["genilson"] },
  { repo: R.US, n: 103, donos: ["arthur"] },
  { repo: R.US, n: 104, donos: ["breno"] },
  { repo: R.US, n: 108, donos: ["breno"] },
  { repo: R.WEB, n: 13, donos: ["miguel"] },
  { repo: R.WEB, n: 43, donos: ["cabeceira"] },
  { repo: R.WEB, n: 44, donos: ["jv", "arthur"] },
  { repo: R.WEB, n: 48, donos: ["miguel", "arthur"] },
  { repo: R.DOC, n: 24, donos: ["malu"] },
  { repo: R.DOC, n: 28, donos: ["malu"] },
  { repo: R.PLAN, n: 115, donos: ["miguel", "breno"] },
  { repo: R.PLAN, n: 119, donos: ["victor"] },
  { repo: R.PLAN, n: 121, donos: ["bruno"] },
  { repo: R.PLAN, n: 131, donos: ["victor"] },
];

// ---- harvest: login -> zenhubUserId  E  repo#num -> issueId (do próprio workspace)
const mapaId = new Map();
const issueId = new Map();
let cursor = null;
do {
  const d = await gql(`query($c:String){ searchClosedIssues(workspaceId:"${WS}",filters:{},first:50,after:$c){ pageInfo{hasNextPage endCursor} nodes{ id number repository{name} assignees{nodes{id login}} } } }`, { c: cursor });
  for (const node of d.searchClosedIssues.nodes) {
    issueId.set(`${node.repository.name}#${node.number}`, node.id);
    for (const a of node.assignees.nodes) mapaId.set(a.login, a.id);
  }
  cursor = d.searchClosedIssues.pageInfo.hasNextPage ? d.searchClosedIssues.pageInfo.endCursor : null;
} while (cursor);

const precisa = [...new Set(ATRIB.flatMap((a) => a.donos.map((x) => LOGIN[x])))];
const faltando = precisa.filter((l) => !mapaId.has(l));
console.log(`Mapa login->id: ${mapaId.size} usuários (faltando: ${faltando.join(", ") || "nenhum"}); issueIds: ${issueId.size}`);
if (faltando.length) { console.log("Abortando."); process.exit(1); }

// ---- aplica (try/catch por issue; fallback p/ assignee do ZenHub em issue nativa)
const idxSnap = new Map(dados.issues.map((i) => [`${i.repo}#${i.numero}`, i]));
let ok = 0;
for (const a of ATRIB) {
  const chave = `${a.repo}#${a.n}`;
  const snap = idxSnap.get(chave);
  const iid = issueId.get(chave);
  const logins = a.donos.map((x) => LOGIN[x]);
  const ids = logins.map((l) => mapaId.get(l));
  const rotulo = `${a.repo.replace("2026-1-AnatoQuizUp-", "").replace("2026-1-AnatoQuizUp", "PLAN")}#${a.n}`;
  if (snap) snap.responsaveis = logins; // patch snapshot SEMPRE (é o que o dashboard usa)
  if (!iid) { console.log(`  ${rotulo}: id não encontrado — só snapshot`); continue; }
  if (!DRY) {
    try {
      await gql(`mutation($input:AddAssigneesToIssuesInput!){ addAssigneesToIssues(input:$input){ clientMutationId } }`, { input: { issueIds: [iid], assigneeIds: ids } });
      ok++;
      console.log(`  ${rotulo} -> ${logins.join(", ")} ✓`);
    } catch {
      // issue nativa do ZenHub (sem GitHub): não dá pra gravar assignee no board — fica só no snapshot
      console.log(`  ${rotulo} -> ${logins.join(", ")} ⚠ só snapshot (issue nativa do ZenHub; atribuir manualmente no board se quiser)`);
    }
  } else console.log(`  ${rotulo} -> ${logins.join(", ")}`);
}
if (!DRY) {
  dados.patchResponsaveis = { aplicadoEm: new Date().toISOString(), criterio: "donos decididos pela equipe em 14/06/2026", total: ATRIB.length };
  await writeFile(ARQ, JSON.stringify(dados, null, 1), "utf8");
  console.log(`\nGravado: ${ok}/${ATRIB.length} no ZenHub + snapshot atualizado.`);
} else console.log("\n(dry-run)");
