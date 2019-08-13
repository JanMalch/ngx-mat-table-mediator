import * as fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

async function createNoJekyllFile() {
  return writeFile('./docs/.nojekyll', '');
}

createNoJekyllFile();
