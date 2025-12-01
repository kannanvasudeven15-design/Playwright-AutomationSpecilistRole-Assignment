
import * as fs from 'fs';
import * as path from 'path';

export type CustomerSet = {
  'First Name': string;
  'Last Name': string;
  'Post Code': string;
  scenario: string;
};

export function readCsvSets(filePath: string): CustomerSet[] {
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines: string[] = data.trim().split('\n');
  const sets: CustomerSet[] = [];
  for (let i = 1; i < lines.length; i += 3) {
    const set: any = {};
    for (let j = 0; j < 3; j++) {
      const [key, value, scenario] = lines[i + j].split(',');
      set[key] = value;
      set['scenario'] = scenario;
    }
    sets.push(set as CustomerSet);
  }
  return sets;
}

export function getTestData(): { [key: string]: string }[] {
  const filePath = path.resolve(__dirname, '../test-data/createAccount_TestData.csv');
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines: string[] = data.trim().split('\n');
  const headers: string[] = lines[0].split(',');
  return lines.slice(1).map((line: string) => {
    const values: string[] = line.split(',');
    return headers.reduce((obj: { [key: string]: string }, key: string, idx: number) => {
      obj[key] = values[idx];
      return obj;
    }, {} as { [key: string]: string });
  });
}
