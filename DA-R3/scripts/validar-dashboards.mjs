// Smoke test: garante que dados-consolidados.js expõe tudo que os dashboards consomem
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const js = await readFile(join(AQUI, "..", "..", "docs", "dashboards", "dados-consolidados.js"), "utf8");
const window = {};
new Function("window", js)(window);
const D = window.DADOS;

const falhas = [];
const exige = (cond, msg) => { if (!cond) falhas.push(msg); };

// produto.html
exige(typeof D.produto.indicadores.qualidadeProduto === "number", "produto.indicadores.qualidadeProduto");
exige(typeof D.produto.indicadores.bloqueios === "number", "produto.indicadores.bloqueios");
exige(typeof D.produto.indicadores.prontidao === "number", "produto.indicadores.prontidao");
exige(Object.keys(D.produto.porRepo).length === 4, "produto.porRepo com 4 repos");
for (const [r, v] of Object.entries(D.produto.porRepo)) {
  for (const m of ["coverage", "ncloc", "reliability_rating", "security_rating", "sqale_rating", "bugs", "code_smells", "duplicated_lines_density"]) {
    exige(v.medidas[m] !== undefined, `produto.porRepo[${r}].medidas.${m}`);
  }
  exige(v.qualidadeProduto >= 0 && v.qualidadeProduto <= 1, `produto.porRepo[${r}].qualidadeProduto em [0,1]`);
  exige(D.produto.historico[r]?.coverage?.length > 0, `produto.historico[${r}].coverage`);
}
for (const d of ["complexidade", "comentarios", "duplicacao", "cobertura"]) {
  exige(typeof D.produto.global.densidades[d] === "number", `produto.global.densidades.${d}`);
}

// processo.html
exige(D.processo.cfd.length > 30, "processo.cfd com série diária");
exige(D.processo.cfd.at(-1).Closed > 0, "processo.cfd último dia com Closed > 0");
exige(typeof D.processo.leadTime.fluxoDeCodigo.medianaDias === "number", "processo.leadTime.fluxoDeCodigo");
exige(D.processo.leadTime.pontos.some((p) => p.fluxo), "processo.leadTime.pontos com fluxo=true");
exige(typeof D.processo.cycleTime.medianaDias === "number", "processo.cycleTime");
exige(Object.keys(D.processo.leiDeLittle.etapas).length === 3, "processo.leiDeLittle.etapas (3)");
exige(D.processo.throughputSemanal.length > 4, "processo.throughputSemanal");
exige(D.processo.prs.porSemana.length > 0, "processo.prs.porSemana");
exige(typeof D.processo.prs.tempoRevisao.medianaDias === "number", "processo.prs.tempoRevisao");
exige(Object.keys(D.processo.porMembro).length >= 8, "processo.porMembro com >= 8 membros");
exige(typeof D.processo.higiene.semEstimate === "number", "processo.higiene");

// projeto.html
exige(D.projeto.evm.length >= 7, "projeto.evm com >= 7 sprints");
const ult = D.projeto.evm.findLast((p) => !p.emAndamento);
exige(ult && ult.spi > 0 && ult.cpi > 0 && ult.eac > 0, "projeto.evm última fechada com spi/cpi/eac");
exige(D.projeto.sprints.every((s) => s.custoReal > 0), "projeto.sprints.custoReal");
exige(typeof D.projeto.parametros.bac === "number", "projeto.parametros.bac");
exige(D.projeto.previsao.velocidadeMedianaSP != null, "projeto.previsao.velocidadeMedianaSP");
exige(D.projeto.releases.length === 8, "projeto.releases (8)");

if (falhas.length) {
  console.error("FALHAS:\n - " + falhas.join("\n - "));
  process.exit(1);
}
console.log("OK — todos os campos consumidos pelos dashboards estão presentes e válidos.");
console.log(`Resumo: SPI=${ult.spi} CPI=${ult.cpi} EAC=${ult.eac} | QualidadeProduto=${D.produto.indicadores.qualidadeProduto} | LeadTime mediano=${D.processo.leadTime.fluxoDeCodigo.medianaDias}d`);
