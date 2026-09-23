---
description: Implementa uma tarefa (feature, bug, teste ou PR) usando o time de desenvolvimento Nova/Sage/Milo.
name: ai-team-dev
argument-hint: descrição da tarefa (ex. implementar RF-04 no backend)
agent: ai-team-dev
---

# Time de desenvolvimento (Nova, Sage, Milo)

Implemente a tarefa `${input:tarefa:descrição da tarefa}` seguindo a stack e as
convenções deste projeto (Node.js + Express no backend, React + Vite no
frontend, Clean Architecture simples).

Requisitos:

- Leia `.github/copilot-instructions.md` e o código relevante antes de implementar.
- Siga a arquitetura já existente (`routes -> controllers -> services -> repositories` no backend, componentes funcionais com hooks no frontend).
- Implemente de forma incremental, com a menor mudança completa que resolva a tarefa.
- Rode os testes e verificações relevantes do projeto após a mudança.
- Faça uma autorrevisão do diff final antes de finalizar.
