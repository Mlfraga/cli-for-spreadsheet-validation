import * as ExcelJS from 'exceljs';

interface AnvisaDataResponse {
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

const CreateCorrectedDataSheet = (anvisaData: AnvisaDataResponse, correctedDataSheet: ExcelJS.Worksheet, i: number, workbook: ExcelJS.Workbook, file: string, processCell: ExcelJS.Cell): void => {
 
  const correctedCompanyNameCell = correctedDataSheet.getRow(i).getCell(1);
  const correctedProductCell = correctedDataSheet.getRow(i).getCell(2);
  const correctedTechinicalNameCell = correctedDataSheet.getRow(i).getCell(5);
  const correctedRegisterCell = correctedDataSheet.getRow(i).getCell(6);
  const correctedProcessCell = correctedDataSheet.getRow(i).getCell(7);
  const correctedManufacturerCell = correctedDataSheet.getRow(i).getCell(8);
  const correctedRiskClassCell = correctedDataSheet.getRow(i).getCell(9);
  const correctedValidityCell = correctedDataSheet.getRow(i).getCell(10);

  correctedCompanyNameCell.value = anvisaData.empresa;
  correctedProductCell.value = anvisaData.produto;
  correctedTechinicalNameCell.value = anvisaData.nomeTecnico;
  correctedRegisterCell.value = anvisaData.registro;
  correctedProcessCell.value = processCell.value;
  correctedManufacturerCell.value = anvisaData.fabricante;
  correctedRiskClassCell.value = anvisaData.risco;
  correctedValidityCell.value = anvisaData.validadeDoRegistro;
    
  correctedDataSheet.getRow(i).commit();
  workbook.xlsx.writeFile(file);
}

export default CreateCorrectedDataSheet;