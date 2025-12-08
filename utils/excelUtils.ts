
import * as XLSX from 'xlsx';
import fs from 'fs';

export type DepositTestData = {
  name: string;
  accountNumber: string;
  depositAmount: number;
};

export function readExcel(filePath: string): DepositTestData[] {
  // Read file as buffer for compatibility with Node/browser
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet) as DepositTestData[];
}
