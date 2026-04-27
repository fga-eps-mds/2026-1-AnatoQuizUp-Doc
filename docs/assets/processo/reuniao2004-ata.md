# Ata de Reunião - 20/04/2026

## Identificação
- **Título da reunião:** Validação do sequenciador e dos critérios de aceitação com os PO's
- **Data:** 20/04/2026
- **Horário:** 10:00 – 11:30 
- **Local / Plataforma:**  Microsoft Teams

---

## Objetivo da reunião
Apresentar e validar com os clientes os artefatos do Lean Inception (sequenciador e critérios de aceitação), além de alinhar o fluxo de controle de acesso, cadastro de usuários e integração com o banco de questões.

---

## Participantes

Marque com `[x]` quem participou.

### PO's
- [x] Hugo De Verson Santana Camilo Jorge
- [ ] Marcus Vinicius Chaffim Costa
- [x] Neysa Aparecida Tinoco Regattieri

### Professor
- [x] Hilmer Rodrigues Neri (20 min)

### Equipe
- [x] Ana Catarina Lopes Vasconcelos dos Santos
- [x] Arthur Carneiro Trindade
- [x] Breno Soares Fernandes
- [x] Bruno Ricardo de Menezes
- [ ] Caio Brandão Santos
- [x] Genilson Silva de Araújo Júnior
- [x] João Vitor Lopes Ribeiro
- [ ] Kathlyn Lara Murussi
- [ ] Maria Luisa Alves Rodrigues
- [x] Miguel Moreira de Oliveira
- [x] Pedro Cabaceira de Freitas
- [x] Victor Hugo Rodrigues Guimarães

---

## Pauta
1. Apresentação da tela de login em deploy.
2. Validação do Sequenciador (Lean Inception).
3. Definição de regras de controle de acesso (Professores/Alunos/ADM).
4. Validação dos Critérios de Aceitação (CAs) das Histórias de Usuário.
5. Alinhamento sobre o Banco de Questões.
---

## Discussões e decisões

1. **Interface e Validação de Deploy**
   - Apresentação da tela de login em produção com feedback positivo de Neysa e Hugo
   - linhamento de que a validação formal depende da aprovação explícita dos critérios de aceitação

2. **Estrutura do Sequenciador**
   - Decisão de incorporar os cards "Filtrar questões" e "Gerar PDF" como critérios de aceitação de cards maiores
   - Necessidade de renomear e detalhar o card "Conquistas" para evidenciar a gamificação

3. **Controle de Acesso e Autenticação**
    - Definição de prioridade para autenticação via Microsoft (e-mail institucional UnB) para professores.
    - Definição de fluxo alternativo com autorização manual caso a automação não seja viável.
    - Reformulação do Cadastro de Alunos: Ajuste para tornar obrigatórios os campos de Instituição (especificando se pública ou privada), Curso e Período.
    - Inclusão de opção "Não estou matriculado em nenhuma universidade", que faz não ser obrigatorio o preenchimento do campo de vínculo escolar ou faculdade.
    - Identificada a necessidade de incluir o perfil de Administrador no fluxo de login.

4. **Banco de Questões**
    - Confirmação da existência do banco de questões em ambiente Drive
    - Acerto de que o PO Hugo compartilhará o acesso com a equipe

---

## Encaminhamentos / Ações

| Ação | Responsável | Prazo |
|------|------------|-------|
| Ajustar CAs de cadastro de aluno (campos obrigatórios) |      Equipe | 21/04/2026 |
| Avaliar viabilidade técnica de login via Microsoft/UnB | Equipe | Contínua |
| Enviar banco de questões/acesso ao Drive | Hugo | 27/04/2026 |
| Enviar cronograma da disciplina para o PO Hugo | Equipe | A definir |
| Validar restante do sequenciador de forma assíncrona | Equipe/Clientes | Contínua |
| Incluir perfil "Administrador" nos Critérios de Aceitação de Login | Equipe | 21/04/2026 |
| Detalhar card "Conquistas" (Gamificação) e ajustar cards do Sequenciador | Equipe | 23/04/2026 |
| Produção e validação progressiva dos protótipos de alta fidelidade | Equipe/PO's | Contínuo |


---

## Pendências
- Confirmar status de validação formal da tela de login (vincular aos CAs).
- Detalhar card de gamificação ("Conquistas").
- Incluir critério de aceitação na História de Usuário de Login para contemplar a autenticação de perfis administrativos.
---

## Próximos passos
- Atualizar Histórias de Usuário e Critérios de Aceitação (Login e Cadastro) conforme os novos perfis e exigências levantadas.
- Continuidade da validação de materiais com a Neysa de forma assíncrona.
- Produção e validação progressiva dos protótipos de alta fidelidade.

---

## Observações adicionais
- A professora Neysa ausentou-se às 11h, seguindo a validação com o PO Hugo e posterior alinhamento assíncrono.
- A equipe confirmou possuir os insumos necessários para a próxima entrega.
