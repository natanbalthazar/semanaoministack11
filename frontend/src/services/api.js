import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333' // Parte da URL que vai ser mantida em todas as chamadas.
})

export default api;