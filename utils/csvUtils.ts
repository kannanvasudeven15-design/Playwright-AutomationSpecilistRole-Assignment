export type CustomerSet = {
  'First Name': string;
  'Last Name': string;
  'Post Code': string;
  scenario: string;
};

export function readCsvSets(filePath: string): CustomerSet[] {
  const fs = require('fs');
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines = data.trim().split('\n');
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
