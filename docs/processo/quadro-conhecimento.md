# Quadro de Conhecimento

## Sobre o quadro

O quadro de conhecimento é uma autoavaliação dos membros do time sobre suas habilidades nas tecnologias e práticas relevantes para o projeto. É utilizado como insumo para definir pareamentos e distribuir tarefas de forma eficiente — colocando quem sabe mais junto de quem está aprendendo.

### Escala

| Nota | Significado |
|------|-------------|
| 0 | Não conheço |
| 1 | Aprendendo |
| 2 | Sei usar |
| 3 | Sei muito |

---

## Avaliação por membro

| Membro | React | Node.js | PostgreSQL | Docker | CI/CD Sonar | Python/Pandas | Figma | Scrum | Jest | Git avançado |
|--------|-------|---------|------------|--------|-------------|---------------|-------|-------|------|-------------|
| Arthur Carneiro Trindade | 3 | 3 | 3 | 2 | 1 | 2 | 3 | 3 | 2 | 3 |
| Miguel Moreira de Oliveira | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 3 | 2 | 3 |
| Breno Soares Fernandes | 2 | 2 | 3 | 2 | 1 | 2 | 2 | 3 | 1 | 3 |
| Ana Catarina Lopes e Vasconcelos | 3 | 3 | 2 | 3 | 2 | 2 | 1 | 3 | 3 | 3 |
| Victor Hugo Rodrigues Guimarães | 2 | 2 | 2 | 1 | 2 | 1 | 3 | 3 | 1 | 3 |
| Pedro Cabeceira de Freitas | 2 | 3 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 2 |
| Kathlyn Lara Murussi | 2 | 2 | 2 | 2 | 1 | 2 | 1 | 3 | 1 | 3 |
| Caio Brandão Santos | 3 | 3 | 3 | 2 | 2 | 3 | 2 | 3 | 1 | 3 |
| Maria Luisa Alves Rodrigues | 2 | 2 | 3 | 2 | 1 | 3 | 2 | 3 | 1 | 3 |
| João Vitor Lopes Ribeiro | 2 | 2 | 2 | 2 | 1 | 2 | 1 | 3 | 2 | 3 |
| Genilson Silva de Araújo Júnior | 2 | 1 | 2 | 3 | 1 | 3 | 3 | 1 | 1 | 3 |
| Bruno Ricardo de Menezes | 3 | 3 | 3 | 2 | 1 | 2 | 1 | 3 | 2 | 3 |

---

## Média por skill

| Skill | Média |
|-------|-------|
| React | 2,4 |
| Node.js | 2,4 |
| PostgreSQL | 2,5 |
| Docker | 2,1 |
| CI/CD Sonar | 1,4 |
| Python/Pandas | 2,2 |
| Figma | 1,7 |
| Scrum | 2,7 |
| Jest | 1,5 |
| Git avançado | 2,9 |

---

## Análise

### Pontos fortes do time
As maiores médias estão em **Git avançado (2,9)**, **Scrum (2,7)** e **PostgreSQL (2,5)** — o time tem boa base em controle de versão, processo ágil e banco de dados.

### Pontos de atenção
As menores médias estão em **CI/CD e SonarCloud (1,4)** e **Jest (1,5)** — áreas que impactam diretamente a qualidade do código e a capacidade de atingir os 85% de cobertura exigidos. A decisão de concentrar o CI/CD no Victor foi acertada por ser um dos poucos com nota 2 nessa skill. Pareamentos focados em testes são recomendados para elevar a proficiência geral em Jest.

### Pareamentos recomendados

Com base no quadro, os seguintes pareamentos são recomendados para maximizar transferência de conhecimento:

| Área | Quem sabe mais | Parear com |
|------|---------------|------------|
| React + Frontend | Arthur, Miguel, Ana Catarina, Caio | Genilson, Pedro, Lara |
| Node.js + Backend | Arthur, Miguel, Ana Catarina, Pedro, Bruno R. | Victor, Lara, Breno |
| Jest + Testes | Ana Catarina (3) | Demais membros (maioria em 1) |
| Docker | Ana Catarina (3), Genilson (3) | Victor (1) |
| Figma + Design | Victor (3), Arthur (3), Genilson (3) | Pedro, Lara, Bruno R., Ana Catarina |
| CI/CD | Victor (2), Ana Catarina (2), Miguel (2), Caio (2) | Demais membros |
