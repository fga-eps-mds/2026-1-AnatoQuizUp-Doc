// Lista as issues de CÓDIGO/DOC trabalhadas sem estimate (exclui cerimônias do
// repo de planejamento, que não levam story point) — para o time pontuar.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const { issues } = JSON.parse(await readFile(join(DADOS, "zenhub-issues.json"), "utf8"));

const ATIVAS = ["Sprint Backlog", "In Progress", "Review/QA", "Blocked", "Rework"];
const trabalhada = (i) => Boolean(i.fechadaEm) || ATIVAS.includes(i.pipeline);
const PLAN = "2026-1-AnatoQuizUp";

const alvo = issues.filter((i) => !i.ehPr && trabalhada(i) && i.estimate == null && i.repo !== PLAN);
const ordem = { "2026-1-AnatoQuizUp-Usuario-Service": 0, "2026-1-AnatoQuizUp-Web": 1, "2026-1-AnatoQuizUp-Doc": 2 };
alvo.sort((a, b) => (ordem[a.repo] - ordem[b.repo]) || a.numero - b.numero);

let repoAtual = "";
for (const i of alvo) {
  if (i.repo !== repoAtual) { repoAtual = i.repo; console.log(`\n### ${i.repo.replace("2026-1-AnatoQuizUp-", "")}`); }
  const estado = i.fechadaEm ? `fechada ${i.fechadaEm.slice(0, 10)}` : i.pipeline;
  const dono = i.responsaveis.length ? ` [dono: ${i.responsaveis.join(", ")}]` : "";
  console.log(`${i.repo.replace("2026-1-AnatoQuizUp-", "")}#${i.numero} (${estado}) — ${i.titulo}${dono}`);
}
console.log(`\nTOTAL: ${alvo.length} issues de código/doc sem estimate.`);
