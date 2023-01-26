import stylish from './stylish.js';
import plain from './plain.js';
import json from './json.js';

const getFormatter = (name = 'stylish') => {
  if (name === 'plain') {
    return plain;
  }

  if (name === 'json') {
    return json;
  }

  return stylish;
};

export default getFormatter;
