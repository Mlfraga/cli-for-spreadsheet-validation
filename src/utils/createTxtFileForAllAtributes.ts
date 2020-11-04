interface ExcelData {
  product: string;
  companyName: string;
  techinicalName: string;
  presentation: Apresentacao;
  register: string;
  manufacturer: string;
  riskClass: string;
  registerValidityDate: string;
}

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

export const createTxtFileForAllAtributes = async (i: number, anvisaData: AnvisaDataResponse, excelData: ExcelData, erroredRows: Array<{row: number,  item: string, }>) => {

  if(anvisaData.empresa !== excelData.companyName) {
    erroredRows.push({row: i, item: 'nome da empresa'});
  }
  
  if(anvisaData.fabricante !== excelData.manufacturer) {
    erroredRows.push({row: i, item: 'fabricante'});
  }
  
  if(`${anvisaData.risco}${anvisaData.nomeTecnico}` !==  excelData.techinicalName) {
    erroredRows.push({row: i, item: 'nome técnico'});
  }
  
  if(anvisaData.produto !== excelData.product) {
    erroredRows.push({row: i, item: 'produto'});
  }
  
  if(anvisaData.registro !== excelData.register) {
    erroredRows.push({row: i, item: 'registro'})
  }
  
  if(anvisaData.risco !== excelData.riskClass) {
    erroredRows.push({row: i, item: 'classe de risco'})
  }

  if(anvisaData.validadeDoRegistro !== excelData.registerValidityDate) {
    erroredRows.push({row: i, item: 'validade do registro'})
  }

  const result = anvisaData.apresentacoes.map(apresentacao => {
    let flag = 0;
    
    if(!apresentacao.componente && excelData.presentation.modelo === apresentacao.modelo){
      flag = 1;  
    }
    
    if(apresentacao.componente === excelData.presentation.componente && apresentacao.modelo === excelData.presentation.modelo){
      flag = 1;  
    }

    if(apresentacao.modelo === `${excelData.presentation.componente}${excelData.presentation.modelo}`){
      flag = 1
    }

    return flag;
  });

  if(!result.includes(1)) {
    erroredRows.push({row: i, item: 'apresentação ou modelo'});
  }
}
