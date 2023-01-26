import _ from 'lodash';
import parseFile from './parsers.js';
import stylish from './stylish.js';

const getTree = (obj) => Object.keys(obj).map((key) => {
  const value = obj[key];

  if (_.isObject(value)) {
    return { action: null, key, value: getTree(value) };
  }

  return { action: null, key, value };
});

const getNode = (action, key, value) => ({
  action,
  key,
  value: _.isObject(value) ? getTree(value) : value,
});

const findDiff = (obj1, obj2) => {
  const keys = _.uniq([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  return _.sortBy(keys).flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    const hasChanges = !_.isUndefined(value1) && !_.isUndefined(value2) && value1 !== value2;

    if (hasChanges) {
      if (_.isObject(value1) && _.isObject(value2)) {
        return { action: null, key, value: findDiff(value1, value2) };
      }

      return [
        getNode('removed', key, value1),
        getNode('added', key, value2),
      ];
    }

    if (_.isUndefined(value2)) {
      return getNode('removed', key, value1);
    }

    if (_.isUndefined(value1)) {
      return getNode('added', key, value2);
    }

    return getNode(null, key, value1);
  });
};

const genDiff = (filename1, filename2, formatter = stylish) => {
  const obj1 = parseFile(filename1);
  const obj2 = parseFile(filename2);

  const diff = findDiff(obj1, obj2);
  console.dir(diff, { depth: null });

  return formatter(diff);
};

export default genDiff;
