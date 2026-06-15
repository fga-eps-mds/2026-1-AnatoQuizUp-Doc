// Lista as issues TRABALHADAS sem responsável, para o time atribuir o dono.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const { issues } = JSON.parse(await readFile(join(DADOS, "zenhub-issues.json"), "utf8"));

const ATIVAS = ["Sprint Backlog", "In Progress", "Review/QA", "Blocked", "Rework"];
const trabalhada = (i) => Boolean(i.fechadaEm) || ATIVAS.includes(i.pipeline);

const semResp = issues.filter((i) => !i.ehPr && i.responsaveis.length === 0 && trabalhada(i));
const backlog = issues.filter((i) => !i.ehPr && i.responsaveis.length === 0 && !trabalhada(i));

// ordena: por repo, depois fechadas antes, depois número
const ordem = { "2026-1-AnatoQuizUp-Usuario-Service": 0, "2026-1-AnatoQuizUp-Web": 1, "2026-1-AnatoQuizUp-Doc": 2, "2026-1-AnatoQuizUp": 3 };
semResp.sort((a, b) => (ordem[a.repo] - ordem[b.repo]) || a.numero - b.numero);

let repoAtual = "";
for (const i of semResp) {
  if (i.repo !== repoAtual) { repoAtual = i.repo; console.log(`\n### ${i.repo.replace("2026-1-AnatoQuizUp-", "").replace("2026-1-AnatoQuizUp", "Planejamento")}`); }
  const estado = i.fechadaEm ? `fechada ${i.fechadaEm.slice(0, 10)}` : i.pipeline;
  console.log(`${i.repo.replace("2026-1-AnatoQuizUp-", "").replace("2026-1-AnatoQuizUp", "PLAN")}#${i.numero} [${estado}] — ${i.titulo}`);
}
console.log(`\n\nTOTAL a atribuir: ${semResp.length} issues trabalhadas.`);
console.log(`(Além dessas, há ${backlog.length} no backlog/icebox sem responsável — normalmente não precisam, mas posso incluir se quiser.)`);
