import * as ExcelJS from 'exceljs';
import { format,  addHours } from 'date-fns';
import formatString from './formatString';

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

interface Apresentacao {
  modelo: string,
  componente: string | null,
}

const getExcelData = (worksheet: ExcelJS.Worksheet, i: number): ExcelData => {
  const companyName: string = formatString(String(worksheet.getRow(i).getCell(1).value));
  const product: string = formatString(String(worksheet.getRow(i).getCell(2).value));
  const presentation: Apresentacao = {
    componente: formatString(String(worksheet.getRow(i).getCell(3).value)),
    modelo: formatString(String(worksheet.getRow(i).getCell(4).value))
  };
  const techinicalName: string = formatString(String(worksheet.getRow(i).getCell(5).value));
  const register: string = formatString(String(worksheet.getRow(i).getCell(6).value));
  const manufacturer: string = formatString(String(worksheet.getRow(i).getCell(8).value));
  const riskClass: string = formatString(String(worksheet.getRow(i).getCell(9).value));
  
  let registerValidityDate: string;

  if(String(worksheet.getRow(i).getCell(10).value) === 'VIGENTE'){
    registerValidityDate = String(worksheet.getRow(i).getCell(10).value);
  }else{
    if(typeof worksheet.getRow(i).getCell(10).value !== 'string'){
      const formattedDate = addHours(worksheet.getRow(i).getCell(10).value as Date, 3)
      registerValidityDate = format(formattedDate, "dd'/'MM'/'yyyy");
    }else{
      registerValidityDate = String(worksheet.getRow(i).getCell(10).value);
    }
  }

  const excelData: ExcelData = {
    product,
    companyName,
    presentation,
    register,
    techinicalName,
    manufacturer,
    riskClass,
    registerValidityDate
  }
  return excelData;  
}

export default getExcelData;