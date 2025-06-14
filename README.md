# Check-Gym App

Aplicação desenvolvida com fins de estudo e prática, inspirada em funcionalidades do Gympass. O projeto segue boas práticas de arquitetura e princípios de design, com foco em escalabilidade, testabilidade e organização do código.

## Arquitetura e Princípios Aplicados
### `Princípios SOLID`
Aplicação estruturada com base nos princípios `SOLID`, com destaque para:
`Inversão de Dependência` (Dependency Inversion Principle): os `use-cases` da aplicação não dependem de implementações concretas de repositórios, mas sim de interfaces (abstrações). Isso permite injetar diferentes implementações (como um `in-memory-repository` para testes ou `prisma-repository` para um banco de dados), mantendo a lógica de negócio desacoplada da infraestrutura. Essa abordagem facilita testes, manutenção e evolução do sistema.

### `Repository Pattern`
A lógica de acesso a dados é isolada em repositórios que implementam interfaces, como `GymsRepository` e `CheckInsRepository`. Isso permite alternar facilmente entre implementações — como repositórios baseados em `Prisma` para produção e repositórios `em memória` para testes — sem modificar os use cases. Essa separação garante baixo acoplamento e promove maior flexibilidade.

### `In-Memory Pattern`
Nos testes, a aplicação utiliza repositórios `em memória` que simulam o comportamento dos bancos de dados. Isso elimina a necessidade de dependências externas, resultando em testes mais rápidos, confiáveis e fáceis de configurar. 

### `Factory Pattern`
Foram criadas funções factory (`make-...`) para gerar entidades e dados de testes (como academias e usuários), o que facilita a montagem dos testes unitários. Essas funções promovem reutilização de código e padronizam a criação dos dados, tornando os testes mais limpos e consistentes.

### `TDD (Test-Driven Development)`
Grande parte da lógica de negócio foi construída utilizando `TDD`. Os testes são escritos antes da implementação, guiando o desenvolvimento das funcionalidades.

### `Clean Architecture`
Organização em camadas bem definidas, com separação clara de responsabilidades:
- `Use Cases`: contêm a lógica de negócio da aplicação.
- `Repositories`: abstraem a persistência dos dados.
- `Controllers` / `HTTP Handlers`: lidam com as requisições e respostas.


## Principais Tecnologias Utilizadas:

- Node.js.
- TypeScript.
- Fastify.
- Vitest.
- Prisma.
- Zod.

## Testes `Unitários` e `E2E`

Foram feitos 22 testes `unitários` e 30 testes `E2E`. Optei por fazer mais testes E2E para cobrir o máximo de cenários possíveis a fim de atingir os requisitos e as regras de negócio definidas.

## Como Rodar o Projeto

```bash
npm i
npm run services:up
npm run prisma:generate
npm run prisma:sql
npm run prisma:migrate
npm run dev
```

## RFs (Requisitos Funcionais)

- [x] Registrar um novo usuário.
- [x] Autenticar um usuário (login).
- [x] Obter o perfil de um usuário logado.
- [x] Obter o número de check-ins realizados pelo usuário logado.
- [x] Obter o histórico de check-ins pelo usuário logado.
- [x] Buscar academias próximas pelo usuário logado.
- [x] Buscar academias através do nome pelo usuário logado.
- [x] Realizar check-in em uma academia pelo usuário logado.
- [x] Validar o check-in de um usuário.
- [x] Cadastrar uma academia.

## RNs (Regras de Negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado.
- [x] O usuário não pode fazer 2 check-ins no mesmo dia.
- [x] O usuário não pode fazer check-in se não estive próximo (100m) da academia.
- [ ] A busca de academias próximas devem bucar academias em um raio de 10km.
- [x] O check-in só pode ser validado até 20 minutos após criado.
- [x] O check-in só pode ser validado por administradores.
- [x] A academia só pode ser cadastrada por administradores.

## RNFs (Requisitos Não-funcionais)

- [x] A senha do usuário precisa estar criptografada com hash.
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL.
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página.
- [x] O usuário deve ser identificado por um JWT (JSON Web Token).
