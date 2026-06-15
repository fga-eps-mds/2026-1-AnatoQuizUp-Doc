// Preview (não altera nada): o que dá pra recuperar de forma HONESTA para
// "sem sprint" (por data) e "sem responsável" (sinais do git), com exclusões.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const { issues } = JSON.parse(await readFile(join(DADOS, "zenhub-issues.json"), "utf8"));
const workspace = JSON.parse(await readFile(join(DADOS, "zenhub-workspace.json"), "utf8"));
const github = JSON.parse(await readFile(join(DADOS, "github-issues.json"), "utf8"));

const sprintsZh = (workspace.sprints.nodes ?? workspace.sprints).filter((s) => s.startAt);
// mapa repo#num -> criador (autor) do GitHub
const criador = new Map();
for (const [repo, lista] of Object.entries(github)) {
  if (repo === "extraidoEm") continue;
  for (const it of lista) if (!it.ehPr) criador.set(`${repo}#${it.numero}`, it.autor);
}

const naoPr = issues.filter((i) => !i.ehPr);
const REPO_PLANEJAMENTO = "2026-1-AnatoQuizUp"; // épicos/atividades — não vincular por data de bulk-close
const BULK = "2026-06-12"; // dia da limpeza de board

function sprintPorData(iso) {
  if (!iso) return null;
  const t = new Date(iso);
  return sprintsZh.find((s) => t >= new Date(s.startAt) && t <= new Date(s.endAt)) ?? null;
}

// ---- SEM SPRINT
const semSprint = naoPr.filter((i) => i.sprints.length === 0);
let vinculaveis = 0, epicosExcluidos = 0, bulkExcluidos = 0, semData = 0;
const amostra = [];
for (const i of semSprint) {
  if (i.repo === REPO_PLANEJAMENTO) { epicosExcluidos++; continue; }
  const data = i.fechadaEm ?? i.criadaEm;
  if (i.fechadaEm && i.fechadaEm.startsWith(BULK)) { bulkExcluidos++; continue; } // fechada no bulk: data não confiável
  const sp = sprintPorData(data);
  if (!sp) { semData++; continue; }
  vinculaveis++;
  if (amostra.length < 10) amostra.push(`${i.repo}#${i.numero} [${i.fechadaEm ? "fechada " + i.fechadaEm.slice(0, 10) : "aberta " + i.criadaEm.slice(0, 10)}] -> ${sp.name}`);
}
console.log("==== SEM SPRINT ====");
console.log(`Total sem sprint: ${semSprint.length}`);
console.log(`  vinculáveis por data: ${vinculaveis}`);
console.log(`  excluídos (repo de planejamento/épicos): ${epicosExcluidos}`);
console.log(`  excluídos (fechados no bulk de 12/06, data não confiável): ${bulkExcluidos}`);
console.log(`  sem data dentro de sprint: ${semData}`);
console.log("  amostra:");
for (const a of amostra) console.log("    " + a);

// ---- SEM RESPONSÁVEL
const semResp = naoPr.filter((i) => i.responsaveis.length === 0);
let comCriador = 0, semCriador = 0;
const distCriador = {};
for (const i of semResp) {
  const c = criador.get(`${i.repo}#${i.numero}`);
  if (c) { comCriador++; distCriador[c] = (distCriador[c] ?? 0) + 1; } else semCriador++;
}
console.log("\n==== SEM RESPONSÁVEL ====");
console.log(`Total sem responsável (no snapshot ZenHub): ${semResp.length}`);
console.log(`  têm CRIADOR no GitHub (fato real, mas = quem ABRIU, não quem fez): ${comCriador}`);
console.log(`  sem criador identificável: ${semCriador}`);
console.log("  distribuição dos criadores (se usássemos criador como responsável):");
for (const [c, n] of Object.entries(distCriador).sort((a, b) => b[1] - a[1])) console.log(`    ${c}: ${n}`);
