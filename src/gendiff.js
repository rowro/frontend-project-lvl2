import _ from 'lodash';
import parseFile from './parsers.js';

const findDiff = (obj1, obj2) => {
  const keys = _.uniq([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  return _.sortBy(keys).reduce((acc, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const plus = ['+', key, value2];
    const minus = ['-', key, value1];
    const noChanges = [' ', key, value1];

    if (value1 === value2) {
      return [...acc, noChanges];
    }

    if (_.isUndefined(value1) || _.isUndefined(value2)) {
      return [
        ...acc,
        _.isUndefined(value2) ? minus : plus,
      ];
    }

    return [...acc, minus, plus];
  }, []);
};

const formatDiff = (diff) => {
  if (!diff.length) {
    return '{}';
  }

  const content = diff.map(([char, key, value]) => `  ${char} ${key}: ${value}`).join('\n');

  return `{\n${content}\n}`;
};

const genDiff = (filename1, filename2) => {
  const obj1 = parseFile(filename1);
  const obj2 = parseFile(filename2);

  const diff = findDiff(obj1, obj2);

  return formatDiff(diff);
};

export default genDiff;
