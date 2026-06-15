// Aplica as estimativas decididas pelo time no snapshot de coleta (12/06).
// Mantém a data de coleta estável (evita o ruído do board sendo editado ao vivo)
// e preserva o fechamento original na S7 dos cards #82/#66/#67.
// As mesmas estimativas já foram gravadas no ZenHub por aplicar-estimativas.mjs.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const ARQ = join(DADOS, "zenhub-issues.json");

const REPO = "2026-1-AnatoQuizUp-Usuario-Service";
const ESTIMATIVAS = { 82: 5, 66: 5, 67: 5, 94: 5, 77: 5, 93: 5, 70: 3, 103: 3 };

const dados = JSON.parse(await readFile(ARQ, "utf8"));
let aplicadas = 0;
for (const issue of dados.issues) {
  if (issue.repo === REPO && ESTIMATIVAS[issue.numero] != null) {
    const antes = issue.estimate;
    issue.estimate = ESTIMATIVAS[issue.numero];
    console.log(`  #${issue.numero}: estimate ${antes} -> ${issue.estimate}  | fechada ${issue.fechadaEm?.slice(0, 10) ?? "aberta"}`);
    aplicadas += 1;
  }
}
dados.patchEstimativas = {
  aplicadoEm: new Date().toISOString(),
  motivo: "Débito de registro: cards entregues sem estimate, pontuados pela equipe em 14/06/2026. Valores também gravados no ZenHub.",
  cards: ESTIMATIVAS,
};
await writeFile(ARQ, JSON.stringify(dados, null, 1), "utf8");
console.log(`\n${aplicadas} estimativas aplicadas ao snapshot.`);
