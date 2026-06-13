// Introspecção rápida do schema GraphQL do ZenHub (uso pontual durante o desenvolvimento)
const token = process.env.ZENHUB_GRAPHQL_TOKEN;
if (!token) throw new Error("Defina ZENHUB_GRAPHQL_TOKEN");

async function gql(query) {
  const res = await fetch("https://api.zenhub.com/public/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) console.error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

for (const tipo of ["Issue", "Sprint", "Estimate", "TimelineItem"]) {
  const d = await gql(`query { __type(name: "${tipo}") { kind fields { name } possibleTypes { name } } }`);
  const t = d?.__type;
  console.log(`\n== ${tipo} (${t?.kind ?? "não existe"}) ==`);
  if (t?.fields) console.log(t.fields.map((f) => f.name).join(", "));
  if (t?.possibleTypes?.length) console.log("possibleTypes:", t.possibleTypes.map((p) => p.name).join(", "));
}
