import isArray from 'lodash/isArray.js';

const SPACE = ' ';
const SPACE_COUNT = 4;

const chars = {
  added: '+',
  removed: '-',
  noChanges: ' ',
  deepChanges: ' ',
};

const getTemplate = (spacer, char, key, value) => `${spacer}${char} ${key}: ${value}`.trimEnd();
const getRootTemplate = (items, depth) => {
  if (!items.length) {
    return '{}';
  }

  return `{\n${items.join('\n')}\n${SPACE.repeat(SPACE_COUNT * (depth - 1))}}`;
};

const stylish = (item, depth = 1) => {
  const values = item.flatMap(({
    action,
    key,
    valueFrom,
    valueTo,
  }) => {
    const spacer = SPACE.repeat((SPACE_COUNT * depth) - 2);
    const nextIter = (val) => (isArray(val) ? stylish(val, depth + 1) : String(val));

    if (action === 'updated') {
      return [
        getTemplate(spacer, chars.removed, key, nextIter(valueFrom)),
        getTemplate(spacer, chars.added, key, nextIter(valueTo)),
      ];
    }

    const value = action === 'removed' ? valueFrom : valueTo;

    return getTemplate(spacer, chars[action], key, nextIter(value));
  });

  return getRootTemplate(values, depth);
};

export default stylish;
