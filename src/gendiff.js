import _ from 'lodash';
import parseFile from './parsers.js';
import stylish from './stylish.js';

const findDiff = (obj1, obj2) => {
  const keys = _.uniq([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  return _.sortBy(keys).reduce((acc, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const diffKeys = {
      plus: `+ ${key}`,
      minus: `- ${key}`,
      noChanges: `  ${key}`,
    };

    if (!_.isUndefined(value1) && !_.isUndefined(value2) && value1 !== value2) {
      if (_.isObject(value1) && _.isObject(value2)) {
        return {
          ...acc,
          [diffKeys.noChanges]: findDiff(value1, value2),
        };
      }

      return {
        ...acc,
        [diffKeys.minus]: value1,
        [diffKeys.plus]: value2,
      };
    }

    if (_.isUndefined(value1) || _.isUndefined(value2)) {
      if (_.isUndefined(value2)) {
        return {
          ...acc,
          [diffKeys.minus]: value1,
        };
      }

      return {
        ...acc,
        [diffKeys.plus]: value2,
      };
    }

    return {
      ...acc,
      [diffKeys.noChanges]: value1,
    };
  }, {});
};

const genDiff = (filename1, filename2, formatter = stylish) => {
  const obj1 = parseFile(filename1);
  const obj2 = parseFile(filename2);

  const diff = findDiff(obj1, obj2);
  console.dir(diff, { depth: null });

  return formatter(diff);
};

export default genDiff;
