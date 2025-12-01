import * as XLSX from 'xlsx';

export type Customer = {
  firstName: string;
  lastName: string;
  postCode: string;
};

export function readExcel(filePath: string): Customer[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet) as Customer[];
}
