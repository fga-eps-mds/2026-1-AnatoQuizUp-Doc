const D = window.DADOS_PRODUTO;
const VERDE = "#2e7d32", AMARELO = "#f9a825", VERMELHO = "#c62828", CINZA = "#777";

const REPOS = [
  { id: "Quiz-Service", titulo: "Dashboard QuizService" },
  { id: "Usuario-Service", titulo: "Dashboard UsuarioService" },
  { id: "Web", titulo: "Dashboard Web" },
  { id: "BFF", titulo: "Dashboard BFF" },
];

const temNumero = (v) => typeof v === "number" && Number.isFinite(v);
const classe = (v, alto = 0.75, medio = 0.50) => !temNumero(v) ? "cinza" : v >= alto ? "verde" : v >= medio ? "amarelo" : "vermelho";
const cor = (v, alto = 0.75, medio = 0.50) => !temNumero(v) ? CINZA : v >= alto ? VERDE : v >= medio ? AMARELO : VERMELHO;
const fmt = (v) => temNumero(v) ? v.toFixed(2).replace(".", ",") : "Sem dados disponíveis";
const normalizar = (v, maximo = 1) => temNumero(v) && maximo > 0 ? v / maximo : v;
const largura = (v, maximo = 1) => temNumero(v) ? Math.max(0, Math.min(100, normalizar(v, maximo) * 100)) : 0;
const repoSlug = (repo) => repo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function barra(valor, maximo = 1) {
  const valorNormalizado = normalizar(valor, maximo);
  return `<div class="barra"><span style="width:${largura(valor, maximo).toFixed(0)}%;background:${cor(valorNormalizado)}"></span></div>`;
}

function card(item) {
  const valorNormalizado = normalizar(item.valor, item.maximo);
  return `<div class="cartao">
    <div class="rotulo">${item.tipo}</div>
    <div class="nome">${item.nome}</div>
    <div class="valor ${classe(valorNormalizado)}">${fmt(item.valor)}</div>
    ${barra(item.valor, item.maximo)}
  </div>`;
}

function metrica(item) {
  return `<div class="metrica ${classe(item.valor)}">
    <div class="descricao">${item.nome}</div>
    ${barra(item.valor)}
    <div class="numero">${fmt(item.valor)}</div>
  </div>`;
}

function grupo(titulo, fonte, metricas) {
  return `<div class="grupo-qualidade">
    <div class="grupo-info"><strong>${titulo}</strong><small>${fonte}</small></div>
    <div class="metricas">${metricas.map(metrica).join("")}</div>
  </div>`;
}

function tabelaHistorico(linhas = []) {
  const celula = (valor, casas = 4) => temNumero(valor) ? valor.toFixed(casas).replace(".", ",") : "—";
  const inteiro = (valor) => temNumero(valor) ? Math.round(valor).toLocaleString("pt-BR") : "—";
  const corpo = linhas.map((linha) => `<tr>
    <td>${linha.versao ?? "N/A"}</td><td>${linha.data ?? "—"}</td><td class="num">${inteiro(linha.ncloc)}</td>
    <td class="num">${celula(linha.complexity)}</td><td class="num">${celula(linha.comments)}</td><td class="num">${celula(linha.duplication)}</td>
    <td class="num">${celula(linha.testSuccess)}</td><td class="num">${celula(linha.fastTests)}</td><td class="num">${celula(linha.coverage)}</td>
    <td class="num">${celula(linha.maintainability)}</td><td class="num">${celula(linha.reliability)}</td><td class="num">${celula(linha.scoreTotal)}</td>
  </tr>`).join("");
  return `<div class="tabela-scroll"><table class="tabela tabela-produto tabela-historico">
    <thead><tr><th>Versão</th><th>Data da coleta</th><th class="num">Ncloc</th><th class="num">Complexity</th><th class="num">Comments</th><th class="num">Duplication</th><th class="num">Test Success</th><th class="num">Fast Tests</th><th class="num">Coverage</th><th class="num">Maintainability</th><th class="num">Reliability</th><th class="num">Product Quality</th></tr></thead>
    <tbody>${corpo || '<tr><td colspan="12">Sem histórico disponível.</td></tr>'}</tbody>
  </table></div>`;
}

function renderDashboard(repoInfo) {
  const dados = D?.porRepo?.[repoInfo.id];
  const slug = repoSlug(repoInfo.id);
  if (!dados) return `<section class="dashboard-repo" id="dashboard-${slug}"><div class="nota">Sem dados disponíveis para este repositório.</div></section>`;

  const t = dados.tabela ?? {};
  const cards = [
    { tipo: "Indicador estratégico", nome: "Product Quality (Qualidade do Produto)", valor: t.scoreTotal },
    { tipo: "Fator de Qualidade", nome: "Maintainability (Manutenibilidade)", valor: t.maintainability, maximo: 0.50 },
    { tipo: "Fator de Qualidade", nome: "Reliability (Confiabilidade)", valor: t.reliability, maximo: 0.50 },
  ];
  const codeQuality = [
    { nome: "Complexity — arquivos não complexos (ciclomática/função ≤ 10)", valor: t.complexity },
    { nome: "Comments — arquivos com linhas de comentários aceitáveis (10–30%)", valor: t.comments },
    { nome: "Duplication — arquivos com menos de 5% de linhas duplicadas", valor: t.duplication },
  ];
  const testingStatus = [
    { nome: "Test success — suítes sem erros ou falhas / suítes avaliadas", valor: t.testSuccess },
    { nome: "Fast tests — builds de CI concluídos em menos de 5 minutos", valor: t.fastTests },
    { nome: "Coverage — arquivos com cobertura adequada (≥ 80%)", valor: t.coverage },
  ];

  return `<section class="dashboard-repo" id="dashboard-${slug}">
    <div class="faixa-titulo"><h2>${repoInfo.titulo}</h2><span class="meta">${t.release ? `Release ${t.release} · ` : ""}versão ${t.versao ?? "N/A"} · ${t.data ?? "sem data"}</span></div>
    <div class="cartoes">${cards.map(card).join("")}</div>
    <div class="legenda legenda-fatores" aria-label="Legenda dos fatores com escala de zero a 0,50">
      <strong>Maintainability e Reliability — escala de 0 a 0,50:</strong>
      <span class="item verde">verde ≥ 0,375</span>
      <span class="item amarelo">amarelo de 0,25 a 0,374</span>
      <span class="item vermelho">vermelho &lt; 0,25</span>
    </div>
    <section class="memoria">
      <h3>Fórmulas Utilizadas</h3>
      <div class="formulas">
        <div><code>Code Quality</code> = (Complexity × 0,40) + (Comments × 0,20) + (Duplication × 0,40)<small>Conformidade dos arquivos para complexidade, comentários e duplicação.</small></div>
        <div><code>Testing Status</code> = (Test Success × 0,25) + (Fast Tests × 0,25) + (Coverage × 0,50)<small>Estabilidade das suítes de testes, velocidade dos builds de CI e cobertura por arquivo.</small></div>
        <div><code>Maintainability</code> = Code Quality × 0,50<small>Fator de Qualidade 1</small></div>
        <div><code>Reliability</code> = Testing Status × 0,50<small>Fator de Qualidade 2</small></div>
      </div>
    </section>
    <section class="painel-qualidade">
      <h3>Fatores e métricas avaliadas — Product Quality</h3>
      <div class="legenda legenda-interna"><span class="item verde">verde ≥ 0,75 (aprovado)</span><span class="item amarelo">amarelo 0,50–0,74 (atenção)</span><span class="item vermelho">vermelho &lt; 0,50 (crítico)</span></div>
      ${grupo("Code Quality", "Maintainability · Fonte: SonarQube", codeQuality)}
      ${grupo("Testing Status", "Reliability · Fontes: SonarQube / GitHub Actions", testingStatus)}
    </section>
    <section class="observacoes">
      <h3>Observações:</h3>
      <p>O dashboard escolhe sempre o JSON mais recente do respectivo repositório em <code>analytics-raw-data</code>.</p>
      <p>Quando um atributo não está presente na coleta atual por algum motivo, somente ele utiliza o último valor disponível.</p>
      <h3>Cálculo das métricas-base</h3>
      <div class="calculos-base">
        <div><code>Complexity</code><span>arquivos com (complexidade ciclomática ÷ funções) ≤ 10 ÷ total de arquivos com funções</span><small>Fonte: SonarQube</small></div>
        <div><code>Comments</code><span>arquivos com 10%–30% de linhas comentadas ÷ total de arquivos analisados</span><small>Fonte: SonarQube</small></div>
        <div><code>Duplication</code><span>arquivos com menos de 5% de linhas duplicadas ÷ total de arquivos analisados</span><small>Fonte: SonarQube</small></div>
        <div><code>Test Success</code><span>suítes sem erros ou falhas ÷ total de suítes UTS avaliadas</span><small>Fonte: SonarQube</small></div>
        <div><code>Fast Tests</code><span>builds de CI concluídos em menos de 5 minutos ÷ total de builds de CI concluídos</span><small>Fonte: GitHub Actions</small></div>
        <div><code>Coverage</code><span>arquivos com cobertura ≥ 80% ÷ total de arquivos que possuem medição de cobertura</span><small>Fonte: SonarQube</small></div>
      </div>
      <h3>Histórico de dados</h3>
      ${tabelaHistorico(dados.historicoTabela)}
    </section>
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

document.querySelectorAll("#abas-repos a").forEach((aba) => aba.addEventListener("click", (evento) => {
  evento.preventDefault();
  ativarDashboard(aba.dataset.repo);
}));

const repoInicial = REPOS.find((repo) => `dashboard-${repoSlug(repo.id)}` === location.hash.slice(1)) ?? REPOS[0];
ativarDashboard(repoInicial.id, false);
