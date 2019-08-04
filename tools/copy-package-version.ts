import * as fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export function getPackage(path: string): Promise<{ version: string; [key: string]: any }> {
  return readFile(path, {
    encoding: 'utf-8'
  }).then(JSON.parse);
}

function writePackage(path: string, json: any): Promise<void> {
  return writeFile(path, `${JSON.stringify(json, null, 2)}\n`).then(() => json.version);
}

async function copyVersionNumber(): Promise<void> {
  const topLevelPath = join(__dirname, '../package.json');
  const { version } = await getPackage(topLevelPath);

  const srcPath = join(__dirname, '../src/package.json');
  const srcPackageJson = await getPackage(srcPath);

  return writePackage(srcPath, { ...srcPackageJson, version });
}

copyVersionNumber()
  .then(version => console.log(`Overwrote src/package.json version number with ${version}`))
  .catch(err => console.error(`Failed to overwrite version number: ${err.message}`));
