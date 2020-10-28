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

export const createTxtFileOnlyForTechinicalNameAndRisk = async (i: number, anvisaData: AnvisaDataResponse, excelData: ExcelData, erroredRows: Array<{row: number,  item: string, }>) => {
  if(anvisaData.nomeTecnico !==  excelData.techinicalName) {
    erroredRows.push({row: i, item: 'nome técnico'});
  }

  if(anvisaData.risco !== excelData.riskClass) {
    erroredRows.push({row: i, item: 'classe de risco'})
  }
}
