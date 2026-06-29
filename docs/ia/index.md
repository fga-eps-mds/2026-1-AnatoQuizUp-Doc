# Inteligencia Artificial

## Visao geral

A frente de IA da Release 3 entregou um pipeline em notebook para preparar questoes do AnatoQuizUp e ingeri-las em um banco vetorial Qdrant. O objetivo foi deixar uma base inicial de RAG para buscas semanticas e futuras funcionalidades de geração de questoes.

Notebook principal e completo: `2026-1-AnatoQuizUp-AI/notebooks/ingestao_qdrant_questoes.ipynb`.

## O que o notebook faz

| Etapa | Objetivo |
|---|---|
| Configuracao dos caminhos | Define o CSV de entrada com as questoes estruturadas em `notebooks/dadosTeste`. |
| Leitura da base | Carrega a planilha em um DataFrame e inspeciona linhas/colunas disponiveis. |
| Selecao de colunas | Mantem os campos relevantes: enunciado, alternativas, tema, tipo, resposta correta e justificativa. |
| Limpeza textual | Normaliza espacos, quebras de linha, pontuacao e caracteres especiais sem remover acentos. |
| Remocao de duplicatas | Remove questoes repetidas usando enunciado, tema e justificativa como chave. |
| Criacao dos chunks | Monta uma representacao textual completa de cada questao para recuperacao semantica. |
| Configuracao do embedding e Qdrant | Define modelo de embeddings, URL do Qdrant, colecao e tamanhos de lote via variaveis de ambiente. |
| Geracao dos embeddings | Usa `SentenceTransformer` para transformar cada chunk em vetor normalizado. |
| Preparacao da colecao | Conecta ao Qdrant, cria a colecao quando necessario e valida compatibilidade da dimensao vetorial. |
| Construucao dos pontos | Cria IDs deterministicos e payloads com metadados da questao. |
| Ingestao em lotes | Envia os vetores e payloads para a colecao `questoes_anatoquiz`. |
| Indices de payload | Cria indices para campos como tema, tipo e alternativa correta. |
| Validacao | Confere a contagem de pontos gravados no Qdrant. |
| Busca semantica | Disponibiliza uma funcao de consulta para testar recuperacao por similaridade e filtro por tema. |

## Estado da entrega

Essa pipeline não está integrada com o restante do produto. O material entregue serve como base técnica para as próximas equipes transformarem o pipeline em serviço realmente integrado ao produto.

## Roadmap da Release 3

| Semana | Periodo | Entrega planejada |
|---|---|---|
| Semana 1 | 24/05-30/05 | Definicao da arquitetura do RAG, ingestao de PDFs e estruturacao do dataset. |
| Semana 2 | 31/05-06/06 | Limpeza, normalizacao e chunking das questoes. |
| Semana 3 | 07/06-13/06 | Vetorizacao do texto e geracao dos embeddings. |
| Semana 4 | 14/06-20/06 | Pipeline de ingestao continua ao banco vetorial. |
| Semana 5 | 21/06-27/06 | Handoff tecnico, documentacao e roadmap para a proxima equipe. |

## Proximos passos

- A planilha com todos os atributos a serem preenchidos definidos no semestre 2026/1 foi enviada aos POs.
- O combinado foi ter essa planilha preenchida para o semestre 2026/2.
- O novo dataset deverá ser integrado nessa pipeline no próximo semestre.