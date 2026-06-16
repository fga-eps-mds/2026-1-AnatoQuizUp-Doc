const D = window.DADOS_PRODUTO;
const VERDE = "#2e7d32", AMARELO = "#f9a825", VERMELHO = "#c62828", CINZA = "#777";

const REPOS = [
  { id: "Quiz-Service", titulo: "Dashboard QuizService", cor: "#00897b" },
  { id: "Usuario-Service", titulo: "Dashboard UsuarioService", cor: "#3f51b5" },
  { id: "Web", titulo: "Dashboard Web", cor: "#ef6c00" },
  { id: "BFF", titulo: "Dashboard BFF", cor: "#8e24aa" },
];

const temNumero = (v) => typeof v === "number" && Number.isFinite(v);
const classe = (v, alto = 0.75, medio = 0.50) => !temNumero(v) ? "cinza" : v >= alto ? "verde" : v >= medio ? "amarelo" : "vermelho";
const cor = (v, alto = 0.75, medio = 0.50) => !temNumero(v) ? CINZA : v >= alto ? VERDE : v >= medio ? AMARELO : VERMELHO;
const fmt = (v, c = 2) => temNumero(v) ? v.toFixed(c).replace(".", ",") : "Sem dados disponiveis";
const fmtInt = (v) => temNumero(v) ? Math.round(v).toLocaleString("pt-BR") : "Sem dados disponiveis";
const largura = (v, fator = 100) => temNumero(v) ? Math.max(0, Math.min(100, v * fator)) : 0;
const repoSlug = (repo) => repo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const repoDados = (repo) => D?.porRepo?.[repo];
const indicador = (repo, nome, fallback = null) => repoDados(repo)?.indicadores?.[nome] ?? fallback;

function linhaFator(f) {
  return `
    <div class="fator ${classe(f.valor)}">
      <div class="grupo">${f.grupo}<small>${f.fonte} - peso ${f.peso}</small></div>
      <div class="descricao">${f.nome}</div>
      <div class="barra"><span style="width:${largura(f.valor).toFixed(0)}%;background:${cor(f.valor)}"></span></div>
      <div class="numero">${fmt(f.valor)}</div>
    </div>`;
}

function cardIndicador(item) {
  return `
    <div class="cartao">
      <div class="rotulo">Indicador estrategico</div>
      <div class="nome">${item.nome}</div>
      <div class="valor ${classe(item.valor)}">${fmt(item.valor)}</div>
      <div class="barra"><span style="width:${largura(item.valor).toFixed(0)}%;background:${cor(item.valor)}"></span></div>
      <div class="rotulo" style="margin-top:6px">${item.desc}</div>
    </div>`;
}

function tabelaRepositorio(dados) {
  const t = dados?.tabela;

  if (!t) {
    return '<div class="nota">Sem dados disponiveis para este repositorio.</div>';
  }

  const celula = (valor, casas = 4) => temNumero(valor) ? valor.toFixed(casas).replace(".", ",") : (valor ?? "Sem dados disponiveis");
  const inteiro = (valor) => temNumero(valor) ? Math.round(valor).toLocaleString("pt-BR") : "Sem dados disponiveis";

  return `
    <div class="tabela-scroll">
      <table class="tabela tabela-produto">
        <thead>
          <tr>
            <th>Versão</th>
            <th>Data</th>
            <th class="num">Ncloc</th>
            <th class="num">Complexity</th>
            <th class="num">Comments</th>
            <th class="num">Duplication</th>
            <th class="num">Test Success</th>
            <th class="num">Fast Tests</th>
            <th class="num">Coverage</th>
            <th class="num">Maintainability</th>
            <th class="num">Reliability</th>
            <th class="num">Score Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${t.versao ?? "N/A"}</td>
            <td>${t.data ?? "Sem dados disponiveis"}</td>
            <td class="num">${inteiro(t.ncloc)}</td>
            <td class="num">${celula(t.complexity)}</td>
            <td class="num">${celula(t.comments)}</td>
            <td class="num">${celula(t.duplication)}</td>
            <td class="num">${celula(t.testSuccess)}</td>
            <td class="num">${celula(t.fastTests)}</td>
            <td class="num">${celula(t.coverage)}</td>
            <td class="num">${celula(t.maintainability)}</td>
            <td class="num">${celula(t.reliability)}</td>
            <td class="num">${celula(t.scoreTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>`;
}

function renderDashboard(repoInfo) {
  const repo = repoInfo.id;
  const dados = repoDados(repo);
  const slug = repoSlug(repo);

  if (!dados) {
    return `
      <section class="dashboard-repo" id="dashboard-${slug}">
        <div class="faixa-titulo"><h2>${repoInfo.titulo}</h2><span class="meta">Sem dados disponiveis</span></div>
        <div class="nota">Sem dados disponiveis para este repositorio.</div>
      </section>`;
  }

  const dens = dados.densidades ?? {};
  const qualidadeProduto = indicador(repo, "qualidadeProduto", dados.qualidadeProduto);
  const bloqueios = indicador(repo, "bloqueios");
  const prontidao = indicador(repo, "prontidao");
  const estabilidadeBuilds = indicador(repo, "estabilidadeBuilds");
  const conclusaoTarefas = indicador(repo, "conclusaoTarefas");

  const estrategicos = [
    { nome: "Qualidade do Produto", valor: qualidadeProduto, desc: "densidades ponderadas (35/10/25/30)" },
    { nome: "Bloqueios", valor: bloqueios, desc: "issues bem definidas / total" },
    { nome: "Prontidao do Produto", valor: prontidao, desc: "builds com sucesso / concluidas" },
  ];
  const fatoresQualidade = [
    { grupo: "Code Quality", fonte: "Maintainability - SonarCloud", nome: "Complexity - arquivos nao complexos (ciclomatica/funcao <= 10)", peso: "35%", valor: dens.complexidade },
    { grupo: "Code Quality", fonte: "Maintainability - SonarCloud", nome: "Comments - arquivos com 10%-30% de linhas comentadas", peso: "10%", valor: dens.comentarios },
    { grupo: "Code Quality", fonte: "Maintainability - SonarCloud", nome: "Duplication - arquivos com < 5% de linhas duplicadas", peso: "25%", valor: dens.duplicacao },
    { grupo: "Testing Status", fonte: "Reliability - SonarCloud", nome: "Coverage - arquivos com cobertura >= 85%", peso: "30%", valor: dens.cobertura },
  ];
  const fatoresProntidao = [
    { grupo: "Quality Issues' Specification", fonte: "Blocking - GitHub", nome: "Well defined issues - issues com descricao preenchida", peso: "-", valor: bloqueios },
    { grupo: "Product Stability", fonte: "Readiness - GitHub Actions", nome: "Build stability - builds com sucesso / concluidas", peso: "-", valor: estabilidadeBuilds },
    { grupo: "Activities Completion", fonte: "Process Factor - GitHub", nome: "Task completion - issues fechadas / total", peso: "-", valor: conclusaoTarefas },
  ];

  return `
    <section class="dashboard-repo" id="dashboard-${slug}">
      <div class="faixa-titulo">
        <h2>${repoInfo.titulo}</h2>
      </div>
      <div class="cartoes">${estrategicos.map(cardIndicador).join("")}</div>
      <div class="faixa-titulo"><h2>Fatores e metricas avaliadas - Qualidade do Produto</h2></div>
      <div class="fatores">${fatoresQualidade.map(linhaFator).join("")}</div>
      <div class="faixa-titulo"><h2>Fatores e metricas avaliadas - Bloqueios &amp; Prontidao</h2></div>
      <div class="fatores">${fatoresProntidao.map(linhaFator).join("")}</div>
      ${tabelaRepositorio(dados)}
    </section>`;
}

document.getElementById("abas-repos").innerHTML = REPOS.map((repo, index) =>
  `<a href="#dashboard-${repoSlug(repo.id)}" class="${index === 0 ? "ativa" : ""}" data-repo="${repo.id}">${repo.titulo.replace("Dashboard ", "")}</a>`
).join("");
document.getElementById("dashboards-repos").innerHTML = REPOS.map(renderDashboard).join("");

function ativarDashboard(repoId, atualizarHash = true) {
  const slug = repoSlug(repoId);
  document.querySelectorAll("#abas-repos a").forEach((item) => item.classList.toggle("ativa", item.dataset.repo === repoId));
  document.querySelectorAll(".dashboard-repo").forEach((painel) => painel.classList.toggle("ativa", painel.id === `dashboard-${slug}`));
  if (atualizarHash) history.replaceState(null, "", `#dashboard-${slug}`);
}

document.querySelectorAll("#abas-repos a").forEach((aba) => {
  aba.addEventListener("click", (evento) => {
    evento.preventDefault();
    ativarDashboard(aba.dataset.repo);
  });
});

const repoInicial = REPOS.find((repo) => `dashboard-${repoSlug(repo.id)}` === location.hash.slice(1)) ?? REPOS[0];
ativarDashboard(repoInicial.id, false);
