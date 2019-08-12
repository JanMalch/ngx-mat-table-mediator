import { exec as _exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';
import { getPackage } from './copy-package-version';

const exec = promisify(_exec);

async function amendVersion() {
  const topLevelPath = join(__dirname, '../package.json');
  const { version } = await getPackage(topLevelPath);
  return exec(`git commit --amend -m "chore(release): ${version}" -- src/package.json`);
}

amendVersion();
