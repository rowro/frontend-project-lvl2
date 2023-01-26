import isArray from 'lodash/isArray';

const SPACE = ' ';
const SPACE_COUNT = 4;

const chars = {
  added: '+',
  removed: '-',
  noChanges: ' ',
  deepChanges: ' ',
};

const getTemplate = (spacer, char, key, value) => `${spacer}${char} ${key}: ${value}`.trimEnd();

const stylish = (item, depth = 1) => {
  if (!isArray(item)) {
    return String(item);
  }

  const values = item.flatMap(({
    action,
    key,
    valueFrom,
    valueTo,
  }) => {
    const spacer = SPACE.repeat((SPACE_COUNT * depth) - 2);
    const nextIter = (val) => stylish(val, depth + 1);

    if (action === 'updated') {
      return [
        getTemplate(spacer, chars.removed, key, nextIter(valueFrom)),
        getTemplate(spacer, chars.added, key, nextIter(valueTo)),
      ];
    }

    const value = action === 'removed' ? valueFrom : valueTo;

    return getTemplate(spacer, chars[action], key, nextIter(value));
  });

  if (!values.length) {
    return '{}';
  }

  return `{\n${values.join('\n')}\n${SPACE.repeat(SPACE_COUNT * (depth - 1))}}`;
};

export default stylish;
