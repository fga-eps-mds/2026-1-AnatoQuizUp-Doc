# Decisões R1

## Decisão 1 — Estratégia de autenticação e cadastro de professores

### Evidência
- Necessidade de cadastro e login de professores no backlog da R1
- Incerteza técnica sobre validação automática de professor
- Alternativa considerada: autenticação institucional (ex: Microsoft)
- Risco de implementar solução incompleta ou incorreta no prazo

### Análise
- Autenticação automatizada exigiria integração externa e regras de validação
- Riscos: atraso, falha de segurança, retrabalho
- Funcionalidade não era crítica para o MVP inicial

### Decisão
- Postergar autenticação automatizada
- Adotar cadastro manual de professores com aprovação de administrador
- Validar abordagem com clientes antes da implementação

### Resultado esperado
- Controle de acesso adequado para perfil de professor
- Menor risco de segurança e retrabalho
- Avanço do projeto sem bloquear outras entregas
- Flexibilidade para evoluir para SSO nas próximas releases

## Decisão 2 — Organização modular do backend por domínio

### Evidência
- Backend precisava suportar autenticação, cadastro/login, aprovação de professores e administração
- Produto deve crescer com domínios como gamificação, questões, quizzes, rankings, turmas e desempenho
- Organização por tipo de arquivo levaria a pastas com muitos arquivos misturados

### Análise
- Estrutura só por camadas dificulta manutenção em sistemas maiores
- Alterações em um domínio exigiriam buscas em várias pastas
- Modelo por domínio facilita compreensão e manutenção conforme o produto cresce

### Decisão
- Organizar backend por domínio em `src/modules/`
- Cada domínio com sua própria pasta e arquivos relacionados
- Manter fluxo interno organizado por camadas dentro de cada módulo

### Resultado esperado
- Backend mais organizado
- Novos membros encontram arquivos mais facilmente
- Múltiplas pessoas trabalham em módulos diferentes com menos conflitos
- Evita pastas gigantes e facilita testes por módulo
- Prepara o projeto para crescer nas próximas releases

## Decisão 3 — Uso temporário de mocks no frontend

### Evidência
- Na R1, o frontend precisava avançar no fluxo de login e telas autenticadas, mas o backend de autenticação ainda estava em desenvolvimento

### Análise
- Se o frontend dependesse totalmente do backend pronto, parte do time ficaria bloqueada
- Deixar mocks fixos no código poderia causar problemas em produção

### Decisão
- Manter mocks de login controlados por uma variável de ambiente:
    - `VITE_USAR_MOCKS=true`
    - quando estiver true, o frontend usa dados simulados
    - quando estiver false, chama a API real

### Resultado esperado
- Permitir desenvolvimento paralelo entre frontend e backend
- Reduzir bloqueios
- Evitar que mocks sejam usados indevidamente em produção
