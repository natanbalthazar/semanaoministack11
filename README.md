<h1 align="center">
  <img alt="bethehero" title="bethehero" src="https://github.com/natanbalthazar/semanaoministack11/assets/62712246/9675c5e0-485e-4161-a3d1-a22b065279e2" />
</h1>

<h3 align="center">
  Be the Hero  :love_letter:
</h3>

<p align="center">
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#man_technologist-iniciando-o-projeto">Iniciando o Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#package-iniciando-o-servidor-backend">Backend</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#gear-testes">Testes</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-iniciando-o-frontend">Frontend</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#iphone-mobile">Mobile</a>
</p>

## :zap: Sobre o desafio

Será construído uma aplicação para unir ONG's com pessoas com desejo de contribuir com algum valor para ajudar causas. Dessa forma, através de um canal fácil e rápido de contato, o **Be the Hero** é uma forma de unir pessoas para o bem, e será o produto final dessa Semana Omnistack 11.


# :rocket: Tecnologias

| App | Stack | Detalhes |
|---|---|---|
| [`backend/`](backend) | Node.js, Express 5, TypeScript, Drizzle ORM + SQLite, Zod, Swagger | [README do backend](backend/README.md) |
| [`frontend/`](frontend) | Next.js 16, React 19, Tailwind 4, React Query, React Hook Form + Zod | [README do frontend](frontend/README.md) |
| [`mobile/`](mobile) | Expo SDK 57, React Native 0.86, React Navigation, Axios | [README do mobile](mobile/README.md) |

# :man_technologist: Iniciando o Projeto

**Requisitos:** [Node.js](https://nodejs.org/) 24 (o frontend exige `^22.22.2 || ^24.15`; o backend, 22.12+) e [pnpm](https://pnpm.io) 10.

    git clone https://github.com/natanbalthazar/semanaoministack11.git

    cd semanaoministack11

Cada app é independente, com seu próprio `package.json` e `pnpm-lock.yaml`. Rode os comandos dentro da pasta de cada um. O frontend e o mobile precisam do backend rodando.

# :package: Iniciando o Servidor Backend

    cd backend

    pnpm install

    pnpm db:migrate   # cria o banco SQLite com as tabelas (o banco não vem no repositório)

    pnpm dev          # http://localhost:3333 · documentação: http://localhost:3333/api-docs

# :gear: Testes

    cd backend && pnpm test      # unitários e integração (Vitest + Supertest)

    cd frontend && pnpm test     # unitários (Vitest + Testing Library)

    cd frontend && pnpm test:e2e # ponta a ponta (Playwright, com a API simulada)

Os testes rodam automaticamente no GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) a cada PR, junto com build, lint, `expo-doctor` e `pnpm audit`.

# :computer: Iniciando o Frontend

    cd frontend

    pnpm install

    cp .env.local.example .env.local   # URL da API (padrão: http://localhost:3333)

    pnpm dev                           # http://localhost:3000

# :iphone: Mobile

    cd mobile

    pnpm install

    cp .env.example .env   # coloque o IP da sua máquina na rede, ex.: http://192.168.0.10:3333

    pnpm start             # abre o Expo; leia o QR code com o Expo Go ou use "a" (Android) / "i" (iOS)

No celular, `localhost` é o próprio celular, por isso a API precisa do IP do computador. Veja o [README do mobile](mobile/README.md) para emulador, web e compatibilidade com o Expo Go.

----

Feito com :heart: por **Natan Balthazar** :call_me_hand: [LinkedIn](https://www.linkedin.com/in/natanbalthazar/)
