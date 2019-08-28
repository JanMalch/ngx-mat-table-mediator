import { join } from 'path';
import { existsSync, createReadStream, createWriteStream } from 'fs';

import { name } from '../package.json';

function copyReadmeAfterSuccessfulBuild(): void {
  const path = join(__dirname, '../src/lib/components/mtm-theme.css');
  const doesNotExist = !existsSync(path);

  if (doesNotExist) {
    return console.warn(`${path} doesn't exist!`);
  }

  createReadStream(path)
    .pipe(createWriteStream(join(__dirname, `../dist/${name}/mtm-theme.css`)))
    .on('finish', () => {
      console.log(`Successfully copied mtm-theme.css into dist/${name} folder!`);
    });
}

copyReadmeAfterSuccessfulBuild();
