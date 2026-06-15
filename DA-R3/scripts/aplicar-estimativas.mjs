// Aplica no ZenHub as estimativas decididas pelo time (débito de registro das sprints S5/S7).
// NÃO inventa pontos — os valores abaixo foram definidos pela equipe.
// Uso: ZENHUB_GRAPHQL_TOKEN=... node aplicar-estimativas.mjs [--dry]
const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
if (!TOKEN) throw new Error("Defina ZENHUB_GRAPHQL_TOKEN");
const DRY = process.argv.includes("--dry");

const USUARIO_SERVICE_GHID = 1208046400;

// card -> pontos, decididos pela equipe (vide conversa de 14/06)
const ESTIMATIVAS = [
  { repoGhId: USUARIO_SERVICE_GHID, numero: 82, pontos: 5, nota: "Dashboard de Evolução do Aluno (S7)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 66, pontos: 5, nota: "Sistema de Amizades (S7)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 67, pontos: 5, nota: "Dashboard de Desempenho da Turma (S7)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 94, pontos: 5, nota: "Criação de Turmas e Alocação (S5)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 77, pontos: 5, nota: "Sistema de Recompensas / Moedas (S5)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 93, pontos: 5, nota: "Listas de Questões (S5)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 70, pontos: 3, nota: "Backend de Turmas (S5)" },
  { repoGhId: USUARIO_SERVICE_GHID, numero: 103, pontos: 3, nota: "Backend de Turmas do Aluno (S5)" },
];

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

const buscar = (repoGhId, numero) => gql(
  `query($r: Int!, $n: Int!) { issueByInfo(repositoryGhId: $r, issueNumber: $n) { id number title estimate { value } state } }`,
  { r: repoGhId, n: numero },
);

const setEstimate = (issueId, value) => gql(
  `mutation($input: SetEstimateInput!) { setEstimate(input: $input) { issue { number estimate { value } } } }`,
  { input: { issueId, value } },
);

console.log(DRY ? "== DRY RUN (não altera nada) ==\n" : "== APLICANDO ESTIMATIVAS ==\n");
let alteradas = 0;
for (const e of ESTIMATIVAS) {
  const { issueByInfo: issue } = await buscar(e.repoGhId, e.numero);
  if (!issue) { console.log(`  #${e.numero}: NÃO ENCONTRADA`); continue; }
  const antes = issue.estimate?.value ?? "—";
  if (DRY) {
    console.log(`  #${issue.number} [${issue.state}] estimate ${antes} -> ${e.pontos}  (${e.nota})`);
    continue;
  }
  const r = await setEstimate(issue.id, e.pontos);
  const depois = r.setEstimate.issue.estimate?.value ?? "—";
  console.log(`  #${issue.number} [${issue.state}] estimate ${antes} -> ${depois} ✓  (${e.nota})`);
  alteradas += 1;
}
console.log(`\n${DRY ? "Simulação" : "Concluído"}: ${DRY ? ESTIMATIVAS.length + " cards" : alteradas + " cards atualizados"}. Total de pontos: ${ESTIMATIVAS.reduce((s, e) => s + e.pontos, 0)} SP.`);
