// Detalha o dado por trás do gráfico "Velocity por sprint (planejado × entregue)" S1–S7.
// Mostra a FONTE de cada número e, onde a entrega é medida das issues, a lista de cards.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DADOS = join(dirname(fileURLToPath(import.meta.url)), "..", "dados");
const proj = JSON.parse(await readFile(join(DADOS, "dados-consolidados.json"), "utf8")).projeto;
const { issues } = JSON.parse(await readFile(join(DADOS, "zenhub-issues.json"), "utf8"));

const DIA = 864e5;
const naWindow = (iso, ini, fim) => iso && new Date(iso) >= new Date(ini) && new Date(iso) <= new Date(new Date(fim).getTime() + DIA - 1);

for (const s of proj.sprints.filter((x) => ["S1", "S2", "S3", "S4", "S5", "S6", "S7"].includes(x.id))) {
  console.log("\n" + "=".repeat(74));
  console.log(`${s.id}  (${s.inicio} a ${s.fim})`);
  console.log("=".repeat(74));
  console.log(`  PLANEJADO: ${s.planejadoSP} SP   [fonte: ${s.fontePlanejado}]`);
  console.log(`  ENTREGUE:  ${s.entregueSP} SP   [fonte: ${s.fonteEntregue}]`);

  // cards com estimate fechados na janela (a base do "entregue medido")
  const cards = issues
    .filter((i) => !i.ehPr && i.estimate != null && naWindow(i.fechadaEm, s.inicio, s.fim))
    .sort((a, b) => b.estimate - a.estimate);
  const soma = cards.reduce((a, i) => a + i.estimate, 0);

  if (s.fonteEntregue === "doc") {
    console.log(`  > Entregue vem do RELATÓRIO de sprint publicado (docs/processo/evm-${s.id.toLowerCase()}.md).`);
    console.log(`  > Medindo pelas issues com estimate fechadas na janela daria ${soma} SP (${cards.length} cards) —`);
    console.log(`    difere do relatório por causa do débito de estimativa da época. Cards mensuráveis:`);
  } else {
    console.log(`  > Entregue MEDIDO das issues com estimate fechadas na janela (${soma} SP, ${cards.length} cards):`);
  }
  for (const c of cards) console.log(`      ${c.estimate} SP  ${c.repo}#${c.numero}  ${c.titulo}`);
  if (cards.length === 0) console.log(`      (nenhuma issue com estimate fechou nesta janela)`);
}
