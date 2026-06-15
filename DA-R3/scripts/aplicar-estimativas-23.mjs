// Aplica os estimates dos 23 cards de código/doc decididos pelo time (2ª leva, 14/06).
// ZenHub (setEstimate) + snapshot. Uso: ZENHUB_GRAPHQL_TOKEN=... node ... [--dry]
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
const DRY = process.argv.includes("--dry");
const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ARQ = join(DADOS, "zenhub-issues.json");
const dados = JSON.parse(await readFile(ARQ, "utf8"));

const US = "2026-1-AnatoQuizUp-Usuario-Service", WEB = "2026-1-AnatoQuizUp-Web", DOC = "2026-1-AnatoQuizUp-Doc";
// pontos decididos pelo time; "dup" = provável tracker de US que duplica trabalho de código
const PTS = [
  { repo: US, n: 16, p: 1 }, { repo: US, n: 17, p: 3 }, { repo: US, n: 47, p: 3 },
  { repo: US, n: 76, p: 3 }, { repo: US, n: 104, p: 3 }, { repo: US, n: 108, p: 3 },
  { repo: WEB, n: 12, p: 3 }, { repo: WEB, n: 37, p: 2 }, { repo: WEB, n: 38, p: 2 },
  { repo: WEB, n: 39, p: 3 }, { repo: WEB, n: 43, p: 3 }, { repo: WEB, n: 44, p: 2 }, { repo: WEB, n: 48, p: 3 },
  { repo: DOC, n: 5, p: 3 }, { repo: DOC, n: 21, p: 3, dup: true }, { repo: DOC, n: 22, p: 3, dup: true },
  { repo: DOC, n: 23, p: 4, dup: true }, { repo: DOC, n: 24, p: 2 }, { repo: DOC, n: 25, p: 2, dup: true },
  { repo: DOC, n: 28, p: 2 }, { repo: DOC, n: 29, p: 5 }, { repo: DOC, n: 34, p: 3, dup: true }, { repo: DOC, n: 46, p: 2 },
];

async function gql(query, variables = {}) {
  const r = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

const idx = new Map(dados.issues.map((i) => [`${i.repo}#${i.numero}`, i]));
let ok = 0;
for (const e of PTS) {
  const snap = idx.get(`${e.repo}#${e.n}`);
  if (snap) { snap.estimate = e.p; if (e.dup) snap.possivelDuplicata = true; }
  if (!DRY && snap) {
    const { issueByInfo } = await gql(`query($r:Int!,$n:Int!){ issueByInfo(repositoryGhId:$r,issueNumber:$n){ id } }`, { r: snap.repoGhId, n: e.n });
    if (issueByInfo?.id) { await gql(`mutation($i:SetEstimateInput!){ setEstimate(input:$i){ issue{number} } }`, { i: { issueId: issueByInfo.id, value: e.p } }); ok++; }
  }
  console.log(`  ${e.repo.replace("2026-1-AnatoQuizUp-", "")}#${e.n} = ${e.p} SP${e.dup ? "  ⚠ possível duplicata de código" : ""}`);
}
if (!DRY) {
  dados.patchEstimativas23 = { aplicadoEm: new Date().toISOString(), total: PTS.length, motivo: "2ª leva de estimativas (código/doc) decidida pelo time 14/06" };
  await writeFile(ARQ, JSON.stringify(dados, null, 1), "utf8");
  console.log(`\nGravado: ${ok} no ZenHub + snapshot.`);
} else console.log("\n(dry)");
