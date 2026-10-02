# Be The Hero — Mobile

App mobile da Semana Omnistack 11: lista os casos cadastrados pelas ONGs (com rolagem
infinita) e permite entrar em contato com a ONG por WhatsApp ou e-mail.

| Tecnologia | Versão |
| --- | --- |
| Expo SDK | 57 |
| React Native | 0.86 (Nova Arquitetura) |
| React | 19.2 |
| React Navigation | 7 (native-stack) |
| Gerenciador de pacotes | pnpm 10 |

## Pré-requisitos

- Node.js 22 e pnpm 10 (`corepack enable` ou `npm i -g pnpm`).
- O backend rodando (pasta `../backend`, porta 3333 por padrão).
- Para testar no aparelho/emulador, um **Expo Go compatível com o SDK 57** (veja abaixo).

## Configuração

```bash
cd mobile
pnpm install
cp .env.example .env   # e ajuste EXPO_PUBLIC_API_URL
```

O app lê a URL da API de `EXPO_PUBLIC_API_URL`. Como "localhost" é sempre o próprio
aparelho que roda o app, o endereço muda conforme onde você testa:

| Onde o app roda | `EXPO_PUBLIC_API_URL` |
| --- | --- |
| Celular físico (mesmo Wi-Fi do computador) | `http://<IP-do-computador>:3333` (macOS: `ipconfig getifaddr en0`) |
| Emulador Android | `http://10.0.2.2:3333` |
| Simulador iOS ou navegador (web) | `http://localhost:3333` |

Sem `.env`, o app usa `http://localhost:3333`. A variável é embutida no bundle quando o
Metro inicia: depois de mudar o `.env`, pare e rode `pnpm start` de novo
(use `pnpm start --clear` se o valor antigo continuar aparecendo).

## Rodando

```bash
pnpm start     # abre o Expo CLI; leia o QR code ou use os atalhos abaixo
pnpm android   # emulador/aparelho Android (instala o Expo Go certo se precisar)
pnpm ios       # simulador iOS (só no macOS, com Xcode)
pnpm web       # navegador
pnpm doctor    # verifica dependências e configuração (expo-doctor)
pnpm test      # testes das funções puras (node --test, sem dependências)
```

### Expo Go e o SDK 57

O Expo Go só abre projetos do mesmo SDK. Na data deste upgrade (outubro de 2026), as lojas
ainda distribuem o Expo Go do SDK 54, então:

- **Android (aparelho ou emulador):** rode `pnpm android` com o aparelho conectado (USB
  com depuração ativada) ou o emulador aberto; o Expo CLI instala o Expo Go do SDK 57.
  Também dá para baixar em <https://expo.dev/go>.
- **Simulador iOS:** `pnpm ios` instala o Expo Go do SDK 57 no simulador.
- **iPhone físico:** o Expo Go da App Store não abre o SDK 57. As opções são `eas go`
  (gera um Expo Go seu no TestFlight; exige conta Apple Developer) ou um
  [development build](https://docs.expo.dev/develop/development-builds/introduction/).

### Testes rápidos sem aparelho

`npx expo export --platform web` (ou `android`/`ios`) gera o bundle em `dist/` e já pega
erros de import e de Babel. Não substitui o teste no aparelho, porque WhatsApp, e-mail e
a barra de status só se comportam de verdade no celular.

`pnpm test` roda os arquivos `*.test.mjs` com o test runner nativo do Node (`node:test`).
Eles ficam fora do app: o Metro só empacota o que o app importa.

## Ícone

Os PNGs de `assets/` são gerados a partir dos SVGs ao lado (o desenho é o
`frontend/public/logo.svg`, com HERO em branco e BE THE em rosa sobre o vermelho `#E02041`):

| Arquivo | Uso | Detalhe |
| --- | --- | --- |
| `icon.png` (1024×1024) | iOS, web (favicon) e padrão | Fundo opaco, sem canal alfa (a Apple recusa transparência) |
| `adaptive-icon.png` (1024×1024) | Android (`android.adaptiveIcon`) | Fundo transparente; a cor vem de `backgroundColor`. O logo fica dentro do círculo seguro (66 de 108 dp), porque cada launcher recorta de um jeito |

Mudou um SVG? Gere os PNGs de novo (o `sharp-cli` roda via npx, não vira dependência):

```bash
cd mobile/assets
npx sharp-cli -i icon.svg -o icon.png removeAlpha
npx sharp-cli -i adaptive-icon.svg -o adaptive-icon.png
```

## Observações

- **pnpm:** funciona com o `node_modules` isolado padrão, sem `.npmrc`. Se o Metro algum
  dia não achar um pacote, o recomendado pela Expo é criar `mobile/.npmrc` com
  `node-linker=hoisted` e rodar `pnpm install` de novo.
- **Web e o total de casos:** o total vem do cabeçalho `X-Total-Count`. No navegador ele só
  fica visível se o backend liberar o cabeçalho no CORS
  (`cors({ exposedHeaders: ['X-Total-Count'] })`). Sem isso, o web mostra "0 casos", mas
  a lista carrega normalmente. No celular isso não acontece, porque lá não existe CORS.
- **WhatsApp:** o botão abre `https://wa.me/<número>?text=...`, que funciona com ou sem
  o app instalado (e no web). O backend salva só DDD + número, então
  `src/utils/whatsappNumber.js` coloca o código do Brasil: `11987654321` → `5511987654321`.
