# Especificação - Document Management System

## 1. Objetivo

Fornecer um sistema web simples para upload, listagem e download de
documentos, com armazenamento estritamente local e gestão básica por
usuário.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação/login de usuários
- Controle de permissão de acesso por owner

## 3. Requisitos funcionais

| ID    | Requisito                                                          |
| ----- | ------------------------------------------------------------------ |
| RF-01 | O usuário pode enviar um documento                                  |
| RF-02 | O usuário pode listar os documentos enviados                       |
| RF-03 | O usuário pode baixar um documento pelo identificador               |
| RF-04 | O sistema associa cada documento enviado a um owner com valor fixo/padrão (sem autenticação) |
| RF-05 | A listagem e o download não são restritos por owner nesta fase     |

## 4. Requisitos não funcionais

| ID     | Requisito                                                               |
| ------ | ------------------------------------------------------------------------ |
| RNF-01 | Arquivos gravados no filesystem local via multer `diskStorage`          |
| RNF-02 | Metadados mantidos em memória nesta fase                                |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)                      |
| RNF-04 | O identificador do owner é um valor fixo/padrão, configurável via variável de ambiente, sem mecanismo de autenticação |
| RNF-05 | Sem limite de tamanho ou tipo de arquivo nesta fase                     |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                                        |
| ------------ | ------ | ------------------------------------------------------------------ |
| id           | string | Identificador único do documento, gerado via `crypto.randomUUID()` |
| originalName | string | Nome original do arquivo enviado                                  |
| size         | number | Tamanho em bytes                                                  |
| uploadedAt   | string | Data/hora do upload (ISO 8601)                                    |
| owner        | string | Identificador do usuário dono; valor fixo/padrão quando não informado |

## 6. Contratos de API

### POST /upload

- Entrada: arquivo via `multipart/form-data`, campo `file`
- Sucesso: `201 Created` com os metadados do documento criado (JSON)
- Erro: `400 Bad Request` quando nenhum arquivo é enviado

### GET /documents

- Saída: `200 OK` com array de metadados de todos os documentos, sem
  filtragem por owner

### GET /documents/:id/download

- Saída: `200 OK` com o conteúdo binário do arquivo e cabeçalho
  `Content-Disposition` contendo o nome original
- Erro: `404 Not Found` quando o identificador não existe

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples: `routes -> controllers -> services
  -> repositories`, onde camadas internas não conhecem camadas externas
- Armazenamento local via multer `diskStorage`, gravando os arquivos em
  `backend/storage`
- Metadados mantidos em memória nesta fase inicial
- Owner com valor fixo/padrão, sem autenticação, configurável via variável
  de ambiente
- Frontend baseado em componentes (React), consumindo o backend via
  `fetch` através do prefixo `/api` (proxy configurado no Vite)

## 8. Plano de execução

1. Implementar repository de documentos com armazenamento em memória
2. Implementar service com as regras de negócio (geração de metadados,
   validações)
3. Configurar o multer `diskStorage` apontando para `backend/storage`
4. Implementar os controllers para os três endpoints
5. Implementar as routes e plugá-las em `app.js`
6. Escrever testes automatizados (`node:test`) para os endpoints
7. Implementar o serviço frontend (`services/`) consumindo `/api`
8. Implementar os componentes `UploadComponent`, `DocumentList` e
   `DownloadButton`
9. Integrar os componentes em `App.jsx`/`pages`
10. Realizar verificação manual end-to-end (upload, listagem, download)
