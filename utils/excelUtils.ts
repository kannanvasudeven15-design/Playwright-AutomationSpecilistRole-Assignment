import * as XLSX from 'xlsx';

export type DepositTestData = {
  name: string;
  accountNumber: string;
  depositAmount: number;
};

export function readExcel(filePath: string): DepositTestData[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet) as DepositTestData[];
}
