import {
  beforeEach, describe, expect, test,
} from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filenameJson1 = getFixturePath('file1.json');
const filenameJson2 = getFixturePath('file2.json');

const filenameYaml1 = getFixturePath('file1.yml');
const filenameYaml2 = getFixturePath('file2.yaml');

const filenameResult = getFixturePath('result.txt');

const filenameTxt = getFixturePath('fileText.txt');
const filenameEmpty = getFixturePath('fileEmpty.json');

describe('genDiff', () => {
  let result;
  beforeEach(() => {
    result = fs.readFileSync(filenameResult, 'utf8').trim();
  });

  test('Diff json', () => {
    expect(genDiff(filenameJson1, filenameJson2)).toEqual(result);
  });

  test('Diff yaml', () => {
    expect(genDiff(filenameYaml1, filenameYaml2)).toEqual(result);
  });

  test('Diff empty', () => {
    expect(genDiff(filenameEmpty, filenameEmpty)).toEqual('{}');
  });

  test('Diff accept only .json and .yml files', () => {
    expect(() => {
      genDiff(filenameJson1, filenameTxt);
    }).toThrow();
  });
});
