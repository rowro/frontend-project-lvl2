import _ from 'lodash';

const toString = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
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

const plain = (data) => {
  const iter = (item, path = '') => {
    if (_.isArray(item)) {
      const values = item.flatMap(({
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
            return iter(valueTo, newPath);
          default:
            return [];
        }
      });

      return values.join('\n');
    }

    return item;
  };

  return iter(data);
};

export default plain;
