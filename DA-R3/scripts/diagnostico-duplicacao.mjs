// Diagnóstico: a extração está duplicando issues (ZenHub + GitHub)?
// Responde às dúvidas do time de processo.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ler = async (n) => JSON.parse(await readFile(join(DADOS, n), "utf8"));

const zh = await ler("zenhub-issues.json");
const gh = await ler("github-issues.json");

console.log("=".repeat(70));
console.log("1) FONTES SÃO SEPARADAS? (ZenHub e GitHub vivem em arquivos distintos)");
console.log("=".repeat(70));
console.log(`zenhub-issues.json : ${zh.issues.length} itens`);
const ghTotal = Object.entries(gh).filter(([k]) => k !== "extraidoEm").reduce((s, [, v]) => s + v.length, 0);
console.log(`github-issues.json : ${ghTotal} itens`);

console.log("\n" + "=".repeat(70));
console.log("2) HÁ (repo, número) DUPLICADO DENTRO DO ZENHUB?");
console.log("=".repeat(70));
const vistos = new Map();
const dups = [];
for (const i of zh.issues) {
  const chave = `${i.repo}#${i.numero}`;
  if (vistos.has(chave)) dups.push(chave);
  else vistos.set(chave, i);
}
console.log(`Itens: ${zh.issues.length} | chaves únicas (repo#numero): ${vistos.size} | duplicadas: ${dups.length}`);
if (dups.length) console.log("Duplicadas:", dups.slice(0, 20).join(", "));

console.log("\n" + "=".repeat(70));
console.log("3) COMPOSIÇÃO DO ZENHUB: PRs contam como issue? Por repo?");
console.log("=".repeat(70));
const naoPr = zh.issues.filter((i) => !i.ehPr);
const prs = zh.issues.filter((i) => i.ehPr);
console.log(`Issues (não-PR): ${naoPr.length} | PRs: ${prs.length}`);
const porRepo = {};
for (const i of naoPr) porRepo[i.repo] = (porRepo[i.repo] ?? 0) + 1;
console.log("Issues não-PR por repo:");
for (const [r, n] of Object.entries(porRepo).sort((a, b) => b[1] - a[1])) console.log(`   ${r}: ${n}`);

console.log("\n" + "=".repeat(70));
console.log("4) 'SEM SPRINT': comparando com o que o board mostra");
console.log("=".repeat(70));
const abertas = naoPr.filter((i) => !i.fechadaEm);
const fechadas = naoPr.filter((i) => i.fechadaEm);
const semSprintTotal = naoPr.filter((i) => i.sprints.length === 0).length;
const semSprintAbertas = abertas.filter((i) => i.sprints.length === 0).length;
const semSprintFechadas = fechadas.filter((i) => i.sprints.length === 0).length;
console.log(`Issues não-PR no total: ${naoPr.length} (abertas: ${abertas.length}, fechadas: ${fechadas.length})`);
console.log(`  sem sprint — TOTAL (open+closed): ${semSprintTotal}`);
console.log(`  sem sprint — só ABERTAS (≈ o que aparece no board): ${semSprintAbertas}`);
console.log(`  sem sprint — só FECHADAS: ${semSprintFechadas}`);

console.log("\nAbertas sem sprint, por pipeline (é isso que o board mostra como 'card sem sprint'):");
const porPipe = {};
for (const i of abertas.filter((x) => x.sprints.length === 0)) porPipe[i.pipeline ?? "(sem pipeline)"] = (porPipe[i.pipeline ?? "(sem pipeline)"] ?? 0) + 1;
for (const [p, n] of Object.entries(porPipe).sort((a, b) => b[1] - a[1])) console.log(`   ${p}: ${n}`);

console.log("\n" + "=".repeat(70));
console.log("5) O repo de planejamento '2026-1-AnatoQuizUp' (épicos) infla a contagem?");
console.log("=".repeat(70));
const planejamento = naoPr.filter((i) => i.repo === "2026-1-AnatoQuizUp");
console.log(`Issues no repo de planejamento: ${planejamento.length}`);
console.log("Exemplos (podem ser épicos/macro-itens, não trabalho de código):");
for (const i of planejamento.slice(0, 8)) console.log(`   #${i.numero} ${i.titulo} [${i.fechadaEm ? "fechada" : i.pipeline}]`);
