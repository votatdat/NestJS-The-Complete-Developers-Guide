import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    const filename = join(__dirname, '..', 'test.sqlite');
    await rm(filename);
  } catch (err) {
    console.error('ERROR', err);
  }
});
