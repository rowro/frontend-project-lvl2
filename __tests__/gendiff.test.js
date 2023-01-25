import { describe, expect, test } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filenameJson1 = getFixturePath('file1.json');
const filenameJson2 = getFixturePath('file2.json');

const filenameYaml1 = getFixturePath('file1.yml');
const filenameYaml2 = getFixturePath('file2.yaml');

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
    expect(genDiff(filenameJson1, filenameJson2)).toMatch(result);
  });

  test('Diff flat yaml', () => {
    expect(genDiff(filenameYaml1, filenameYaml2)).toMatch(result);
  });

  test('Diff empty', () => {
    expect(genDiff(filenameEmpty, filenameEmpty)).toMatch('{}');
  });

  test('Diff accept only .json and .yml files', () => {
    expect(() => {
      genDiff(filenameJson1, filenameTxt);
    }).toThrow();
  });
});
