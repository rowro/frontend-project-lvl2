import { describe, expect, test } from '@jest/globals';
import genDiff from '../src/gendiff.js';

const filename1 = './tests/__fixtures__/file1.json';
const filename2 = './tests/__fixtures__/file2.json';

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
    const diff = genDiff(filename1, filename2);
    expect(diff).toMatch(result);
  });
});
