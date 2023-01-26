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

const filenameResultStylish = getFixturePath('resultStylish.txt');
const filenameResultPlain = getFixturePath('resultPlain.txt');

const filenameTxt = getFixturePath('fileText.txt');
const filenameEmpty = getFixturePath('fileEmpty.json');

describe('genDiff', () => {
  let resultStylish;
  let resultPlain;

  beforeEach(() => {
    resultStylish = fs.readFileSync(filenameResultStylish, 'utf8').trim();
    resultPlain = fs.readFileSync(filenameResultPlain, 'utf8').trim();
  });

  test('Diff json', () => {
    expect(genDiff(filenameJson1, filenameJson2)).toEqual(resultStylish);
    expect(genDiff(filenameEmpty, filenameEmpty)).toEqual('{}');
  });

  test('Diff yaml', () => {
    expect(genDiff(filenameYaml1, filenameYaml2)).toEqual(resultStylish);
  });

  test('Diff with plain formatter', () => {
    expect(genDiff(filenameJson1, filenameJson2, 'plain')).toEqual(resultPlain);
    expect(genDiff(filenameEmpty, filenameEmpty)).toEqual('{}');
  });

  test('Diff accept only .json and .yml files', () => {
    expect(() => {
      genDiff(filenameJson1, filenameTxt);
    }).toThrow();
  });
});
