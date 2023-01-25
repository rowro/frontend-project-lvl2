import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const parseFile = (filename) => {
  const file = fs.readFileSync(filename, 'utf8');
  const ext = path.extname(filename);

  if (ext === '.json') {
    return JSON.parse(file);
  }

  if (['.yml', '.yaml'].includes(ext)) {
    return yaml.load(file);
  }

  throw new Error('Only .json and .yaml files accepted');
};

export default parseFile;
