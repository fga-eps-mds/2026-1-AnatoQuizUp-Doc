# AnatoQuizUp Doc

Repositório de documentação do projeto **AnatoQuizUp**, mantido com [MkDocs](https://www.mkdocs.org/) e tema [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

A documentação reúne informações de produto, planejamento, arquitetura, contratos da API, qualidade, gestão do projeto e contribuição.

## Repositórios do projeto

| Repositório | Função |
|---|---|
| [`2026-1-AnatoQuizUp-Web`](https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Web) | Frontend React + Vite |
| [`2026-1-AnatoQuizUp-BFF`](https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-BFF) | Backend-For-Frontend (porta de entrada pública) |
| [`2026-1-AnatoQuizUp-Backend`](https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-Backend) | Regras de negócio + Prisma + PostgreSQL |
| [`2026-1-AnatoQuizUp-AI`](https://github.com/fga-eps-mds/2026-1-AnatoQuizUp-AI) | Serviço de IA (placeholder reservado para semestres futuros) |
| `2026-1-AnatoQuizUp-Doc` (este) | Documentação MkDocs |

## Pré-requisitos

- Python 3.10 ou superior.
- `pip` disponível no terminal.
- Git instalado.

## Rodando localmente

Entre na pasta do repositório:

```bash
cd /caminho/para/2026-1-AnatoQuizUp-Doc
```

Crie o ambiente virtual:

```bash
python -m venv .venv
```

No Linux ou macOS, caso o comando `python` não esteja disponível, use:

```bash
python3 -m venv .venv
```

Ative o ambiente virtual.

No Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Se o PowerShell bloquear a ativação, libere apenas para a sessão atual:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

No Linux ou macOS:

```bash
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Suba o servidor local:

```bash
mkdocs serve
```

Acesse no navegador:

```text
http://127.0.0.1:8000
```

## Validando a documentação

Antes de abrir um pull request, rode:

```bash
mkdocs build --strict
```

Esse comando gera o site estático e falha caso existam problemas relevantes de configuração, navegação ou links internos.

## Atalhos com Make

Se você tem o `make` instalado, os comandos acima ficam:

```bash
make help     # lista comandos
make setup    # cria venv e instala dependencias
make serve    # mkdocs serve em http://127.0.0.1:8000
make build    # mkdocs build --strict
make deploy   # mkdocs gh-deploy (cuidado: publica no GitHub Pages)
```