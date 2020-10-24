
import api from '../services/AnvisaApi';
  
const getProductData = async (processNumber: string | undefined) => {
  try{  
    const response = await api.get(`https://consultas.anvisa.gov.br/api/consulta/saude/${processNumber}`);
    return response;   
  }catch(err){
    throw new Error('Erro ao consultar sistema da anvisa.');
  }
}

export default getProductData;