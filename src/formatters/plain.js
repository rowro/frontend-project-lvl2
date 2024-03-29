import isArray from 'lodash/isArray.js';
import isObject from 'lodash/isObject.js';
import isString from 'lodash/isString.js';

const toString = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }

  if (isString(value)) {
    return `'${value}'`;
  }

  return value;
};

const messages = {
  added: (path, value) => `Property '${path}' was added with value: ${toString(value)}`,
  removed: (path) => `Property '${path}' was removed`,
  // eslint-disable-next-line max-len
  updated: (path, valueFrom, valueTo) => `Property '${path}' was updated. From ${toString(valueFrom)} to ${toString(valueTo)}`,
};

const plain = (item, path = '') => item.flatMap(({
  action, key, valueFrom, valueTo,
}) => {
  const newPath = path ? `${path}.${key}` : key;

  switch (action) {
    case 'updated':
      return messages.updated(newPath, valueFrom, valueTo);
    case 'added':
      return messages.added(newPath, valueTo);
    case 'removed':
      return messages.removed(newPath);
    case 'deepChanges':
      return isArray(valueTo) ? plain(valueTo, newPath) : valueTo;
    default:
      return [];
  }
}).join('\n');

export default plain;
