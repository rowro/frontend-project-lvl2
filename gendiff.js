#!/usr/bin/env node
const _ = require('lodash');
const fs = require('fs');
const path = require('path')

const {program} = require('commander');

const templates = {
    add: (key, value) => `  + ${key}: ${value}`,
    remove: (key, value) => `  - ${key}: ${value}`,
    noChanges: (key, value) => `    ${key}: ${value}`,
}

const parseFile = (filename) => {
    const file = fs.readFileSync(filename, 'utf8');

    if (path.extname(filename) === '.json') {
        return JSON.parse(file);
    }

    return {};
}
const genDiff = (filename1, filename2) => {
    const obj1 = parseFile(filename1);
    const obj2 = parseFile(filename2);

    let keys = _.uniq([
        ...Object.keys(obj1),
        ...Object.keys(obj2),
    ]);

    const diff = _.sortBy(keys).flatMap((key) => {
        const value1 = obj1[key];
        const value2 = obj2[key];

        if (value1 === value2) {
            return templates.noChanges(key, value1);
        }

        if (!_.isUndefined(value1) && _.isUndefined(value2)) {
            return templates.remove(key, value1);
        }

        if (!_.isUndefined(value2) && _.isUndefined(value1)) {
            return templates.add(key, value2);
        }

        return [templates.remove(key, value1), templates.add(key, value2)]
    });

    return `{\n${diff.join('\n')}\n}`;
}

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
