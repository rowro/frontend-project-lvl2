import _ from 'lodash';

const stylish = (data, replacer = ' ', spacesCount = 4) => {
  if (_.isEmpty(data)) {
    return '{}';
  }

  const iter = (item, depth = 1) => {
    if (_.isObject(item)) {
      const values = Object.entries(item).map(([key, value]) => {
        const hasLeadCharacterOrSpace = key.match(/[+-]/) || key.match(/\s\s/);
        const spacerLength = hasLeadCharacterOrSpace ? (spacesCount * depth) - 2 : spacesCount * depth;
        const spacer = replacer.repeat(spacerLength);
        const content = iter(value, depth + 1);

        if (!content) {
          return `${spacer}${key}:`;
        }

        return `${spacer}${key}: ${content}`;
      });

      return `{\n${values.join('\n')}\n${replacer.repeat(spacesCount * (depth - 1))}}`;
    }

    return String(item);
  };

  return iter(data);
};

export default stylish;
