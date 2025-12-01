import fs from 'fs';
import path from 'path';

export type ConfigUrls = {
  login: string;
  manager: string;
  addCustomer: string;
  openAccount: string;
  customers: string;
};

export function getConfigUrls(): ConfigUrls {
  const configPath = path.resolve(__dirname, '../config.json');
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);
  return config.urls as ConfigUrls;
}
