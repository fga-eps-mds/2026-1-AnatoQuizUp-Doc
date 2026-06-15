// Raio-X de qualidade dos dados extraídos (apoio à seção de interpretação do notebook)
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const { issues } = JSON.parse(await readFile(join(RAIZ, "zenhub-issues.json"), "utf8"));

const naoPr = issues.filter((i) => !i.ehPr);
const prs = issues.filter((i) => i.ehPr);
console.log(`Total: ${issues.length} (${naoPr.length} issues, ${prs.length} PRs)`);

const comEstimate = naoPr.filter((i) => i.estimate != null);
console.log(`\nIssues com estimate: ${comEstimate.length}/${naoPr.length} (${(100 * comEstimate.length / naoPr.length).toFixed(0)}%)`);
console.log(`Pontos totais estimados: ${comEstimate.reduce((s, i) => s + i.estimate, 0)}`);

const fechadas = naoPr.filter((i) => i.fechadaEm);
const lote = fechadas.filter((i) => i.fechadaEm?.startsWith("2026-06-12T23:4"));
console.log(`\nIssues fechadas: ${fechadas.length} — destas, ${lote.length} fechadas em lote hoje (12/06 23:4x)`);

console.log("\n== Issues (não-PR) por repo ==");
const porRepo = {};
for (const i of naoPr) porRepo[i.repo] = (porRepo[i.repo] ?? 0) + 1;
for (const [r, n] of Object.entries(porRepo).sort((a, b) => b[1] - a[1])) console.log(`  ${r}: ${n}`);

console.log("\n== Pontos por sprint (issues com estimate; conta na última sprint associada) ==");
const porSprint = {};
for (const i of comEstimate) {
  const sp = i.sprints.at(-1) ?? "(sem sprint)";
  porSprint[sp] ??= { pts: 0, n: 0, ptsFechados: 0 };
  porSprint[sp].pts += i.estimate;
  porSprint[sp].n += 1;
  if (i.fechadaEm) porSprint[sp].ptsFechados += i.estimate;
}
for (const [s, v] of Object.entries(porSprint).sort()) console.log(`  ${s}: ${v.n} issues, ${v.pts} pts (${v.ptsFechados} pts fechados)`);

console.log("\n== Issues sem estimate por estado ==");
const semEst = naoPr.filter((i) => i.estimate == null);
console.log(`  fechadas: ${semEst.filter((i) => i.fechadaEm).length} | abertas: ${semEst.filter((i) => !i.fechadaEm).length}`);

console.log("\n== Responsáveis (todas as issues não-PR) ==");
const porPessoa = {};
for (const i of naoPr) for (const p of i.responsaveis) porPessoa[p] = (porPessoa[p] ?? 0) + 1;
for (const [p, n] of Object.entries(porPessoa).sort((a, b) => b[1] - a[1])) console.log(`  ${p}: ${n}`);
const semResp = naoPr.filter((i) => i.responsaveis.length === 0).length;
console.log(`  (sem responsável: ${semResp})`);

console.log("\n== Labels mais comuns ==");
const porLabel = {};
for (const i of naoPr) for (const l of i.labels) porLabel[l] = (porLabel[l] ?? 0) + 1;
for (const [l, n] of Object.entries(porLabel).sort((a, b) => b[1] - a[1]).slice(0, 12)) console.log(`  ${l}: ${n}`);
