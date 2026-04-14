# Tecnologias

## Estilo Arquitetural
( a definir...)

## Visão Geral

### Diagrama de Contâiners
O diagrama a seguir apresenta a decomposição do sistema em seus principais contêineres, mostrando as escolhas tecnológicas e a comunicação entre contâiners

![Diagrama de Contêineres](../assets/arquitetura/diagrama-de-contexto.png)

## Componentes e suas tecnologias

### Frontend

Único responsável pelas interações com o usuário.

- Realiza chamadas ao backend via API REST  
- Gerencia estado da interface e interações do usuário 

**React**

O React é uma biblioteca que será utilizada como base para a construção da interface da aplicação, permitindo o desenvolvimento de componentes reutilizáveis e dinâmicos. Sua abordagem baseada em componentes facilita a organização do código e melhora a manutenção do sistema em relação ao desenvolvimento tradicional utilizando HTML, CSS e Javascript.

**Nextjs**

O Next.js será empregado como framework principal, oferecendo recursos como renderização no servidor, geração de páginas estáticas e roteamento otimizado. Isso contribui para melhor experiência de usuário, desempenho e escalabilidade da aplicação.

**Tailwind CSS**

O Tailwind CSS será utilizado para a estilização da interface, adotando uma abordagem utilitária que permite a criação ágil de layouts responsivos e consistentes a partir de classes de estilo pequenas e descritivas que permitem controle sobre a identidade visual. Essa ferramenta reduz a necessidade de CSS customizado e facilita a padronização visual do projeto.

---

### Backend (Node JS)

Responsável pelas regras de negócio e processamento da aplicação.

- Gerencia autenticação e autorização  
- Controla o fluxo de criação, validação e resolução de questões  

---

### Banco de Dados (PostgreSQL)

- Armazena dados de usuários  
- Armazena questões e seus estados
- Registra respostas e desempenho dos estudantes  

---


## Referências

> CAJUDEVS. Entendendo o C4 Model: uma abordagem para arquitetura de software. Disponível em: <https://medium.com/cajudevs/entendendo-o-c4-model-uma-abordagem-para-arquitetura-de-software-3ed0f007ae66>. Acesso em: 10 abr. 2026.

>C4 MODEL. Container Diagram. Disponível em: <https://c4model.com/diagrams/container>. Acesso em: 10 abr. 2026.

> React. Disponível em: <https://react.dev>. Acesso em: 13 abr. 2026.

> Next.js Docs. Disponível em: <https://nextjs.org/docs>. Acesso em: 13 abr. 2026.

> O que é Tailwind CSS. Disponível em: <https://tailwindcss.com.br/guia-tailwind/o-que-e-tailwind-css>. Acesso em: 13 abr. 2026. 

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criação do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) | 
| 13/04/2026 | 1.1 | Adicionando tecnologias a serem utilizadas no frontend | [João Vitor](https://github.com/Joa0V) | 