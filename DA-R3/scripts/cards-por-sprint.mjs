// Lista, por janela de sprint, os cards que fecharam — com e sem estimate — e os PRs.
// Responde: o que foi entregue em cada sprint, como foi pontuado, e por que S7 deu 0.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const { issues } = JSON.parse(await readFile(join(DADOS, "zenhub-issues.json"), "utf8"));

const SPRINTS = [
  { id: "S5", ini: "2026-05-19", fim: "2026-05-25" },
  { id: "S6", ini: "2026-05-26", fim: "2026-06-01" },
  { id: "S7", ini: "2026-06-02", fim: "2026-06-08" },
  { id: "S8", ini: "2026-06-09", fim: "2026-06-15" },
];

const DIA = 24 * 3600 * 1000;
const noIntervalo = (iso, ini, fim) => {
  if (!iso) return false;
  const t = new Date(iso);
  return t >= new Date(ini) && t <= new Date(new Date(fim).getTime() + DIA - 1);
};

for (const s of SPRINTS) {
  const fechadasJanela = issues.filter((i) => !i.ehPr && noIntervalo(i.fechadaEm, s.ini, s.fim));
  const comEst = fechadasJanela.filter((i) => i.estimate != null);
  const semEst = fechadasJanela.filter((i) => i.estimate == null);
  const prs = issues.filter((i) => i.ehPr && noIntervalo(i.fechadaEm, s.ini, s.fim));
  const pontos = comEst.reduce((a, i) => a + i.estimate, 0);

  console.log("\n" + "=".repeat(72));
  console.log(`${s.id}  (${s.ini} a ${s.fim})  ->  ${pontos} SP CONTADOS`);
  console.log("=".repeat(72));

  console.log(`\n  CARDS COM ESTIMATE (contam no EV) — ${comEst.length} cards, ${pontos} SP:`);
  if (comEst.length === 0) console.log("    (nenhum)");
  for (const i of comEst.sort((a, b) => b.estimate - a.estimate))
    console.log(`    ${i.estimate} SP  ${i.repo}#${i.numero}  ${i.titulo}`);

  console.log(`\n  ISSUES FECHADAS SEM ESTIMATE (NÃO contam, mas é trabalho) — ${semEst.length}:`);
  for (const i of semEst.slice(0, 12))
    console.log(`    --   ${i.repo}#${i.numero}  ${i.titulo}`);
  if (semEst.length > 12) console.log(`    ... e mais ${semEst.length - 12}`);

  console.log(`\n  PRs FECHADOS NA JANELA (sinal de trabalho real) — ${prs.length}:`);
  for (const p of prs.slice(0, 12))
    console.log(`    PR  ${p.repo}#${p.numero}  ${p.titulo}`);
  if (prs.length > 12) console.log(`    ... e mais ${prs.length - 12}`);
}
