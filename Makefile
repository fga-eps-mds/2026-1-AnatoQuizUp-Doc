# AnatoQuizUp Doc — Makefile
#
# Uso: rode `make help` para ver todos os comandos.
# Pre-requisitos: Python 3.10+ e pip instalados.
# No Windows, instale o GNU Make antes:
#   choco install make    (Chocolatey)
#   scoop install make    (Scoop)

SHELL := /bin/sh
.DEFAULT_GOAL := help

VENV_DIR ?= .venv

# Detecta executaveis dentro da venv (Windows usa Scripts/, Unix usa bin/)
ifeq ($(OS),Windows_NT)
	PY_BIN := $(VENV_DIR)/Scripts/python.exe
	MKDOCS := $(VENV_DIR)/Scripts/mkdocs.exe
	PIP := $(VENV_DIR)/Scripts/pip.exe
else
	PY_BIN := $(VENV_DIR)/bin/python
	MKDOCS := $(VENV_DIR)/bin/mkdocs
	PIP := $(VENV_DIR)/bin/pip
endif

# ============================================================================
#  Ajuda
# ============================================================================

.PHONY: help
help: ## Lista todos os comandos disponiveis
	@echo ""
	@echo "AnatoQuizUp Doc - comandos disponiveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ============================================================================
#  Setup
# ============================================================================

.PHONY: setup
setup: ## Cria venv e instala dependencias do MkDocs
	python -m venv $(VENV_DIR)
	$(PIP) install -r requirements.txt
	@echo ""
	@echo "[setup] Venv criada em $(VENV_DIR)/."
	@echo "[setup] Para ativar manualmente:"
	@echo "    Windows PowerShell: .\\$(VENV_DIR)\\Scripts\\Activate.ps1"
	@echo "    Linux/Mac:          source $(VENV_DIR)/bin/activate"

.PHONY: install
install: ## Reinstala dependencias na venv existente
	$(PIP) install -r requirements.txt

# ============================================================================
#  Desenvolvimento
# ============================================================================

.PHONY: serve
serve: ## Sobe o MkDocs em http://127.0.0.1:8000
	$(MKDOCS) serve

.PHONY: build
build: ## Gera o site estatico em site/ com --strict
	$(MKDOCS) build --strict

.PHONY: deploy
deploy: ## Faz deploy via gh-deploy (cuidado: empurra para gh-pages)
	$(MKDOCS) gh-deploy

# ============================================================================
#  Limpeza
# ============================================================================

.PHONY: clean
clean: ## Remove site/ e venv
	rm -rf site $(VENV_DIR)
	@echo "[clean] site/ e $(VENV_DIR)/ removidos."
