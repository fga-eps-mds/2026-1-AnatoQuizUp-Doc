# Tecnologias

## Componentes e suas tecnologias

### Frontend

Único responsável pelas interações com o usuário.

- Realiza chamadas ao **BFF** via API REST (não acessa o Backend diretamente)
- Gerencia estado da interface e interações do usuário

**React**

O React é uma biblioteca que será utilizada como base para a construção da interface da aplicação, permitindo o desenvolvimento de componentes reutilizáveis e dinâmicos. Sua abordagem baseada em componentes facilita a organização do código e melhora a manutenção do sistema em relação ao desenvolvimento tradicional utilizando HTML, CSS e Javascript.

**Vite**

Vite é uma ferramenta de desenvolvimento e build para frontends de aplicações web. Ele possui um sistema que permite um menor tempo de espera durante o desenvolvimento, suporte ao React, server-side rendering (SSR), code-splitting e carregamento assíncrono e pode ter suas capacidades expandidas via plugin-ins. Além disso ele não é opinativo quanto a estrutura de pastas, o que permite maior liberdade na estruturação do código para seguir os padrões escolhidos.

**Tailwind CSS**

O Tailwind CSS será utilizado para a estilização da interface, adotando uma abordagem utilitária que permite a criação ágil de layouts responsivos e consistentes a partir de classes de estilo pequenas e descritivas que permitem controle sobre a identidade visual. Essa ferramenta reduz a necessidade de CSS customizado e facilita a padronização visual do projeto.

---

### BFF (Node JS)

Camada intermediária entre o Frontend e os serviços de domínio (Backend e AI). Atua como proxy 100% orquestração — não possui regras de negócio nem persistência própria.

- Recebe todas as chamadas do Frontend e é o único endereço público da plataforma do lado dos serviços
- Valida o JWT (assinatura/expiração) antes de repassar adiante
- Injeta `X-Internal-Token` (segredo compartilhado) e cabeçalhos auxiliares (`X-User-Id`, `X-User-Profile`) nas chamadas downstream
- Roteia por path: `/api/v1/autenticacao/*`, `/api/v1/admin/*`, `/api/v1/exemplos/*` → Backend; `/api/v1/ia/*` → AI
- Padroniza respostas de erro vindas do downstream

Tecnologias adotadas: Node.js 24, TypeScript, Express 5, Axios (cliente HTTP downstream), Pino (logs), Helmet, CORS, jsonwebtoken (validação local de access token), Zod (validação de variáveis de ambiente).

---

### Backend (Node JS)

Responsável pelas regras de negócio e processamento da aplicação.

- Gerencia autenticação e autorização  
- Controla o fluxo de criação, validação e resolução de questões  
- Em produção fica em rede privada e aceita apenas requisições com `X-Internal-Token` válido vindas do BFF

---

### AI Service (reservado)

Serviço reservado para os módulos de inteligência artificial (geração de questões, geração de imagens anatômicas, chatbot educacional). Permanece **vazio** nesta release; será iniciado em semestres futuros. Quando habilitado, ficará em rede privada como o Backend.

---

### Banco de Dados (PostgreSQL)

- Armazena dados de usuários  
- Armazena questões e seus estados
- Registra respostas e desempenho dos estudantes  

---

## Referências

> React. Disponível em: <https://react.dev>. Acesso em: 13 abr. 2026.

> Vite Docs. Disponível em: <https://vite.dev/guide/>. Acesso em: 13 abr. 2026.

> O que é Tailwind CSS. Disponível em: <https://tailwindcss.com.br/guia-tailwind/o-que-e-tailwind-css>. Acesso em: 13 abr. 2026. 

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criação do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) | 
| 13/04/2026 | 1.1 | Adicionando tecnologias a serem utilizadas no frontend | [João Vitor](https://github.com/Joa0V) | 
| 26/04/2026 | 1.2 | Reorganização da seção de arquitetura, mantendo em tecnologias apenas o conteúdo relacionado à stack utilizada | [Ana Catarina](https://github.com/an4catarina) |
| 05/05/2026 | 1.3 | Inclusão do BFF e do AI Service na descrição da stack (PRD: Migração para Arquitetura com BFF) | [Miguel Moreira](https://github.com/miguelmsoliveira) |
