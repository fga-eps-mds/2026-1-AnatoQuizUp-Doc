// Vincula à sprint correta (por data de FECHAMENTO) as issues fechadas sem sprint.
// Só issues fechadas (data de entrega é fato sólido); exclui o repo de planejamento
// (épicos) e cards fechados no bulk de 12/06. Escreve no ZenHub e no snapshot.
// Uso: ZENHUB_GRAPHQL_TOKEN=... node aplicar-sprints.mjs [--dry]
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
const DRY = process.argv.includes("--dry");
const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ARQ = join(DADOS, "zenhub-issues.json");
const dados = JSON.parse(await readFile(ARQ, "utf8"));
const workspace = JSON.parse(await readFile(join(DADOS, "zenhub-workspace.json"), "utf8"));
const sprintsZh = (workspace.sprints.nodes ?? workspace.sprints).filter((s) => s.startAt);

const REPO_PLANEJAMENTO = "2026-1-AnatoQuizUp";
const BULK = "2026-06-12";

async function gql(query, variables = {}) {
  const r = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

const sprintPorData = (iso) => sprintsZh.find((s) => new Date(iso) >= new Date(s.startAt) && new Date(iso) <= new Date(s.endAt)) ?? null;

const alvo = dados.issues.filter((i) =>
  !i.ehPr && i.sprints.length === 0 && i.repo !== REPO_PLANEJAMENTO &&
  i.fechadaEm && !i.fechadaEm.startsWith(BULK) && sprintPorData(i.fechadaEm),
);

console.log(`${DRY ? "DRY — " : ""}${alvo.length} issues fechadas sem sprint serão vinculadas por data de fechamento.\n`);

let ok = 0;
for (const issue of alvo) {
  const sp = sprintPorData(issue.fechadaEm);
  if (!DRY) {
    const { issueByInfo } = await gql(
      `query($r:Int!,$n:Int!){ issueByInfo(repositoryGhId:$r,issueNumber:$n){ id } }`,
      { r: issue.repoGhId, n: issue.numero },
    );
    if (issueByInfo?.id) {
      await gql(
        `mutation($input: AddIssuesToSprintsInput!){ addIssuesToSprints(input:$input){ clientMutationId } }`,
        { input: { issueIds: [issueByInfo.id], sprintIds: [sp.id] } },
      );
      ok++;
    }
  }
  // patch no snapshot (para o dashboard refletir sem precisar re-extrair o board ao vivo)
  issue.sprints = [sp.name];
  console.log(`  ${issue.repo}#${issue.numero} (fechada ${issue.fechadaEm.slice(0, 10)}) -> ${sp.name}`);
}

if (!DRY) {
  dados.patchSprints = { aplicadoEm: new Date().toISOString(), criterio: "data de fechamento; exclui repo de planejamento e bulk 12/06", total: alvo.length };
  await writeFile(ARQ, JSON.stringify(dados, null, 1), "utf8");
  console.log(`\nGravado: ${ok} vínculos no ZenHub + snapshot atualizado.`);
} else {
  console.log(`\n(dry-run — nada gravado)`);
}
