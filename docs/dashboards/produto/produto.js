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
const fmt = (v) => temNumero(v) ? v.toFixed(2).replace(".", ",") : "Sem dados dispon&iacute;veis";
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
  const celula = (valor, casas = 4) => temNumero(valor) ? valor.toFixed(casas).replace(".", ",") : "-";
  const inteiro = (valor) => temNumero(valor) ? Math.round(valor).toLocaleString("pt-BR") : "-";
  const bruto = (valor) => temNumero(valor) ? Number(valor).toLocaleString("pt-BR") : "-";
  const razao = (parte, total) => `${bruto(parte)}/${bruto(total)}`;
  const formula = (nome, expressao, resultado, casas = 4) => `<div class="formula-celula"><span>${nome}: ${expressao}</span><strong>${nome} Result: ${celula(resultado, casas)}</strong></div>`;
  const corpo = linhas.map((linha) => {
    const b = linha.brutos ?? {};
    const q = b.qrapids ?? {};
    const testes = b.testes ?? {};
    const complexity = formula("Complexity", razao(q.arquivosNaoComplexos, q.totalArquivos), linha.complexity);
    const comments = formula("Comments", razao(q.arquivosComentariosOk, q.totalArquivos), linha.comments);
    const duplication = formula("Duplication", razao(q.arquivosDuplicacaoOk, q.totalArquivos), linha.duplication);
    const testSuccess = formula("Test Success", `(${bruto(testes.totalTestes)} - ${bruto(testes.erros)} - ${bruto(testes.falhas)}) / ${bruto(testes.totalTestes)}`, linha.testSuccess);
    const fastTests = formula("Fast Tests", razao(testes.buildsCiRapidas, testes.buildsCiConcluidas), linha.fastTests);
    const coverage = formula("Coverage", razao(q.arquivosCoberturaOk, q.totalArquivosComCobertura), linha.coverage);
    const maintainability = formula("Maintainability", `((${celula(linha.complexity)} * 0,33) + (${celula(linha.comments)} * 0,33) + (${celula(linha.duplication)} * 0,33)) * 0,50`, linha.maintainability);
    const reliability = formula("Reliability", `((${celula(linha.testSuccess)} * 0,25) + (${celula(linha.fastTests)} * 0,25) + (${celula(linha.coverage)} * 0,50)) * 0,50`, linha.reliability);
    const productQuality = formula("Product Quality", `${celula(linha.maintainability)} + ${celula(linha.reliability)}`, linha.scoreTotal);
    return `<tr>
      <td>${linha.versao ?? "N/A"}</td><td>${linha.data ?? "-"}</td><td class="num">${inteiro(linha.ncloc)}</td>
      <td>${complexity}</td><td>${comments}</td><td>${duplication}</td>
      <td>${testSuccess}</td><td>${fastTests}</td><td>${coverage}</td>
      <td>${maintainability}</td><td>${reliability}</td><td>${productQuality}</td>
    </tr>`;
  }).join("");
  return `<div class="tabela-scroll" tabindex="0"><table class="tabela tabela-produto tabela-historico">
    <thead><tr><th>Vers&atilde;o</th><th>Data da coleta</th><th class="num">Ncloc</th><th>Complexity</th><th>Comments</th><th>Duplication</th><th>Test Success</th><th>Fast Tests</th><th>Coverage</th><th>Maintainability</th><th>Reliability</th><th>Product Quality</th></tr></thead>
    <tbody>${corpo || '<tr><td colspan="12">Sem hist&oacute;rico dispon&iacute;vel.</td></tr>'}</tbody>
  </table></div>`;
}

function renderDashboard(repoInfo) {
  const dados = D?.porRepo?.[repoInfo.id];
  const slug = repoSlug(repoInfo.id);
  if (!dados) return `<section class="dashboard-repo" id="dashboard-${slug}"><div class="nota">Sem dados dispon&iacute;veis para este reposit&oacute;rio.</div></section>`;

  const t = dados.tabela ?? {};
  const cards = [
    { tipo: "Indicador estrat&eacute;gico", nome: "Product Quality (Qualidade do Produto)", valor: t.scoreTotal },
    { tipo: "Fator de Qualidade", nome: "Maintainability (Manutenibilidade)", valor: t.maintainability, maximo: 0.50 },
    { tipo: "Fator de Qualidade", nome: "Reliability (Confiabilidade)", valor: t.reliability, maximo: 0.50 },
  ];
  const codeQuality = [
    { nome: "Complexity - arquivos n&atilde;o complexos (nenhuma fun&ccedil;&atilde;o com complexidade ciclom&aacute;tica > 10)", valor: t.complexity },
    { nome: "Comments - arquivos com linhas de coment&aacute;rios aceit&aacute;veis (10-30%)", valor: t.comments },
    { nome: "Duplication - arquivos com menos de 5% de linhas duplicadas", valor: t.duplication },
  ];
  const testingStatus = [
    { nome: "Test success - testes aprovados / total de testes unit&aacute;rios", valor: t.testSuccess },
    { nome: "Fast tests - builds de CI conclu&iacute;dos em menos de 5 minutos", valor: t.fastTests },
    { nome: "Coverage - arquivos com cobertura adequada (&ge; 80%)", valor: t.coverage },
  ];

  return `<section class="dashboard-repo" id="dashboard-${slug}">
    <div class="faixa-titulo"><h2>${repoInfo.titulo}</h2><span class="meta">${t.release ? `Release ${t.release} &middot; ` : ""}vers&atilde;o ${t.versao ?? "N/A"} &middot; ${t.data ?? "sem data"}</span></div>
    <div class="cartoes">${cards.map(card).join("")}</div>
    <div class="legenda legenda-fatores" aria-label="Legenda dos fatores com escala de zero a 0,50">
      <strong>Maintainability e Reliability - escala de 0 a 0,50:</strong>
      <span class="item verde">verde &ge; 0,375</span>
      <span class="item amarelo">amarelo de 0,25 a 0,374</span>
      <span class="item vermelho">vermelho &lt; 0,25</span>
    </div>
    <section class="memoria">
      <h3>F&oacute;rmulas Utilizadas</h3>
      <div class="formulas">
        <div><code>Code Quality</code> = (Complexity &times; 0,33) + (Comments &times; 0,33) + (Duplication &times; 0,33)<small>Conformidade dos arquivos para complexidade, coment&aacute;rios e duplica&ccedil;&atilde;o.</small></div>
        <div><code>Testing Status</code> = (Test Success &times; 0,25) + (Fast Tests &times; 0,25) + (Coverage &times; 0,50)<small>Sucesso dos testes, velocidade dos builds de CI e cobertura por arquivo.</small></div>
        <div><code>Maintainability</code> = Code Quality &times; 0,50<small>Fator de Qualidade 1</small></div>
        <div><code>Reliability</code> = Testing Status &times; 0,50<small>Fator de Qualidade 2</small></div>
        <div><code>Product Quality</code> = Maintainability + Reliability<small>Qualidade total do produto</small></div>
      </div>
    </section>
    <section class="painel-qualidade">
      <h3>Fatores e m&eacute;tricas avaliadas - Product Quality</h3>
      <div class="legenda legenda-interna"><span class="item verde">verde &ge; 0,75 (aprovado)</span><span class="item amarelo">amarelo 0,50-0,74 (aten&ccedil;&atilde;o)</span><span class="item vermelho">vermelho &lt; 0,50 (cr&iacute;tico)</span></div>
      ${grupo("Code Quality", "Maintainability &middot; Fonte: SonarQube", codeQuality)}
      ${grupo("Testing Status", "Reliability &middot; Fontes: SonarQube / GitHub Actions", testingStatus)}
    </section>
    <section class="observacoes">
      <h3>Observa&ccedil;&otilde;es:</h3>
      <p>O dashboard escolhe sempre o JSON mais recente do respectivo reposit&oacute;rio em <code>analytics-raw-data</code>.</p>
      <h3>C&aacute;lculo das m&eacute;tricas-base</h3>
      <div class="calculos-base">
        <div><code>Complexity</code><span>arquivos n&atilde;o complexos &divide; total de arquivos; um arquivo &eacute; complexo quando sua complexidade ciclom&aacute;tica por fun&ccedil;&atilde;o &eacute; &gt; 10</span><small>Fonte: SonarQube</small></div>
        <div><code>Comments</code><span>arquivos com 10-30% de linhas comentadas &divide; total de arquivos analisados</span><small>Fonte: SonarQube</small></div>
        <div><code>Duplication</code><span>arquivos com menos de 5% de linhas duplicadas &divide; total de arquivos analisados</span><small>Fonte: SonarQube</small></div>
        <div><code>Test Success</code><span>(testes unit&aacute;rios - erros - falhas) &divide; total de testes unit&aacute;rios</span><small>Fonte: SonarQube</small></div>
        <div><code>Fast Tests</code><span>execu&ccedil;&otilde;es de testes unit&aacute;rios abaixo de 5 minutos &divide; total de execu&ccedil;&otilde;es de testes unit&aacute;rios</span><small>Fonte: GitHub Actions (workflow CI)</small></div>
        <div><code>Coverage</code><span>arquivos com cobertura &ge; 80% &divide; total de arquivos que possuem medi&ccedil;&atilde;o de cobertura</span><small>Fonte: SonarQube</small></div>
      </div>
      <h3>Hist&oacute;rico de dados</h3>
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