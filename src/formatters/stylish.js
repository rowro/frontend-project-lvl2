import _ from 'lodash';

const chars = {
  added: '+',
  removed: '-',
  noChanges: ' ',
  deepChanges: ' ',
};

const getTemplate = (spacer, char, key, value) => `${spacer}${char} ${key}: ${value}`.trimEnd();

const stylish = (data, replacer = ' ', spacesCount = 4) => {
  if (_.isEmpty(data)) {
    return '{}';
  }

  const iter = (item, depth = 1) => {
    if (_.isArray(item)) {
      const values = item.flatMap(({
        action,
        key,
        valueFrom,
        valueTo,
      }) => {
        const spacer = replacer.repeat((spacesCount * depth) - 2);
        const nextIter = (val) => iter(val, depth + 1);

        if (action === 'updated') {
          return [
            getTemplate(spacer, chars.removed, key, nextIter(valueFrom)),
            getTemplate(spacer, chars.added, key, nextIter(valueTo)),
          ];
        }

        const value = action === 'removed' ? valueFrom : valueTo;

        return getTemplate(spacer, chars[action], key, nextIter(value));
      });

      return `{\n${values.join('\n')}\n${replacer.repeat(spacesCount * (depth - 1))}}`;
    }

    return String(item);
  };

  return iter(data);
};

export default stylish;
