// Re-fecha no ZenHub os 3 cards da S7 reabertos por engano (autorizado pelo time).
// Restaura o estado que existia na coleta de 12/06 (issues entregues na S7).
const TOKEN = process.env.ZENHUB_GRAPHQL_TOKEN;
if (!TOKEN) throw new Error("Defina ZENHUB_GRAPHQL_TOKEN");

const REPO_GHID = 1208046400; // Usuario-Service
const NUMEROS = [82, 66, 67];

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

for (const numero of NUMEROS) {
  const { issueByInfo: issue } = await gql(
    `query($r:Int!,$n:Int!){ issueByInfo(repositoryGhId:$r, issueNumber:$n){ id number state title } }`,
    { r: REPO_GHID, n: numero },
  );
  if (!issue) { console.log(`#${numero}: não encontrada`); continue; }
  if (issue.state === "CLOSED") { console.log(`#${numero}: já está CLOSED — ok`); continue; }
  const r = await gql(
    `mutation($input: CloseIssuesInput!){ closeIssues(input:$input){ successCount } }`,
    { input: { issueIds: [issue.id], stateReason: "COMPLETED" } },
  );
  // confirma
  const { issueByInfo: depois } = await gql(
    `query($r:Int!,$n:Int!){ issueByInfo(repositoryGhId:$r, issueNumber:$n){ number state } }`,
    { r: REPO_GHID, n: numero },
  );
  console.log(`#${numero}: ${issue.state} -> ${depois.state} ✓  (${issue.title.slice(0, 40)})`);
}
console.log("Concluído.");
