# Tecnologias

## Estilo Arquitetural

### Frontend

#### As Camadas (Feature-Sliced Design)

A arquitetura é dividida em camadas, organizadas da mais externa (acoplada ao projeto) para a mais interna (genérica e reutilizável). A regra fundamental é que uma camada superior pode importar recursos de uma inferior, mas nunca o contrário.

* **`app/`**: Configurações globais, roteamento base, provedores de contexto e estilos globais da aplicação. É o ponto de inicialização do sistema.
* **`pages/`**: A composição final de uma tela. As páginas reúnem `widgets` e `features` e lidam com os parâmetros das rotas, mantendo-se o mais limpas possível de lógicas complexas.
* **`widgets/`**: Blocos independentes e complexos de interface que unem várias funcionalidades em um único componente estrutural (ex: um `Header` completo ou um `Sidebar`).
* **`features/`**: Funcionalidades modulares que entregam valor de negócio direto ao usuário (ex: a ação de fazer login, enviar um formulário). Contêm as interações do usuário e as chamadas à API REST correspondentes.
* **`entities/`**: O conceito central dos dados de negócio (ex: Usuário, Produto, Cliente). Contém as tipagens, as interfaces e o gerenciamento do estado global desses dados.
* **`shared/`**: Código puramente técnico e desconectado das regras de negócio. Inclui componentes visuais genéricos (botões, inputs formatados) e configurações base de infraestrutura (como o cliente HTTP para as chamadas REST).

---

#### Estrutura de Pastas

```

src/
├── app/
│   ├── styles/global.css      
│   └── App.tsx                
├── pages/
│   └── login/
│       └── ui/LoginPage.tsx   
├── widgets/
│   └── header/
│       └── ui/Header.tsx      
├── features/
│   └── auth-by-username/
│       ├── ui/LoginForm.tsx   
│       └── api/loginApi.ts    
├── entities/
│   └── user/
│       ├── model/userStore.ts 
│       └── types/user.ts      
└── shared/
    ├── ui/
    │   ├── Button.tsx         
    │   └── Input.tsx          
    └── api/
        └── httpClient.ts

```

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

**Vite**

Vite é uma ferramenta de desenvolvimento e build para frontends de aplicações web. Ele possui um sistema que permite um menor tempo de espera durante o desenvolvimento, suporte ao React, server-side rendering (SSR), code-splitting e carregamento assíncrono e pode ter suas capacidades expandidas via plugin-ins. Além disso ele não é opinativo quanto a estrutura de pastas, o que permite maior liberdade na estruturação do código para seguir os padrões escolhidos.

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

> Vite Docs. Disponível em: <https://vite.dev/guide/>. Acesso em: 13 abr. 2026.

> O que é Tailwind CSS. Disponível em: <https://tailwindcss.com.br/guia-tailwind/o-que-e-tailwind-css>. Acesso em: 13 abr. 2026. 

## Histórico de Versão

| Data   | Versão | Descrição | Autor(es) |
|--------|--------|-----------|-----------|
| 10/04/2026 | 1.0 | Criação do documento de arquitetura | [Caio Santos](https://github.com/caiobsantos) | 
| 13/04/2026 | 1.1 | Adicionando tecnologias a serem utilizadas no frontend | [João Vitor](https://github.com/Joa0V) | 
| 14/04/2026 | 1.2 | Adicionando estrutura de pastas | [Pedro Cabeceira](https://github.com/pkbceira03) | 