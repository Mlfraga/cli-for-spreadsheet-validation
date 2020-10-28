import { GluegunCommand } from 'gluegun'
import { AxiosResponse } from 'axios';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import * as ora from 'ora';

import getProductData from '../utils/getProductData';
import getAnvisaData from '../utils/getAnvisaData';
import getExcelData from '../utils/getExcelData';
import createCorrectedDataSheet from '../utils/createCorrectedDataSheet';
import { createTxtFileForAllAtributes } from './../utils/createTxtFileForAllAtributes';
import { createTxtFileOnlyForPresentations } from './../utils/createTxtFileOnlyForPresentations';
import { createTxtFileOnlyForTechinicalNameAndRisk } from './../utils/createTxtFileOnlyForTechinicalNameAndRisk';

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

const ALL_DATA_TEXT_FILE_PLUS = 'Gerar arquivo de texto com todos os dados divergentes e planilha com os dados de acordo com o sistema da Anvisa';
    
const ALL_DATA_TEXT_FILE = 'Gerar apenas arquivo de texto com todos os dados divergentes';

const CORRECTED_DATASHEET = 'Gerar apenas a planilha com os dados de acordo com o sistema da Anvisa';

const CREATE_TEXT_FILE_ONY_FOR_PRESENTATIONS = 'Gerar arquivo de texto com apenas apresentações/modelos divergentes';

const CREATE_TEXT_FILE_ONLY_FOR_TECHNICAL_NAME_PLUS = 'Gerar arquivo de texto com apenas nome técnico e classe de risco divergentes e planilha com os dados de acordo com o sistema da Anvisa';

const command: GluegunCommand = {
  name: 'cli-spreadsheet-validate',
  run: async toolbox => {
    const { print } = toolbox;
    


    const validationTypeQuestion = {
      type: 'select',
      name: 'typeOfValidation',
      message: 'Qual validação deseja fazer?',
      choices: [
      ALL_DATA_TEXT_FILE_PLUS,
      ALL_DATA_TEXT_FILE,
      CORRECTED_DATASHEET,
      CREATE_TEXT_FILE_ONY_FOR_PRESENTATIONS,
      CREATE_TEXT_FILE_ONLY_FOR_TECHNICAL_NAME_PLUS
      ]
    };

    const fileNameQuestion = {
      type: 'input',
      name: 'fileName',
      message: 'Após copiar o arquivo de planilha para a pasta do sistema, digite o nome e a extensão desse arquivo de planilha ex: nome-planilha.xlsx.'
    };    

    const validationType = await toolbox.prompt.ask(validationTypeQuestion);
    
    print.info('Lembre-se de colocar a planilha no padrão do sistema. Verifique o arquivo de intruções.');
    
    const fileName = await toolbox.prompt.ask(fileNameQuestion);

    const file = path.resolve(__dirname, '.', `${fileName.fileName}`);

    const workbook = new ExcelJS.Workbook();

    try{  
      await workbook.xlsx.readFile(file);
    }catch(err){
      print.error('Ocorreu algum erro com o arqivo, verifique se ele esta na pasta do sistema ou se sua extensão é .xlsx');
    
      return;
    }

    var worksheet = workbook.getWorksheet('GENERAL PRODUCTS LIST');
    
    if(!worksheet){
      print.error("Por favor nomeie a planilha que deseja validar para 'GENERAL PRODUCTS LIST' ");

      return;
    }

    if(validationType.typeOfValidation === ALL_DATA_TEXT_FILE_PLUS || validationType.typeOfValidation === CORRECTED_DATASHEET || validationType.typeOfValidation === CREATE_TEXT_FILE_ONLY_FOR_TECHNICAL_NAME_PLUS){
      try{  
        var correctedDataSheet = workbook.addWorksheet('Dados corrigidos');
      }catch(err){
        print.error("Por favor apague a planilha Dados corrigidos do arquivo e tente novamente.");
        
        return;
      }
    }
    
    const erroredRows: Array<{row: number,  item: string}> = [] as Array<{row: number,  item: string}>;

    const spinner = ora('Validando dados da planilha').start();

    try{
      for(let i = 3; i <= worksheet.rowCount; i++){
        
        spinner.text = `Validando dados ${i} de ${worksheet.rowCount} da planilha`;

        const processCell = worksheet.getRow(i).getCell(7);
        
        const process = processCell.value?.toString().replace(`'`, '');

        const response: AxiosResponse  = await getProductData(process);
        
        const anvisaData: AnvisaDataResponse = getAnvisaData(response, true);

        const anvisaDataNoFormat: AnvisaDataResponse = getAnvisaData(response, false);
            
        const excelData: ExcelData = getExcelData(worksheet, i);

        if(validationType.typeOfValidation === ALL_DATA_TEXT_FILE_PLUS){
          createTxtFileForAllAtributes(i, anvisaData, excelData, erroredRows);
          createCorrectedDataSheet(anvisaDataNoFormat, correctedDataSheet, i, workbook, file, processCell);
        }

        if(validationType.typeOfValidation === ALL_DATA_TEXT_FILE){
          createTxtFileForAllAtributes(i, anvisaData, excelData, erroredRows);
        }

        if(validationType.typeOfValidation === CORRECTED_DATASHEET){
          createCorrectedDataSheet(anvisaDataNoFormat, correctedDataSheet, i, workbook, file, processCell);
        }
        
        if(validationType.typeOfValidation === CREATE_TEXT_FILE_ONY_FOR_PRESENTATIONS){
          createTxtFileOnlyForPresentations(i, anvisaData, excelData, erroredRows);
        }
        
        if(validationType.typeOfValidation === CREATE_TEXT_FILE_ONLY_FOR_TECHNICAL_NAME_PLUS){
          createTxtFileOnlyForTechinicalNameAndRisk(i, anvisaData, excelData, erroredRows);
        }
      }
    }catch(err) {
      print.error(`Ocorreu um erro ao ler a planilha, verifique se ela esta dentro dos padrões e tente novamente. ${err}`);

      return;
    }
    
    spinner.stop();
    spinner.succeed('Validação concluída.')

    if(validationType.typeOfValidation === 'Gerar arquivo de texto com erros e planilha com dados corrigidos' || validationType.typeOfValidation === 'Gerar apenas arquivo de texto com dados errados'){
      const erroredRowsFormatted = erroredRows.map(row => {
        return `Linha ${row.row} com erro na coluna de ${row.item}`;
      }); 

      fs.writeFile('conference.txt', JSON.stringify(erroredRowsFormatted, null, 4), function(err){
        if (err) return console.log(err);
        print.success('Arquivo criado com sucesso conference.txt');
      });
    }  
  }
}

module.exports = command
