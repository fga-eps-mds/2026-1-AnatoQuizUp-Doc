Import-Csv -Path .\doc.csv | ForEach-Object {
    $title = $_.title
    $tipo = $_.tipo
    
    $body = @"
## Descrição

**Como** $($_.como)  
**Quero** $($_.quero)  
**Para** $($_.para)  

> **Resumo:** $($_.descricao_curta)

## Informações

| Campo | Valor |
| :--- | :--- |
| **Epic** | $($_.epic) |
| **Estimativa** | $($_.estimativa) pontos |
| **Repo** | $($_.repo) |

## Critérios de Aceitação

$($_.criterios_aceitacao)

## Valor de Negócio

$($_.valor_negocio)

## Tarefas Técnicas

**$($_.repo)**
$($_.tarefas_tecnicas)

## Testes

$($_.testes)

## Roteiro de teste

- [ ] Fazer a documentação dos casos de teste
"@

    Write-Host "Criando: $title"
    gh issue create -R "fga-eps-mds/2026-1-AnatoQuizUp-API" -t $title -b $body -l $tipo
}