import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.142:3333' // Parte da URL que vai ser mantida em todas as chamadas.
})

export default api;