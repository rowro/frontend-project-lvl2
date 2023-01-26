import _ from 'lodash';

const chars = {
  added: '+',
  removed: '-',
  noChanges: ' ',
};

const stylish = (data, replacer = ' ', spacesCount = 4) => {
  if (_.isEmpty(data)) {
    return '{}';
  }

  const iter = (item, depth = 1) => {
    if (_.isArray(item)) {
      const values = item.map(({ action, key, value }) => {
        const spacer = replacer.repeat((spacesCount * depth) - 2);
        const content = iter(value, depth + 1);
        const character = chars[action ?? 'noChanges'];

        return `${spacer}${character} ${key}: ${content}`.trimEnd();
      });

      return `{\n${values.join('\n')}\n${replacer.repeat(spacesCount * (depth - 1))}}`;
    }

    return String(item);
  };

  return iter(data);
};

export default stylish;
