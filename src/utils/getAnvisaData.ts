import { AxiosResponse } from "axios";
import { format, addHours } from 'date-fns';
import formatString from './formatString';

interface AnvisaDataResponse{
  produto: string,
  empresa: string,
  nomeTecnico: string,
  registro: string,
  apresentacoes: Array<Apresentacao>,
  fabricante: string,
  risco: string,
  validadeDoRegistro: string,
}

interface Apresentacao {
  modelo: string,
  componente: string | null,
}

const getAnvisaData = (response: AxiosResponse<any>, formating: boolean) => {
  let apresentacoes: Apresentacao[] = [];
  let fabricante: string = "";
  let validadeDoRegistro: string = "";

  let produto: string; 
  let nomeTecnico: string;
  let registro: string;
  let empresa: string;
  let risco: string;

  if(formating){
    produto = formatString(String(response.data.produto));
    nomeTecnico = formatString(String(response.data.nomeTecnico));
    registro = formatString(String(response.data.registro));
    empresa = formatString(response.data.empresa.razaoSocial);
    risco = formatString(response.data.risco.sigla);
   
    response.data.apresentacoes.forEach((element: Apresentacao) => {
      if(!element.componente){
        apresentacoes.push({componente: null, modelo: formatString(String(element.modelo))});
        return;
      }
      apresentacoes.push({componente: formatString(String(element.componente)), modelo: formatString(String(element.modelo))});
    });
    
    if(!response.data.fabricantes[0].razaoSocial){
      fabricante = formatString(String(response.data.fabricantes[0].local));
    }else{
      fabricante = formatString(String(response.data.fabricantes[0].razaoSocial));
    }
  }else{
     produto = String(response.data.produto);
     nomeTecnico = String(response.data.nomeTecnico);
     registro = String(response.data.registro);
     empresa = String(response.data.empresa.razaoSocial);
     risco = String(response.data.risco.sigla);

    response.data.apresentacoes.forEach((element: Apresentacao) => {
      if(!element.componente){
        apresentacoes.push({componente: null, modelo: (String(element.modelo))});
        return;
      }
      apresentacoes.push({componente: (String(element.componente)), modelo: (String(element.modelo))});
    });
    
    if(!response.data.fabricantes[0].razaoSocial){
      fabricante = (String(response.data.fabricantes[0].local));
    }else{
      fabricante = (String(response.data.fabricantes[0].razaoSocial));
    }
  }

  if(!response.data.vencimento.data){
    validadeDoRegistro = String(response.data.vencimento.descricao);
  }else{
    const hoursFormatted = addHours(new Date(response.data.vencimento.data), 3); 
    validadeDoRegistro = format(hoursFormatted, "dd'/'MM'/'yyyy");
  }
  
  const anvisaData: AnvisaDataResponse = {
    produto,
    nomeTecnico,
    registro,
    empresa,
    risco,
    apresentacoes,
    fabricante,
    validadeDoRegistro
  }

  return anvisaData;  
}

export default getAnvisaData;