import api from '../services/AnvisaApi';
  
  const getProccessNumber = async (registerNumber: string) => {
    const response = await api.get(`https://consultas.anvisa.gov.br/api/consulta/saude?count=10&filter%5BnumeroRegistro%5D=${registerNumber}`);
    return response.data.content[0].processo;   
  }

  export default getProccessNumber;