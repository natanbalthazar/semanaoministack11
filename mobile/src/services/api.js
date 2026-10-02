import axios from 'axios';

/**
 * Cliente HTTP compartilhado por todas as telas (toda chamada parte desta baseURL).
 *
 * A URL vem da variável EXPO_PUBLIC_API_URL (arquivo `mobile/.env`, veja `.env.example`).
 * - O Expo só injeta no app variáveis com prefixo `EXPO_PUBLIC_`, e faz isso na hora
 *   do bundle: se mudar o `.env`, reinicie o `expo start` (com `--clear` se não pegar).
 * - Não coloque segredos (tokens, senhas) em `EXPO_PUBLIC_`: elas ficam legíveis no bundle.
 *
 * Qual endereço usar? Lembre que "localhost" é sempre o aparelho que roda o app:
 * - Celular físico (Expo Go): IP do computador na rede, ex.: http://192.168.0.10:3333
 *   (mesmo Wi-Fi). Se usar localhost aqui → o celular procura a API nele mesmo e falha.
 * - Emulador Android: http://10.0.2.2:3333 (apelido do emulador para o computador).
 * - Simulador iOS e web: http://localhost:3333 funciona.
 */
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333',
  // Sem timeout, uma API inacessível (IP errado, outra rede) deixa a tela esperando por minutos.
  timeout: 10000,
});

export default api;
