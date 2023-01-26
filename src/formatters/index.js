import stylish from './stylish.js';
import plain from './plain.js';

const getFormatter = (name = 'stylish') => {
  if (name === 'plain') {
    return plain;
  }

  return stylish;
};

export default getFormatter;
