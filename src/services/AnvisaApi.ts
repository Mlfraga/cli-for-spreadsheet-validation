import axios from 'axios';

const api = axios.create({
  baseURL: 'https://consultas.anvisa.gov.br/',
  headers: {'Authorization': 'Guest'} 
});

export default api;