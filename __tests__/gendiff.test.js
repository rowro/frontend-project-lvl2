import { describe, expect, test } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filename1 = getFixturePath('file1.json');
const filename2 = getFixturePath('file2.json');
const filenameTxt = getFixturePath('fileText.txt');
const filenameEmpty = getFixturePath('fileEmpty.json');

const result = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

describe('genDiff', () => {
  test('Diff flat json', () => {
    expect(genDiff(filename1, filename2)).toMatch(result);

    expect(genDiff(filenameEmpty, filenameEmpty)).toMatch('{}');
  });

  test('Diff accept only json files', () => {
    expect(() => {
      genDiff(filename1, filenameTxt);
    }).toThrow();
  });
});
