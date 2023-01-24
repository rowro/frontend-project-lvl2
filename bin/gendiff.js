#!/usr/bin/env node
import { program } from 'commander';

import genDiff from '../src/gendiff.js';

program
  .name('gendiff')
  .arguments('filepath1')
  .arguments('filepath2')
  .description('Compares two configuration files and shows a difference.')
  .action((filename1, filename2) => {
    const diff = genDiff(filename1, filename2);
    console.log(diff);
  })
  .version('1.0.0')
  .option('-f, --format <type>', 'output format');

program.parse();
