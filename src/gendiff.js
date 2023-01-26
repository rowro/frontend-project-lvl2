import _ from 'lodash';
import parseFile from './parsers.js';
import getFormatter from './formatters/index.js';

const getTree = (data) => {
  if (!_.isObject(data)) {
    return data;
  }

  return Object.entries(data).map(([key, value]) => ({
    action: 'noChanges',
    key,
    valueTo: _.isObject(value) ? getTree(value) : value,
  }));
};

const getAction = (value1, value2) => {
  const isAdded = _.isUndefined(value1);
  const isRemoved = _.isUndefined(value2);
  const isUpdated = !isRemoved && !isAdded && value1 !== value2;
  const isDeepChanges = isUpdated && _.isObject(value1) && _.isObject(value2);

  if (isDeepChanges) return 'deepChanges';
  if (isUpdated) return 'updated';
  if (isRemoved) return 'removed';
  if (isAdded) return 'added';
  return 'noChanges';
};

const findDiff = (obj1, obj2) => {
  const keys = _.uniq([
    ...Object.keys(obj1),
    ...Object.keys(obj2),
  ]);

  return _.sortBy(keys).flatMap((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    const action = getAction(value1, value2);
    const valueFrom = ['updated', 'removed'].includes(action) ? getTree(value1) : undefined;
    let valueTo;

    if (action === 'deepChanges') {
      valueTo = findDiff(value1, value2);
    } else if (action !== 'removed') {
      valueTo = getTree(value2);
    }

    return {
      action,
      key,
      valueFrom,
      valueTo,
    };
  });
};

const genDiff = (filename1, filename2, formatterName = 'stylish') => {
  const obj1 = parseFile(filename1);
  const obj2 = parseFile(filename2);
  const formatter = getFormatter(formatterName);

  const diff = findDiff(obj1, obj2);

  return formatter(diff);
};

export default genDiff;
