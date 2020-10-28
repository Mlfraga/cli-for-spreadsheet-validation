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

export const createTxtFileOnlyForPresentations = async (i: number, anvisaData: AnvisaDataResponse, excelData: ExcelData, erroredRows: Array<{row: number,  item: string, }>) => {
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
