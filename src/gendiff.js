import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const templates = {
  add: (key, value) => `  + ${key}: ${value}`,
  remove: (key, value) => `  - ${key}: ${value}`,
  noChanges: (key, value) => `    ${key}: ${value}`,
};

const parseFile = (filename) => {
  const file = fs.readFileSync(filename, 'utf8');

  if (path.extname(filename) === '.json') {
    return JSON.parse(file);
  }

  throw new Error('Only json files accepted');
};

const genDiff = (filename1, filename2) => {
  const obj1 = parseFile(filename1);
  const obj2 = parseFile(filename2);

  const keys = _.uniq([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  const diff = _.sortBy(keys).flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 === value2) {
      return templates.noChanges(key, value1);
    }

    if (!_.isUndefined(value1) && _.isUndefined(value2)) {
      return templates.remove(key, value1);
    }

    if (!_.isUndefined(value2) && _.isUndefined(value1)) {
      return templates.add(key, value2);
    }

    return [templates.remove(key, value1), templates.add(key, value2)];
  });

  return diff.length ? `{\n${diff.join('\n')}\n}` : '{}';
};

export default genDiff;
